import React, { useState } from "react";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Teachers = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    const TEACHERS = [
        { name: "Ms. Kanwal Fatima", subject: "Artificial Intelligence", room: "D2" },
        { name: "Mr. Imran Shahzad", subject: "Mobile App Development", room: "C2.5" },
        { name: "Dr. Ali Raza", subject: "Data Science", room: "B1" },
        { name: "Ms. Nadia Aslam", subject: "Operating Systems", room: "A2" },
    ];

    const filtered = TEACHERS.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0A0F1F] text-white px-6 py-10 relative overflow-hidden">

            {/* Floating gradients (same as Home) */}
            <div className="absolute top-[-20%] left-[-10%] w-[450px] h-[450px] bg-blue-600/25 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[450px] h-[450px] bg-purple-600/25 rounded-full blur-[120px] animate-pulse-slower" />

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

                {/* Page Heading (same animated gradient) */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-center tracking-tight
                               bg-clip-text text-transparent bg-gradient-to-r 
                               from-blue-400 via-purple-400 to-pink-400 animate-gradient-x">
                    Teachers Directory
                </h1>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search teacher..."
                    className="w-full bg-[#1C2431]/60 border border-slate-700/50 rounded-2xl px-5 py-3 
                               placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500
                               backdrop-blur-lg shadow-lg shadow-black/20"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {/* Teachers Grid (same card style as Home) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filtered.map((t, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedTeacher(t)}
                            className="group relative cursor-pointer bg-slate-800/40 backdrop-blur-xl 
                                       border border-slate-700/50 p-6 rounded-3xl shadow-xl flex 
                                       items-center gap-4 transition-all duration-300 
                                       hover:-translate-y-2 hover:shadow-blue-500/20"
                        >
                            {/* Glow */}
                            <div
                                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 
                                           transition bg-gradient-to-br from-blue-500 to-purple-500"
                            />

                            <div className="text-3xl">
                                <FaUser className="text-gray-300 group-hover:text-white transition" />
                            </div>

                            <div className="flex flex-col">
                                <h2 className="text-lg font-bold text-slate-100 group-hover:text-white">
                                    {t.name}
                                </h2>
                                <p className="text-sm text-gray-400">{t.subject}</p>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <p className="text-gray-400 text-center col-span-2 py-4">
                            No teacher found…
                        </p>
                    )}
                </div>

                {/* Details Panel (same glass style as Ask page) */}
                {selectedTeacher && (
                    <div className="mt-6 bg-slate-800/50 border border-blue-500/20 
                                    backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-blue-900/20">
                        <h2 className="text-2xl font-extrabold mb-2 bg-clip-text text-transparent
                                        bg-gradient-to-r from-blue-300 to-purple-300">
                            {selectedTeacher.name}
                        </h2>

                        <p className="text-gray-300 text-sm mb-1">
                            <span className="font-semibold">Subject:</span> {selectedTeacher.subject}
                        </p>

                        <p className="text-gray-300 text-sm">
                            <span className="font-semibold">Room:</span> {selectedTeacher.room}
                        </p>
                    </div>
                )}
            </div>

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

export default Teachers;
