import React, { useState } from "react";
import { FaArrowLeft, FaPaperPlane, FaLocationArrow } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavigateCampus = () => {
    const nav = useNavigate();

    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [robotMsg, setRobotMsg] = useState("");

    // -------------- SAMPLE SEARCH OPTIONS (Replace with backend later) --------------
    const SUGGESTIONS = [
        "D4",
        "Faculty Offices",
        "CS Lab",
        "Library Entrance",
        "Block A",
        "Block B",
        "Block C",
        "Block D",
        "Exam Branch",
        "Accounts Office",
        "C2.5 Classroom",
        "Director Office",
        "Digital Library"
    ];

    const filteredLocations = SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(location.toLowerCase())
    );

    // -------------- SEND NAVIGATION REQUEST TO ROBOT BACKEND --------------
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
            console.error(err);
            setRobotMsg("⚠️ Robot connection error.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen w-full bg-[#0B0F19] text-white px-6 py-10 flex flex-col gap-6">

            {/* BACK BUTTON */}
            <button
                onClick={() => nav("/")}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white 
                  bg-[#1F2937] px-4 py-2 rounded-lg w-fit transition"
            >
                <FaArrowLeft /> Back to Home
            </button>

            <h1 className="text-3xl font-bold text-center">Navigate Campus</h1>
            <p className="text-center text-gray-400">
                Ask the robot to move to a specific location.
            </p>

            {/* STATUS BOX */}
            <div className="bg-[#111827] p-5 rounded-xl border border-gray-700 min-h-[80px]">
                {loading ? (
                    <p className="text-blue-400 animate-pulse">Sending command to robot…</p>
                ) : robotMsg ? (
                    <p>{robotMsg}</p>
                ) : (
                    <p className="text-gray-500">Enter a location to navigate…</p>
                )}
            </div>

            {/* INPUT */}
            <div className="flex items-center gap-3 w-full">
                <input
                    type="text"
                    placeholder="Enter room or place... e.g. D4, Faculty offices"
                    className="flex-1 bg-[#1F2937] border border-gray-700 rounded-xl px-4 py-3 text-sm 
                     focus:outline-none focus:border-blue-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                <button
                    onClick={sendNavigation}
                    className="bg-blue-600 hover:bg-blue-700 p-3 rounded-xl transition"
                >
                    <FaPaperPlane />
                </button>
            </div>

            {/* SUGGESTIONS */}
            <div className="bg-[#111827] p-4 rounded-xl border border-gray-700 space-y-2 max-h-[40vh] overflow-y-auto">
                <p className="text-gray-400 text-sm">Suggestions</p>

                {filteredLocations.length > 0 ? (
                    filteredLocations.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => setLocation(item)}
                            className="p-3 bg-[#1F2937] rounded-lg border border-gray-700 
                         hover:border-blue-500 cursor-pointer flex items-center gap-3"
                        >
                            <FaLocationArrow className="text-gray-400" />
                            <span className="text-sm">{item}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No results…</p>
                )}
            </div>
        </div>
    );
};

export default NavigateCampus;
