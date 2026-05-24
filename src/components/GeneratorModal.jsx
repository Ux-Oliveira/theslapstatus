return (

    <div className="overlay" onClick={close}>
        <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
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
                    gap: "10px",
                    marginTop: "12px",
                    marginBottom: "12px"
                }}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    style={{
                        flex: 1
                    }}
                />

                <button
                    onClick={eraseAll}
                    style={{
                        padding: "8px 14px",
                        whiteSpace: "nowrap"
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
