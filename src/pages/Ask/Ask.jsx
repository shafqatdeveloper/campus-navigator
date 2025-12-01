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

    // ---------------- RECORDING FUNCTIONS ----------------
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            sendAudioToBackend(audioBlob);
        };
    };

    // ---------------- SEND AUDIO TO BACKEND ----------------
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

    // ---------------- SEND TEXT ----------------
    const sendTextQuestion = async () => {
        if (!question.trim()) return;

        setLoading(true);
        setResponse("");

        try {
            const res = await fetch("http://YOUR_BACKEND_IP:5000/ask/text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
        <div className="min-h-screen w-full bg-[#0A0F1F] text-white px-6 py-10 relative overflow-hidden">

            {/* Floating gradients to match homepage */}
            <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[140px] animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[140px] animate-pulse-slower" />

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-6">

                {/* Back button */}
                <Link
                    to={"/"}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white 
                     bg-[#1C2431] px-4 py-2 rounded-xl w-fit border border-gray-700/30 
                     transition hover:bg-[#243042]"
                >
                    <FaArrowLeft /> Back to Home
                </Link>

                {/* Heading */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-1 
                       bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300
                       animate-gradient-x">
                    Ask the Assistant
                </h1>

                <p className="text-center text-gray-300 text-lg opacity-80">
                    Type or speak your question — I’m here to help around the whole campus. 🎧✨
                </p>

                {/* ---------------- RESPONSE BOX ---------------- */}
                <div className="bg-[#101726] p-6 rounded-2xl border border-slate-700/40
                        shadow-xl shadow-black/30 min-h-[140px] transition">
                    {loading ? (
                        <p className="text-blue-400 animate-pulse text-lg">Thinking…</p>
                    ) : response ? (
                        <p className="text-gray-200 leading-relaxed">{response}</p>
                    ) : (
                        <p className="text-gray-500">Ask something…</p>
                    )}
                </div>

                {/* ---------------- INPUT SECTION ---------------- */}
                <div className="flex items-center gap-3 w-full bg-[#1C2431] border border-gray-700/50 
                        px-4 py-3 rounded-2xl shadow-lg shadow-black/20">

                    <input
                        type="text"
                        placeholder="Type your question..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="flex-1 bg-transparent text-white placeholder-gray-500
                       focus:outline-none text-sm"
                    />

                    {/* Send button */}
                    <button
                        onClick={sendTextQuestion}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-xl 
                       transition text-lg flex items-center justify-center"
                    >
                        <FaPaperPlane />
                    </button>

                    {/* Mic / Stop button */}
                    {!recording ? (
                        <button
                            onClick={startRecording}
                            className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl 
                         transition text-lg"
                        >
                            <FaMicrophone />
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-xl 
                         transition text-lg"
                        >
                            <FaStop />
                        </button>
                    )}
                </div>
            </div>

            {/* Animations */}
            <style>{`
        .animate-pulse-slow {
          animation: pulse 6s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse 9s ease-in-out infinite;
        }
        @keyframes pulse {
          0% { opacity: .5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: .5; transform: scale(1); }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: left center; }
          50% { background-position: right center; }
        }
      `}</style>
        </div>
    );
};

export default Ask;
