import ffmpeg from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"
import fs from "fs"
import path from "path"

ffmpeg.setFfmpegPath(
    ffmpegPath.replace("app.asar", "app.asar.unpacked")
)

export default function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).end()
    }

    let { name, status, status2, status3, mood, image } = req.body

    name = (name || "").slice(0, 25).trim()

    if (name && !name.endsWith(":")) {
        name += ":"
    }

    status = (status || "").slice(0, 29)
    status2 = (status2 || "").slice(0, 29)
    status3 = (status3 || "").slice(0, 29)

    mood = (mood || "").slice(0, 29)

    const id = Date.now()

    const basevideo = path.join(process.cwd(), "public/basevid.mp4")
    const output = path.join("/tmp", `output-${id}.mp4`)
    const imagePath = path.join("/tmp", `img-${id}.png`)
    const moodPath = path.join("/tmp", `mood-${id}.txt`)

    const arialFont = path.join(process.cwd(), "fonts/arial.ttf")
        .replace(/\\/g, "/")
        .replace(/:/g, "\\:")

    const emojiFont = path.join(process.cwd(), "fonts/seguiemj.ttf")
        .replace(/\\/g, "/")
        .replace(/:/g, "\\:")

    console.log("API HIT")
    console.log("Video exists?", fs.existsSync(basevideo))

    try {

        const base64Data = image.replace(/^data:image\/\w+;base64,/, "")

        fs.writeFileSync(imagePath, base64Data, "base64")
        fs.writeFileSync(moodPath, mood, "utf8")

    } catch (err) {

        console.error("Image error:", err)
        return res.status(500).send("Image processing failed")
    }

    function escapeText(text) {

        return text
            .replace(/\\/g, "\\\\")
            .replace(/:/g, "\\:")
            .replace(/,/g, "\\,")
            .replace(/\[/g, "\\[")
            .replace(/\]/g, "\\]")
            .replace(/'/g, "’")
            .replace(/\n/g, "\\\\n")
    }

    const safeName = escapeText(name)
    const safeStatus = escapeText(status)
    const safeStatus2 = escapeText(status2)
    const safeStatus3 = escapeText(status3)

    const safeMoodPath = moodPath
        .replace(/\\/g, "/")
        .replace(/:/g, "\\:")

    ffmpeg(basevideo)
        .input(imagePath)

        .complexFilter([

            "[0:v]scale=1080:1920,setsar=1[base]",

            "[1:v]scale=452:154,format=rgba,rotate=12*PI/180:c=none:ow=rotw(12*PI/180):oh=roth(12*PI/180):bilinear=0[img]",

            "[base][img]overlay=x=600:y=470:enable='gte(t\\,0.7)'[v1]",

            "nullsrc=s=1080x1920:d=6,format=rgba[namebase]",

            "[namebase]drawtext=fontfile='" + arialFont + "':text='" + safeName + "':fontsize=44:fontcolor=purple@1.0:x=50:y=620:enable='gte(t\\,0.7)'[nametext]",

            "[nametext]rotate=13*PI/180:c=none[namerot]",

            "[v1][namerot]overlay=x=-20:y=75:format=auto[v2]",

            "nullsrc=s=1080x1920:d=6,format=rgba[statusbase]",

            "[statusbase]drawtext=fontfile='" + arialFont + "':text='" + safeStatus + "':fontsize=44:fontcolor=black@1.0:x=50:y=675:enable='gte(t\\,0.7)'[statustext]",

            "[statustext]rotate=13*PI/180:c=none[statusrot]",

            "[v2][statusrot]overlay=x=-20:y=75:format=auto[v3]",

            "nullsrc=s=1080x1920:d=6,format=rgba[statusbase2]",

            "[statusbase2]drawtext=fontfile='" + arialFont + "':text='" + safeStatus2 + "':fontsize=44:fontcolor=black@1.0:x=50:y=730:enable='gte(t\\,0.7)'[statustext2]",

            "[statustext2]rotate=13*PI/180:c=none[statusrot2]",

            "[v3][statusrot2]overlay=x=-20:y=75:format=auto[v4]",

            "nullsrc=s=1080x1920:d=6,format=rgba[statusbase3]",

            "[statusbase3]drawtext=fontfile='" + arialFont + "':text='" + safeStatus3 + "':fontsize=44:fontcolor=black@1.0:x=50:y=785:enable='gte(t\\,0.7)'[statustext3]",

            "[statustext3]rotate=13*PI/180:c=none[statusrot3]",

            "[v4][statusrot3]overlay=x=-20:y=75:format=auto[v5]",

            "nullsrc=s=1080x1920:d=6,format=rgba[moodbase]",

            "[moodbase]drawtext=fontfile='" + emojiFont + "':textfile='" + safeMoodPath + "':fontsize=40:fontcolor=black@1.0:x=60:y=1010:enable='gte(t\\,0.7)'[moodtext]",

            "[moodtext]rotate=13*PI/180:c=none[moodrot]",

            "[v5][moodrot]overlay=x=-20:y=120:format=auto[final]"

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
            console.error("FFmpeg ERROR:", err)
            res.status(500).send("FFmpeg failed")
        })

        .on("end", () => {

            console.log("FINISHED")

            try {

                const videoBuffer = fs.readFileSync(output)

                res.setHeader("Content-Type", "video/mp4")
                res.send(videoBuffer)

                if (fs.existsSync(output)) fs.unlinkSync(output)
                if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath)
                if (fs.existsSync(moodPath)) fs.unlinkSync(moodPath)

            } catch (err) {

                console.error("Read error:", err)
                res.status(500).send("Output read failed")
            }
        })

        .save(output)
}
