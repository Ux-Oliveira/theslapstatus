import ffmpeg from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"
import fs from "fs"
import path from "path"
import { createCanvas, registerFont } from "canvas"

ffmpeg.setFfmpegPath(
    ffmpegPath.replace("app.asar", "app.asar.unpacked")
)

registerFont(path.join(process.cwd(), "fonts/arial.ttf"), {
    family: "ArialCustom"
})

registerFont(path.join(process.cwd(), "fonts/seguiemj.ttf"), {
    family: "EmojiCustom"
})

export default function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).end()
    }

    let { name, status, status2, status3, mood, image } = req.body

function sanitizeText(text) {
    return String(text || "")
        .replace(/[\x00-\x1F\x7F]/g, "")
        .trim()
}

name = sanitizeText(name).slice(0, 25)

if (name && !name.endsWith(":")) {
    name += ":"
}

status = sanitizeText(status).slice(0, 29)
status2 = sanitizeText(status2).slice(0, 29)
status3 = sanitizeText(status3).slice(0, 29)

mood = sanitizeText(mood).slice(0, 29)

    const id = Date.now()

    const basevideo = path.join(process.cwd(), "public/basevid.mp4")
    const output = path.join("/tmp", `pear-output-${id}.mp4`)
    const imagePath = path.join("/tmp", `pear-img-${id}.png`)
    const namePath = path.join("/tmp", `pear-name-${id}.png`)
    const statusPath = path.join("/tmp", `pear-status-${id}.png`)
    const status2Path = path.join("/tmp", `pear-status2-${id}.png`)
    const status3Path = path.join("/tmp", `pear-status3-${id}.png`)
    const moodPath = path.join("/tmp", `pear-mood-${id}.png`)

    console.log("API HIT")
    console.log("Video exists?", fs.existsSync(basevideo))

    try {

        if (!image) {
            return res.status(400).send("No image provided")
        }

        const base64Data = image.replace(/^data:image\/\w+;base64,/, "")
        fs.writeFileSync(imagePath, base64Data, "base64")

        function makeTextImage(text, outPath, fontSize, color, x, y, fontFamily) {
            const canvas = createCanvas(1080, 1920)
            const ctx = canvas.getContext("2d")

            ctx.clearRect(0, 0, 1080, 1920)
            ctx.font = `${fontSize}px ${fontFamily}`
            ctx.fillStyle = color
            ctx.textBaseline = "top"
            ctx.fillText(text, x, y)

            fs.writeFileSync(outPath, canvas.toBuffer("image/png"))
        }

        makeTextImage(name, namePath, 55, "purple", 200, 730, "ArialCustom")
        makeTextImage(status, statusPath, 55, "black", 135, 880, "ArialCustom")
        makeTextImage(status2, status2Path, 55, "black", 135, 950, "ArialCustom")
        makeTextImage(status3, status3Path, 55, "black", 135, 1020, "ArialCustom")
        makeTextImage(mood, moodPath, 55, "black", 135, 1320, `"ArialCustom","EmojiCustom",sans-serif`)
    } catch (err) {

        console.error("Image error:", err)
        return res.status(500).send("Image processing failed")
    }

     ffmpeg(basevideo)
    .input(imagePath)
    .input(namePath)
    .input(statusPath)
    .input(status2Path)
    .input(status3Path)
    .input(moodPath)

.complexFilter([

    "[0:v]scale=1080:1920,setsar=1[base]",

    "[1:v]scale=452:154,format=rgba,rotate=12*PI/180:c=none:ow=rotw(12*PI/180):oh=roth(12*PI/180):bilinear=0[img]",

    "[base][img]overlay=x=600:y=470:enable='gte(t\\,0.7)'[v1]",

    // -----------------------------
    // FIXED TEXT PIPELINE (NO VSTACK)
    // -----------------------------

    "[2:v]format=rgba[n1]",
    "[3:v]format=rgba[n2]",
    "[4:v]format=rgba[n3]",
    "[5:v]format=rgba[n4]",
    "[6:v]format=rgba[n5]",

    "[n1][n2]overlay=0:0[tmp1]",
    "[tmp1][n3]overlay=0:0[tmp2]",
    "[tmp2][n4]overlay=0:0[tmp3]",
    "[tmp3][n5]overlay=0:0[textstack]",

    "[textstack]rotate=13*PI/180:c=none:ow=rotw(iw):oh=roth(ih)[textrot]",

    "[v1][textrot]overlay=x=-20:y=75:format=auto:enable='gte(t\\,0.7)'[final]"

])

        .outputOptions([
            "-map [final]",
            "-map 0:a?",
            "-t 6",
            "-pix_fmt yuv420p"
        ])

        .on("start", cmd => {
            console.log("FFmpeg command:", cmd)
        })

        .on("stderr", line => {
            console.log("FFmpeg stderr:", line)
        })

        .on("error", err => {

            console.error("PEAR FFmpeg ERROR:", err)

            try {
                if (fs.existsSync(output)) fs.unlinkSync(output)
                if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
                if (fs.existsSync(namePath)) fs.unlinkSync(namePath)
                if (fs.existsSync(statusPath)) fs.unlinkSync(statusPath)
                if (fs.existsSync(status2Path)) fs.unlinkSync(status2Path)
                if (fs.existsSync(status3Path)) fs.unlinkSync(status3Path)
                if (fs.existsSync(moodPath)) fs.unlinkSync(moodPath)
            } catch {}

            if (!res.headersSent) {
                res.status(500).send("FFmpeg failed")
            }
        })

        .on("end", () => {

            console.log("FINISHED")

            try {

                const videoBuffer = fs.readFileSync(output)

                res.setHeader("Content-Type", "video/mp4")
                res.send(videoBuffer)

                if (fs.existsSync(output)) fs.unlinkSync(output)
                if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
                if (fs.existsSync(namePath)) fs.unlinkSync(namePath)
                if (fs.existsSync(statusPath)) fs.unlinkSync(statusPath)
                if (fs.existsSync(status2Path)) fs.unlinkSync(status2Path)
                if (fs.existsSync(status3Path)) fs.unlinkSync(status3Path)
                if (fs.existsSync(moodPath)) fs.unlinkSync(moodPath)

            } catch (err) {

                console.error("Read error:", err)
                res.status(500).send("Output read failed")
            }
        })

        .save(output)
}
