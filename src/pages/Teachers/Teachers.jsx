import React, { useState } from "react";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Teachers = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    // -------- SAMPLE DATA (Replace with backend later) --------
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
        <div className="min-h-screen bg-[#0B0F19] text-white px-6 py-10 flex flex-col gap-6">

            {/* BACK BUTTON */}
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white 
                   bg-[#1F2937] px-4 py-2 rounded-lg w-fit transition"
            >
                <FaArrowLeft /> Back to Home
            </button>

            <h1 className="text-3xl font-bold text-center">Teachers</h1>

            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search teacher..."
                className="bg-[#1F2937] border border-gray-700 rounded-xl px-4 py-3 text-sm 
                   focus:outline-none focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* TEACHER LIST */}
            <div className="bg-[#111827] border border-gray-700 rounded-xl p-4 h-[55vh] overflow-y-auto space-y-3">
                {filtered.map((t, i) => (
                    <div
                        key={i}
                        onClick={() => setSelectedTeacher(t)}
                        className="p-3 bg-[#1F2937] rounded-lg border border-gray-700 
                       hover:border-blue-500 cursor-pointer flex items-center gap-3"
                    >
                        <FaUser className="text-gray-400" />
                        <div>
                            <p className="font-semibold">{t.name}</p>
                            <p className="text-xs text-gray-400">{t.subject}</p>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No teacher found…</p>
                )}
            </div>

            {/* TEACHER DETAILS PANEL */}
            {selectedTeacher && (
                <div className="bg-[#111827] border border-blue-600 rounded-xl p-4 mt-4">
                    <h2 className="text-xl font-bold">{selectedTeacher.name}</h2>
                    <p className="text-gray-300 mt-1">
                        <span className="font-semibold">Subject:</span> {selectedTeacher.subject}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-semibold">Room:</span> {selectedTeacher.room}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Teachers;
