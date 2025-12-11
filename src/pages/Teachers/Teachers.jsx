import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaUser,
  FaSearch,
  FaMapMarkerAlt,
  FaBook,
  FaTimes,
  FaSpinner,
  FaEnvelope,
  FaPhone,
  FaBuilding,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../../utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const Teachers = () => {
  const [search, setSearch] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Realtime listener for teachers
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "teachers"),
      (snapshot) => {
        const teachersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeachers(teachersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching teachers:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Helper to format office location
  const formatOffice = (block, floor) => {
    if (!block && !floor) return "N/A";
    return `Block ${block || "?"} - ${floor || "?"} Floor`;
  };

  const filtered = teachers.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase())
  );

  const closeModal = () => setSelectedTeacher(null);

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white px-4 md:px-6 py-6 md:py-8 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-blue-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-purple-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-[50%] right-[25%] w-[150px] md:w-[200px] h-[150px] md:h-[200px] bg-pink-600/20 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-4 md:gap-6">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white 
                     bg-[#1C2431]/80 backdrop-blur-sm px-3 md:px-4 py-2 md:py-2.5 rounded-xl w-fit border border-gray-700/30
                     transition-all duration-300 hover:border-purple-500/50"
        >
          <FaArrowLeft /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300">
            Teachers Directory
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Find faculty members and their office locations 👨‍🏫
          </p>
        </div>

        {/* Search Box */}
        <div
          className="flex items-center gap-3 w-full bg-[#1C2431]/90 backdrop-blur-sm border border-gray-700/50 
                        px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:border-purple-500/50"
        >
          <FaSearch className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name, subject, or email..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm md:text-base min-w-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Results Count */}
        <p className="text-gray-500 text-xs md:text-sm">
          Showing {filtered.length} of {teachers.length} teachers
        </p>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20">
            <FaSpinner className="text-3xl md:text-4xl text-purple-400 animate-spin mb-4" />
            <p className="text-gray-400 text-sm md:text-base">
              Loading teachers...
            </p>
          </div>
        ) : (
          <>
            {/* Teachers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {filtered.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTeacher(t)}
                  className="group relative cursor-pointer bg-[#101726]/80 backdrop-blur-xl 
                             border border-slate-700/50 p-4 md:p-5 rounded-2xl shadow-lg flex items-center gap-3 md:gap-4 
                             transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                             hover:border-purple-500/50 active:scale-[0.98]"
                >
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 
                                  flex items-center justify-center shadow-lg flex-shrink-0"
                  >
                    <FaUser className="text-white text-lg md:text-xl" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base md:text-lg font-bold text-white truncate">
                      {t.name}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-400 truncate">
                      {t.subject}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <FaBuilding className="text-purple-400 flex-shrink-0" />
                      <span className="truncate">
                        {formatOffice(t.officeBlock, t.officeFloor)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && !loading && (
                <div className="col-span-2 text-center py-10">
                  <div className="text-4xl mb-3 opacity-50">🔍</div>
                  <p className="text-gray-500 text-sm md:text-base">
                    {teachers.length === 0
                      ? "No teachers available yet."
                      : `No teachers found matching "${search}"`}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal Overlay */}
      {selectedTeacher && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-[#101726] border border-purple-500/30 rounded-2xl p-5 md:p-6 shadow-2xl 
                       w-full max-w-md max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <FaTimes size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <FaUser className="text-white text-2xl" />
              </div>
              <div>
                <p className="text-xs text-purple-300 uppercase tracking-widest">
                  Teacher
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {selectedTeacher.name}
                </h2>
              </div>
            </div>

            {/* Bio */}
            {selectedTeacher.bio && (
              <p className="text-gray-400 text-sm mb-4 italic border-l-2 border-purple-500/50 pl-3">
                "{selectedTeacher.bio}"
              </p>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-[#1C2431]/50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Subject</p>
                <p className="text-white font-medium flex items-center gap-2">
                  <FaBook className="text-blue-400 flex-shrink-0" />
                  <span className="truncate">
                    {selectedTeacher.subject || "N/A"}
                  </span>
                </p>
              </div>
              <div className="bg-[#1C2431]/50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Office</p>
                <p className="text-white font-medium flex items-center gap-2">
                  <FaMapMarkerAlt className="text-pink-400 flex-shrink-0" />
                  <span className="truncate">
                    {formatOffice(
                      selectedTeacher.officeBlock,
                      selectedTeacher.officeFloor
                    )}
                  </span>
                </p>
              </div>
              <div className="bg-[#1C2431]/50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Email</p>
                <p className="text-white font-medium flex items-center gap-2">
                  <FaEnvelope className="text-green-400 flex-shrink-0" />
                  <span className="truncate text-xs">
                    {selectedTeacher.email || "N/A"}
                  </span>
                </p>
              </div>
              <div className="bg-[#1C2431]/50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Phone</p>
                <p className="text-white font-medium flex items-center gap-2">
                  <FaPhone className="text-yellow-400 flex-shrink-0" />
                  <span className="truncate">
                    {selectedTeacher.phone || "N/A"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teachers;
