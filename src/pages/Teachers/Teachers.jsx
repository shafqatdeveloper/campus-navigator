import React, { useState } from "react";
import {
  FaArrowLeft,
  FaUser,
  FaSearch,
  FaMapMarkerAlt,
  FaBook,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Teachers = () => {
  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const TEACHERS = [
    {
      name: "Ms. Kanwal Fatima",
      subject: "Artificial Intelligence",
      room: "D2",
      department: "Computer Science",
    },
    {
      name: "Mr. Imran Shahzad",
      subject: "Mobile App Development",
      room: "C2.5",
      department: "Computer Science",
    },
    {
      name: "Dr. Ali Raza",
      subject: "Data Science",
      room: "B1",
      department: "Computer Science",
    },
    {
      name: "Ms. Nadia Aslam",
      subject: "Operating Systems",
      room: "A2",
      department: "Computer Science",
    },
  ];

  const filtered = TEACHERS.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white px-4 md:px-6 py-8 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[450px] h-[450px] bg-blue-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[450px] h-[450px] bg-purple-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-[50%] right-[25%] w-[200px] h-[200px] bg-pink-600/20 rounded-full blur-[100px]" />

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
            Teachers Directory
          </h1>
          <p className="text-gray-400 text-base">
            Find faculty members and their office locations 👨‍🏫
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
            placeholder="Search by name or subject..."
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
          Showing {filtered.length} of {TEACHERS.length} teachers
        </p>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((t, i) => (
            <div
              key={i}
              onClick={() => setSelectedTeacher(t)}
              className={`group relative cursor-pointer bg-[#101726]/80 backdrop-blur-xl 
                         border p-5 rounded-2xl shadow-lg flex items-center gap-4 
                         transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                         ${
                           selectedTeacher?.name === t.name
                             ? "border-purple-500/70 shadow-purple-500/20"
                             : "border-slate-700/50 hover:border-purple-500/50"
                         }`}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 
                              transition bg-gradient-to-br from-purple-500 to-pink-500"
              />

              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 
                              flex items-center justify-center shadow-lg transform transition-transform 
                              duration-300 group-hover:scale-105"
              >
                <FaUser className="text-white text-xl" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-white truncate">
                  {t.name}
                </h2>
                <p className="text-sm text-gray-400 truncate">{t.subject}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <FaMapMarkerAlt className="text-purple-400" />
                  <span>Room {t.room}</span>
                </div>
              </div>

              {/* Selected Indicator */}
              {selectedTeacher?.name === t.name && (
                <FaCheckCircle className="text-purple-400" />
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-10">
              <div className="text-4xl mb-3 opacity-50">🔍</div>
              <p className="text-gray-500">
                No teachers found matching "{search}"
              </p>
            </div>
          )}
        </div>

        {/* Details Panel */}
        {selectedTeacher && (
          <div
            className="bg-[#101726]/80 backdrop-blur-xl border border-purple-500/30 
                          rounded-2xl p-6 shadow-xl relative overflow-hidden"
          >
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />

            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-purple-300 uppercase tracking-widest mb-1">
                  Selected Teacher
                </p>
                <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                  {selectedTeacher.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-[#1C2431]/50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Subject</p>
                <p className="text-white font-medium flex items-center gap-2">
                  <FaBook className="text-blue-400" />
                  {selectedTeacher.subject}
                </p>
              </div>
              <div className="bg-[#1C2431]/50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Room</p>
                <p className="text-white font-medium flex items-center gap-2">
                  <FaMapMarkerAlt className="text-pink-400" />
                  {selectedTeacher.room}
                </p>
              </div>
            </div>

            <button
              className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                               hover:from-purple-500 hover:to-pink-500 rounded-xl text-sm font-semibold 
                               transition-all duration-300 shadow-lg shadow-purple-500/20 
                               hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              📍 Navigate to {selectedTeacher.room}
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

export default Teachers;
