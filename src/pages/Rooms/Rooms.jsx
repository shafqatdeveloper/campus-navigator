import React, { useState } from "react";
import { FaArrowLeft, FaDoorOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Rooms = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selectedRoom, setSelectedRoom] = useState(null);

    // SAMPLE DATA (Replace with backend later)
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
        <div className="min-h-screen bg-[#0B0F19] text-white px-6 py-10 flex flex-col gap-6">

            {/* BACK BUTTON */}
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white 
                   bg-[#1F2937] px-4 py-2 rounded-lg w-fit transition"
            >
                <FaArrowLeft /> Back to Home
            </button>

            <h1 className="text-3xl font-bold text-center">Rooms</h1>

            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search room number..."
                className="bg-[#1F2937] border border-gray-700 rounded-xl px-4 py-3 text-sm 
                   focus:outline-none focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* ROOM LIST */}
            <div className="bg-[#111827] border border-gray-700 rounded-xl p-4 h-[55vh] overflow-y-auto space-y-3">
                {filtered.map((r, i) => (
                    <div
                        key={i}
                        onClick={() => setSelectedRoom(r)}
                        className="p-3 bg-[#1F2937] rounded-lg border border-gray-700 
                       hover:border-blue-500 cursor-pointer flex items-center gap-3"
                    >
                        <FaDoorOpen className="text-gray-400" />
                        <div>
                            <p className="font-semibold">{r.room}</p>
                            <p className="text-xs text-gray-400">{r.block}</p>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No rooms found…</p>
                )}
            </div>

            {/* ROOM DETAILS PANEL */}
            {selectedRoom && (
                <div className="bg-[#111827] border border-blue-600 rounded-xl p-4 mt-4">
                    <h2 className="text-xl font-bold">Room {selectedRoom.room}</h2>
                    <p className="text-gray-300 mt-1">
                        <span className="font-semibold">Block:</span> {selectedRoom.block}
                    </p>
                    <p className="text-gray-300">
                        <span className="font-semibold">Room Type:</span> {selectedRoom.type}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Rooms;
