import React, { useState, useRef } from "react";
import { FaMicrophone, FaStop, FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const Ask = () => {

    const [question, setQuestion] = useState("");
    const [recording, setRecording] = useState(false);
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // ---------------------------------------------------
    // HANDLE AUDIO RECORDING
    // ---------------------------------------------------
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            audioChunksRef.current = [];
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.start();
            setRecording(true);

            mediaRecorder.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };
        } catch (err) {
            alert("Microphone permission needed!");
            console.error(err);
        }
    };

    const stopRecording = () => {
        const mediaRecorder = mediaRecorderRef.current;
        if (!mediaRecorder) return;

        mediaRecorder.stop();
        setRecording(false);

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, {
                type: "audio/webm",
            });

            sendAudioToBackend(audioBlob);
        };
    };

    // ---------------------------------------------------
    // SEND AUDIO TO BACKEND
    // ---------------------------------------------------
    const sendAudioToBackend = async (audioBlob) => {
        setLoading(true);
        setResponse("");

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        try {
            const res = await fetch("http://YOUR_BACKEND_IP:5000/ask/audio", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setResponse(data.answer || "No response received.");
        } catch (err) {
            console.error(err);
            setResponse("Error sending audio.");
        }

        setLoading(false);
    };

    // ---------------------------------------------------
    // SEND TYPED QUESTION
    // ---------------------------------------------------
    const sendTextQuestion = async () => {
        if (!question.trim()) return;

        setLoading(true);
        setResponse("");

        try {
            const res = await fetch("http://YOUR_BACKEND_IP:5000/ask/text", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question }),
            });

            const data = await res.json();
            setResponse(data.answer || "No answer found.");
        } catch (err) {
            console.error(err);
            setResponse("Server error.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full bg-[#0B0F19] text-white px-6 py-10 flex flex-col gap-6">

            {/* ---------------- BACK TO HOME BUTTON ---------------- */}
            <Link
                to={"/"}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white 
                           bg-[#1F2937] px-4 py-2 rounded-lg w-fit transition"
            >
                <FaArrowLeft /> Back to Home
            </Link>

            <h1 className="text-3xl font-bold text-center">Ask the Assistant</h1>

            {/* ---------------- RESPONSE BOX ---------------- */}
            <div className="bg-[#111827] p-5 rounded-xl border border-gray-700 min-h-[120px]">
                {loading ? (
                    <p className="text-blue-400 animate-pulse">Thinking...</p>
                ) : response ? (
                    <p>{response}</p>
                ) : (
                    <p className="text-gray-500">Ask something…</p>
                )}
            </div>

            {/* ---------------- INPUT / RECORD SECTION ---------------- */}
            <div className="flex items-center gap-3 w-full">
                {/* Text input */}
                <input
                    type="text"
                    className="flex-1 bg-[#1F2937] border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Type your question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />

                {/* Send button */}
                <button
                    onClick={sendTextQuestion}
                    className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl transition"
                >
                    <FaPaperPlane />
                </button>

                {/* Voice Record button */}
                {!recording ? (
                    <button
                        onClick={startRecording}
                        className="bg-red-600 hover:bg-red-700 p-3 rounded-xl transition"
                    >
                        <FaMicrophone />
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="bg-gray-600 hover:bg-gray-700 p-3 rounded-xl transition"
                    >
                        <FaStop />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Ask;
