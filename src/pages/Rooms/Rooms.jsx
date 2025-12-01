import React, { useState } from "react";
import { FaArrowLeft, FaDoorOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Rooms = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selectedRoom, setSelectedRoom] = useState(null);

    const ROOMS = [
        { room: "C2.5", block: "Block C", type: "Lecture Room" },
        { room: "D2", block: "Block D", type: "AI / CS Lab" },
        { room: "A1", block: "Block A", type: "Classroom" },
        { room: "B1", block: "Block B", type: "Electronics Lab" },
    ];

    const filtered = ROOMS.filter((r) =>
        r.room.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0A0F1F] text-white px-6 py-10 relative overflow-hidden">

            {/* Floating gradients — same as Home + Teachers */}
            <div className="absolute top-[-20%] left-[-12%] w-[450px] h-[450px] bg-blue-600/25 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-12%] w-[450px] h-[450px] bg-purple-600/25 rounded-full blur-[120px] animate-pulse-slower" />

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-8">

                {/* Back button */}
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white
                               bg-[#1C2431]/70 px-4 py-2 rounded-xl border border-slate-700/40
                               backdrop-blur-lg transition w-fit hover:bg-[#243042]"
                >
                    <FaArrowLeft /> Back
                </button>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-center tracking-tight
                               bg-clip-text text-transparent bg-gradient-to-r 
                               from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                    Rooms
                </h1>

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search room number..."
                    className="w-full bg-[#1C2431]/60 border border-slate-700/50 rounded-2xl px-5 py-3 
                               placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500
                               backdrop-blur-lg shadow-lg shadow-black/20"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Rooms Grid (consistent card design!) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filtered.map((r, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedRoom(r)}
                            className="group relative cursor-pointer bg-slate-800/40 backdrop-blur-xl 
                                       border border-slate-700/50 p-6 rounded-3xl shadow-xl flex 
                                       items-center gap-4 transition-all duration-300 hover:-translate-y-2 
                                       hover:shadow-blue-500/20"
                        >
                            {/* Glow */}
                            <div
                                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 
                                           transition bg-gradient-to-br from-blue-500 to-purple-500"
                            />

                            <div className="text-3xl">
                                <FaDoorOpen className="text-gray-300 group-hover:text-white transition" />
                            </div>

                            <div className="flex flex-col">
                                <h2 className="text-lg font-bold text-slate-100 group-hover:text-white">
                                    Room {r.room}
                                </h2>
                                <p className="text-sm text-gray-400">{r.block}</p>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <p className="text-gray-400 text-center col-span-2 py-4">
                            No rooms found…
                        </p>
                    )}
                </div>

                {/* Details Panel — same style as Teachers page */}
                {selectedRoom && (
                    <div className="mt-6 bg-slate-800/50 border border-blue-500/20 
                                    backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-blue-900/20">
                        <h2 className="text-2xl font-extrabold mb-2 bg-clip-text text-transparent
                                        bg-gradient-to-r from-blue-300 to-purple-300">
                            Room {selectedRoom.room}
                        </h2>

                        <p className="text-gray-300 text-sm mb-1">
                            <span className="font-semibold">Block:</span> {selectedRoom.block}
                        </p>

                        <p className="text-gray-300 text-sm">
                            <span className="font-semibold">Room Type:</span> {selectedRoom.type}
                        </p>
                    </div>
                )}
            </div>

            {/* Animations (from Home page) */}
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

export default Rooms;
