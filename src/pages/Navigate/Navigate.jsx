import React, { useState } from "react";
import { FaArrowLeft, FaPaperPlane, FaLocationArrow } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavigateCampus = () => {
    const nav = useNavigate();

    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [robotMsg, setRobotMsg] = useState("");

    const SUGGESTIONS = [
        "D4", "Faculty Offices", "CS Lab", "Library Entrance",
        "Block A", "Block B", "Block C", "Block D",
        "Exam Branch", "Accounts Office", "C2.5 Classroom",
        "Director Office", "Digital Library",
    ];

    const filtered = SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(location.toLowerCase())
    );

    const sendNavigation = async () => {
        if (!location.trim()) return;
        setLoading(true);
        setRobotMsg("");

        try {
            const res = await fetch("http://YOUR_BACKEND_IP:5000/robot/navigate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ destination: location }),
            });

            const data = await res.json();

            setRobotMsg(
                data.status === "ok"
                    ? `🚀 Robot is navigating to ${location}`
                    : "❌ Failed to send navigation command."
            );
        } catch (err) {
            setRobotMsg("⚠️ Robot connection error.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0A0F1F] text-white px-6 py-10 relative overflow-hidden">

            {/* Floating gradients */}
            <div className="absolute top-[-20%] left-[-12%] w-[450px] h-[450px] bg-blue-600/25 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-12%] w-[450px] h-[450px] bg-purple-600/25 rounded-full blur-[120px] animate-pulse-slower" />

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-8">

                {/* Back Button */}
                <button
                    onClick={() => nav("/")}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white
                               bg-[#1C2431]/70 px-4 py-2 rounded-xl border border-slate-700/40
                               backdrop-blur-lg transition w-fit hover:bg-[#243042]"
                >
                    <FaArrowLeft /> Back
                </button>

                {/* Heading */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-center tracking-tight
                               bg-clip-text text-transparent bg-gradient-to-r 
                               from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                    Navigate Campus
                </h1>
                <p className="text-center text-gray-400 text-sm opacity-80">
                    Command the robot to go anywhere on campus.
                </p>

                {/* STATUS BOX */}
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 
                                p-6 shadow-lg shadow-black/30 min-h-[90px]">
                    {loading ? (
                        <p className="text-blue-400 animate-pulse">Sending command to robot…</p>
                    ) : robotMsg ? (
                        <p className="text-gray-200">{robotMsg}</p>
                    ) : (
                        <p className="text-gray-500 text-sm">Enter a location to navigate…</p>
                    )}
                </div>

                {/* INPUT BOX */}
                <div className="flex items-center gap-3 w-full bg-[#1C2431]/60 border border-slate-700/40 
                                px-4 py-3 rounded-2xl backdrop-blur-lg shadow-lg shadow-black/20">

                    <input
                        type="text"
                        placeholder="Enter room or place (e.g., D4, Faculty Offices)"
                        className="flex-1 bg-transparent text-white placeholder-gray-500 
                                   focus:outline-none text-sm"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />

                    <button
                        onClick={sendNavigation}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-xl 
                                   transition shadow-blue-600/30"
                    >
                        <FaPaperPlane />
                    </button>
                </div>

                {/* Suggestions */}
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 
                                p-5 shadow-xl shadow-black/30 max-h-[40vh] overflow-y-auto space-y-3">

                    <p className="text-gray-400 text-sm">Suggestions</p>

                    {filtered.length > 0 ? (
                        filtered.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => setLocation(item)}
                                className="group relative cursor-pointer bg-slate-900/40 backdrop-blur-xl 
                                           border border-slate-700/50 p-3 rounded-2xl shadow-lg flex 
                                           items-center gap-3 transition-all duration-300 hover:-translate-y-1 
                                           hover:shadow-blue-500/20"
                            >
                                {/* Glow */}
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 
                                               transition bg-gradient-to-br from-blue-500 to-purple-500"
                                />

                                <FaLocationArrow className="text-gray-400 group-hover:text-white transition" />
                                <span className="text-sm">{item}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No results…</p>
                    )}
                </div>
            </div>

            {/* Animations */}
            <style>{`
                .animate-pulse-slow {
                    animation: pulse 6s ease-in-out infinite;
                }
                .animate-pulse-slower {
                    animation: pulse 10s ease-in-out infinite;
                }
                @keyframes pulse {
                    0% { opacity: .5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                    100% { opacity: .5; transform: scale(1); }
                }

                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 5s ease infinite;
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: left center; }
                    50% { background-position: right center; }
                }
            `}</style>

        </div>
    );
};

export default NavigateCampus;
