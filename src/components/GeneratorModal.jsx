import { useState, useRef } from "react"

export default function GeneratorModal({ close }) {

 const [name, setName] = useState("")
 const [status, setStatus] = useState("")
 const [status2, setStatus2] = useState("")
 const [status3, setStatus3] = useState("")
 const [mood, setMood] = useState("")
 const [selectedEmoji, setSelectedEmoji] = useState("")
 const [photo, setPhoto] = useState(null)
 const [loading, setLoading] = useState(false)
 const [selectedPhone, setSelectedPhone] = useState("")
 const [showEmojiPicker, setShowEmojiPicker] = useState(false)

 const statusRef1 = useRef(null)
 const statusRef2 = useRef(null)
 const statusRef3 = useRef(null)

 const emojis = [
    "😀","😁","😂","🤣","😃","😄","😅","😊","🙂","😉",
    "😍","🥰","😘","😎","🤩","😭","😡","😴","🤔","🙄",
    "😳","🥺","🔥","💀","❤️","💔","✨","⭐","💫","⚡",
    "👍","👎","👏","🙌","👀","🎵","🎶","🌙","☀️","🌧️",
    "☁️","🍃","🌸","🖤","💜","💙","💚","💛","🧡","📱",
    "🎮","🎬","📸","🕶️","💻","🪐","🌎","🛸","🐱","🐶"
 ]

 function handleImage(e) {

    const file = e.target.files[0]

    if (!file) return

    console.log("TYPE:", file.type)
    console.log("NAME:", file.name)

    if (file.size > 20000000) {
        alert("image too large (max 20MB)")
        return
    }

    setPhoto(file)
 }

 function addEmoji(emoji) {

    setSelectedEmoji(emoji)

    const cleanMood = mood.replace(selectedEmoji, "").trim()
    const updatedMood = `${cleanMood} ${emoji}`.trim()

    if (updatedMood.length <= 29) {
        setMood(updatedMood)
    }

    setShowEmojiPicker(false)
}

 function eraseAll() {
    setName("")
    setStatus("")
    setStatus2("")
    setStatus3("")
    setMood("")
    setSelectedEmoji("")
 }

 function handleNameChange(e) {

    let value = e.target.value

    if (value.length > 25) {
        return
    }

    setName(value)
 }

 function handleMoodChange(e) {

    let value = e.target.value

    if (value.length > 29) {
        return
    }

    setMood(value)
 }

 function handleStatus1(e) {

    let value = e.target.value

    if (value.length > 29) {
        return
    }

    setStatus(value)
 }

 function handleStatus2(e) {

    let value = e.target.value

    if (value.length > 29) {
        return
    }

    setStatus2(value)
 }

 function handleStatus3(e) {

    let value = e.target.value

    if (value.length > 29) {
        return
    }

    setStatus3(value)
 }

 async function generate() {

    if (!selectedPhone) {
        alert("Select a phone type")
        return
    }

    if (!photo) {
        alert("Add an inmage")
        return
    }

    if (name.length > 25) {
        alert("Name can only have 25 characters")
        return
    }

    if (status.length > 29 || status2.length > 29 || status3.length > 29) {
        alert("Each status line can only have 29 characters")
        return
    }

    if (mood.length > 29) {
        alert("Mood can only have 29 characters")
        return
    }

    setLoading(true)

    try {

        const reader = new FileReader()

        reader.onloadend = async () => {

            const base64 = reader.result

            const endpoint =
                selectedPhone === "normal"
                     ? "/api/generate-video"
                     : "/api/pear-video"

            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    status,
                    status2,
                    status3,
                    mood,
                    image: base64
                })
            })

            const videoBlob = await res.blob()
            const url = URL.createObjectURL(videoBlob)

            const a = document.createElement("a")
            a.href = url
            a.download = "slapstatus.mp4"
            a.click()

            setLoading(false)
        }

        reader.readAsDataURL(photo)

    } catch (err) {

        console.error(err)
        alert("Error generating your vid")
        setLoading(false)
    }
 }

return (

    <div className="overlay" onClick={close}>
        <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{
                maxHeight: "90vh",
                overflowY: "auto",
                width: "95%",
                maxWidth: "500px",
                boxSizing: "border-box"
            }}
        >

            <h1>Generate your own TheSlap video status!</h1>

            <h3
                style={{
                    fontSize: "14px",
                    marginTop: "-5px",
                    marginBottom: "12px",
                    fontWeight: "normal"
                }}
            >
                What phone do you want to post from?
            </h3>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    justifyContent: "center",
                    marginBottom: "20px"
                }}
            >

                <div
                    onClick={() => setSelectedPhone("normal")}
                    style={{
                        cursor: "pointer",
                        textAlign: "center"
                    }}
                >

                    <div
                        style={{
                            width: "90px",
                            height: "90px",
                            border:
                                selectedPhone === "normal"
                                    ? "3px solid purple"
                                    : "2px solid white",
                            borderRadius: "10px",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >

                        <img
                            src="/left.gif"
                            alt="Normal Phone"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                        />

                    </div>

                    <p
                        style={{
                            fontSize: "12px",
                            marginTop: "5px"
                        }}
                    >
                        Normal phone
                    </p>

                </div>

                <div
                    onClick={() => setSelectedPhone("pear")}
                    style={{
                        cursor: "pointer",
                        textAlign: "center"
                    }}
                >

                    <div
                        style={{
                            width: "90px",
                            height: "90px",
                            border:
                                selectedPhone === "pear"
                                    ? "3px solid purple"
                                    : "2px solid white",
                            borderRadius: "10px",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >

                        <img
                            src="/right.gif"
                            alt="Pear Phone"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }}
                        />

                    </div>

                    <p
                        style={{
                            fontSize: "12px",
                            marginTop: "5px"
                        }}
                    >
                        Pear Phone
                    </p>

                </div>

            </div>

            <input
                placeholder="Your name"
                value={name}
                onChange={handleNameChange}
            />

            <input
                placeholder="Status line 1"
                value={status}
                ref={statusRef1}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault()
                        statusRef2.current.focus()
                    }
                }}
                onChange={handleStatus1}
            />

            <input
                placeholder="Status line 2"
                value={status2}
                ref={statusRef2}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault()
                        statusRef3.current.focus()
                    }
                }}
                onChange={handleStatus2}
            />

            <input
                placeholder="Status line 3"
                value={status3}
                ref={statusRef3}
                onChange={handleStatus3}
            />

            <div
                style={{
                    position: "relative",
                    width: "100%"
                }}
            >

                <input
                    placeholder="Mood"
                    value={mood}
                    onChange={handleMoodChange}
                />

                <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        fontSize: "22px",
                        cursor: "pointer"
                    }}
                >
                    😉
                </button>

                {showEmojiPicker && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: "55px",
                            left: "0",
                            width: "100%",
                            background: "#111",
                            border: "2px solid white",
                            borderRadius: "12px",
                            padding: "10px",
                            display: "grid",
                            gridTemplateColumns: "repeat(5, 1fr)",
                            gap: "8px",
                            zIndex: 99,
                            maxHeight: "220px",
                            overflowY: "auto"
                        }}
                    >

                        {emojis.map((emoji, index) => (
                            <button
                                key={index}
                                onClick={() => addEmoji(emoji)}
                                style={{
                                    width: "100%",
                                    aspectRatio: "1/1",
                                    borderRadius: "8px",
                                    border: "1px solid #444",
                                    background: "#222",
                                    fontSize: "20px",
                                    cursor: "pointer"
                                }}
                            >
                                {emoji}
                            </button>
                        ))}

                    </div>
                )}

            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "10px",
                    marginBottom: "10px",
                    width: "100%"
                }}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    style={{
                        flex: 1,
                        minWidth: 0
                    }}
                />

                <button
                    onClick={eraseAll}
                    style={{
                        padding: "5px 10px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        flexShrink: 0
                    }}
                >
                    Erase
                </button>
            </div>

            <button onClick={generate}>
                {loading ? "On it..." : "Generate Your Status Now!"}
            </button>

            <button onClick={close}>
                Maybe later?
            </button>

        </div>
    </div>
 )
}
