import React, { useState } from "react";
import {
  FaArrowLeft,
  FaDoorOpen,
  FaSearch,
  FaMapMarkerAlt,
  FaBuilding,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Rooms = () => {
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const ROOMS = [
    {
      room: "C2.5",
      block: "Block C",
      type: "Lecture Room",
      floor: "2nd Floor",
      capacity: 60,
    },
    {
      room: "D2",
      block: "Block D",
      type: "AI / CS Lab",
      floor: "Ground Floor",
      capacity: 40,
    },
    {
      room: "A1",
      block: "Block A",
      type: "Classroom",
      floor: "1st Floor",
      capacity: 50,
    },
    {
      room: "B1",
      block: "Block B",
      type: "Electronics Lab",
      floor: "Ground Floor",
      capacity: 35,
    },
    {
      room: "A2",
      block: "Block A",
      type: "Classroom",
      floor: "2nd Floor",
      capacity: 45,
    },
    {
      room: "D4",
      block: "Block D",
      type: "Study Hall",
      floor: "1st Floor",
      capacity: 80,
    },
  ];

  const filtered = ROOMS.filter(
    (r) =>
      r.room.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.block.toLowerCase().includes(search.toLowerCase())
  );

  const getRoomColor = (type) => {
    if (type.includes("Lab")) return "from-emerald-500 to-green-600";
    if (type.includes("Lecture")) return "from-blue-500 to-cyan-600";
    if (type.includes("Study")) return "from-amber-500 to-orange-600";
    return "from-purple-500 to-pink-600";
  };

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white px-4 md:px-6 py-8 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[450px] h-[450px] bg-blue-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[450px] h-[450px] bg-purple-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-[40%] left-[60%] w-[200px] h-[200px] bg-amber-500/15 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-6">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white 
                     bg-[#1C2431]/80 backdrop-blur-sm px-4 py-2.5 rounded-xl w-fit border border-gray-700/30
                     transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
        >
          <FaArrowLeft /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300 animate-gradient">
            Rooms Directory
          </h1>
          <p className="text-gray-400 text-base">
            Find classrooms, labs, and study areas 🚪
          </p>
        </div>

        {/* Search Box */}
        <div
          className="flex items-center gap-3 w-full bg-[#1C2431]/90 backdrop-blur-sm border border-gray-700/50 
                        px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:border-purple-500/50"
        >
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search by room number, type, or block..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Results Count */}
        <p className="text-gray-500 text-sm">
          Showing {filtered.length} of {ROOMS.length} rooms
        </p>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r, i) => (
            <div
              key={i}
              onClick={() => setSelectedRoom(r)}
              className={`group relative cursor-pointer bg-[#101726]/80 backdrop-blur-xl 
                         border p-5 rounded-2xl shadow-lg 
                         transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                         ${
                           selectedRoom?.room === r.room
                             ? "border-purple-500/70 shadow-purple-500/20"
                             : "border-slate-700/50 hover:border-purple-500/50"
                         }`}
            >
              {/* Glow */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 
                              transition bg-gradient-to-br ${getRoomColor(
                                r.type
                              )}`}
              />

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRoomColor(
                  r.type
                )} 
                              flex items-center justify-center shadow-lg mb-3 transform 
                              transition-transform duration-300 group-hover:scale-105`}
              >
                <FaDoorOpen className="text-white text-lg" />
              </div>

              {/* Info */}
              <h2 className="text-xl font-bold text-white mb-1">
                Room {r.room}
              </h2>
              <p className="text-sm text-gray-400 mb-2">{r.type}</p>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <FaBuilding className="text-blue-400" />
                <span>{r.block}</span>
                <span className="text-gray-700">•</span>
                <span>{r.floor}</span>
              </div>

              {/* Selected Indicator */}
              {selectedRoom?.room === r.room && (
                <FaCheckCircle className="absolute top-4 right-4 text-purple-400" />
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-10">
              <div className="text-4xl mb-3 opacity-50">🔍</div>
              <p className="text-gray-500">
                No rooms found matching "{search}"
              </p>
            </div>
          )}
        </div>

        {/* Details Panel */}
        {selectedRoom && (
          <div
            className="bg-[#101726]/80 backdrop-blur-xl border border-purple-500/30 
                          rounded-2xl p-6 shadow-xl relative overflow-hidden"
          >
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />

            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-purple-300 uppercase tracking-widest mb-1">
                  Selected Room
                </p>
                <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                  Room {selectedRoom.room}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-[#1C2431]/50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Type</p>
                <p className="text-white font-medium">{selectedRoom.type}</p>
              </div>
              <div className="bg-[#1C2431]/50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Block</p>
                <p className="text-white font-medium">{selectedRoom.block}</p>
              </div>
              <div className="bg-[#1C2431]/50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Floor</p>
                <p className="text-white font-medium">{selectedRoom.floor}</p>
              </div>
              <div className="bg-[#1C2431]/50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Capacity</p>
                <p className="text-white font-medium">
                  {selectedRoom.capacity} seats
                </p>
              </div>
            </div>

            <button
              className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                               hover:from-blue-500 hover:to-purple-500 rounded-xl text-sm font-semibold 
                               transition-all duration-300 shadow-lg shadow-blue-500/20 
                               hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              📍 Navigate to Room {selectedRoom.room}
            </button>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Rooms;
