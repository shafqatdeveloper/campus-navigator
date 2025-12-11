import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaSearch,
  FaTimes,
  FaSpinner,
  FaClock,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../../utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  { id: 1, time: "08:30 - 09:55", label: "08:30 - 09:55 AM" },
  { id: 2, time: "09:55 - 11:20", label: "09:55 - 11:20 AM" },
  { id: 3, time: "11:20 - 12:45", label: "11:20 - 12:45 PM" },
  // Break: 12:45 - 01:40 PM
  { id: 4, time: "01:40 - 03:05", label: "01:40 - 03:05 PM" },
  { id: 5, time: "03:05 - 04:30", label: "03:05 - 04:30 PM" },
];

const Timetable = () => {
  const [search, setSearch] = useState("");
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimetable, setSelectedTimetable] = useState(null);

  // Fetch timetables from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "timetables"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTimetables(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching timetables:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filtered = timetables.filter(
    (tt) =>
      tt.year?.toString().includes(search) ||
      tt.session?.toLowerCase().includes(search.toLowerCase()) ||
      tt.section?.toLowerCase().includes(search.toLowerCase())
  );

  const getSessionColor = (session) => {
    return session === "SP"
      ? "from-emerald-500 to-green-600"
      : "from-orange-500 to-amber-600";
  };

  const closeModal = () => setSelectedTimetable(null);

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white px-4 md:px-6 py-6 md:py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-indigo-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-violet-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-[40%] left-[60%] w-[150px] md:w-[200px] h-[150px] md:h-[200px] bg-blue-500/15 rounded-full blur-[100px]" />

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
          <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-violet-400 to-purple-300">
            Class Schedule
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            View timetables and lecture schedules 📅
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
            placeholder="Search by year, session, or section..."
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
          Showing {filtered.length} of {timetables.length} timetables
        </p>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20">
            <FaSpinner className="text-3xl md:text-4xl text-violet-400 animate-spin mb-4" />
            <p className="text-gray-400 text-sm md:text-base">
              Loading timetables...
            </p>
          </div>
        ) : (
          <>
            {/* Timetables Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {filtered.map((tt) => (
                <div
                  key={tt.id}
                  onClick={() => setSelectedTimetable(tt)}
                  className="group relative cursor-pointer bg-[#101726]/80 backdrop-blur-xl 
                             border border-slate-700/50 p-4 md:p-5 rounded-2xl shadow-lg 
                             transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                             hover:border-violet-500/50 active:scale-[0.98]"
                >
                  {/* Glow */}
                  <div
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 
                                  transition bg-gradient-to-br ${getSessionColor(
                                    tt.session
                                  )}`}
                  />

                  {/* Icon */}
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${getSessionColor(
                      tt.session
                    )} 
                                  flex items-center justify-center shadow-lg mb-3`}
                  >
                    <FaCalendarAlt className="text-white text-base md:text-lg" />
                  </div>

                  {/* Info */}
                  <h2 className="text-lg md:text-xl font-bold text-white mb-1">
                    Section {tt.section}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-400 mb-2">
                    {tt.year} - {tt.session === "SP" ? "Spring" : "Fall"}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FaClock className="text-violet-400 flex-shrink-0" />
                    <span>5 days • 5 slots</span>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && !loading && (
                <div className="col-span-3 text-center py-10">
                  <div className="text-4xl mb-3 opacity-50">📅</div>
                  <p className="text-gray-500 text-sm md:text-base">
                    {timetables.length === 0
                      ? "No timetables available yet."
                      : `No timetables found matching "${search}"`}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal Overlay */}
      {selectedTimetable && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4"
          onClick={closeModal}
        >
          <div
            className="bg-[#101726] border border-violet-500/30 rounded-2xl p-4 md:p-6 shadow-2xl 
                       w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 md:top-4 md:right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all z-10"
            >
              <FaTimes size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${getSessionColor(
                  selectedTimetable.session
                )} flex items-center justify-center shadow-lg flex-shrink-0`}
              >
                <FaCalendarAlt className="text-white text-lg md:text-xl" />
              </div>
              <div>
                <p className="text-xs text-violet-300 uppercase tracking-widest">
                  Timetable
                </p>
                <h2 className="text-lg md:text-2xl font-bold text-white">
                  {selectedTimetable.year} -{" "}
                  {selectedTimetable.session === "SP" ? "Spring" : "Fall"} |
                  Section {selectedTimetable.section}
                </h2>
              </div>
            </div>

            <p className="text-gray-500 text-xs md:text-sm mb-4">
              📍 Break: 12:45 - 01:40 PM
            </p>

            {/* Schedule Table - Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left py-3 px-2 text-gray-400 font-medium">
                      Day
                    </th>
                    {TIME_SLOTS.map((slot) => (
                      <th
                        key={slot.id}
                        className="text-center py-3 px-2 text-gray-400 font-medium text-xs"
                      >
                        {slot.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map((day) => {
                    const dayData = selectedTimetable.schedule?.[day];
                    const isDayOff = dayData?.dayOff;
                    return (
                      <tr
                        key={day}
                        className="border-b border-gray-800/50 hover:bg-white/5"
                      >
                        <td
                          className={`py-3 px-2 font-medium ${
                            isDayOff ? "text-red-400" : "text-white"
                          }`}
                        >
                          {day}
                          {isDayOff && (
                            <span className="text-xs ml-2">(Off)</span>
                          )}
                        </td>
                        {TIME_SLOTS.map((slot) => {
                          const slotData = dayData?.slots?.[slot.id];
                          return (
                            <td key={slot.id} className="text-center py-3 px-2">
                              {isDayOff ? (
                                <span className="text-gray-600">—</span>
                              ) : slotData?.noLecture ? (
                                <span className="text-gray-500 italic text-xs">
                                  Free
                                </span>
                              ) : slotData?.lecture ? (
                                <span className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded text-xs">
                                  {slotData.lecture}
                                </span>
                              ) : (
                                <span className="text-gray-600">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Schedule Cards - Mobile */}
            <div className="md:hidden space-y-3">
              {DAYS.map((day) => {
                const dayData = selectedTimetable.schedule?.[day];
                const isDayOff = dayData?.dayOff;
                return (
                  <div
                    key={day}
                    className={`bg-[#1C2431]/50 rounded-xl p-3 ${
                      isDayOff ? "opacity-60" : ""
                    }`}
                  >
                    <h4
                      className={`font-bold mb-2 ${
                        isDayOff ? "text-red-400" : "text-white"
                      }`}
                    >
                      {day}{" "}
                      {isDayOff && (
                        <span className="text-xs font-normal">(Day Off)</span>
                      )}
                    </h4>
                    {!isDayOff && (
                      <div className="space-y-2">
                        {TIME_SLOTS.map((slot) => {
                          const slotData = dayData?.slots?.[slot.id];
                          return (
                            <div
                              key={slot.id}
                              className="flex items-center gap-2 text-xs"
                            >
                              <span className="text-gray-500 w-28 flex-shrink-0">
                                {slot.label}
                              </span>
                              {slotData?.noLecture ? (
                                <span className="text-gray-500 italic">
                                  Free
                                </span>
                              ) : slotData?.lecture ? (
                                <span className="bg-violet-500/20 text-violet-300 px-2 py-1 rounded">
                                  {slotData.lecture}
                                </span>
                              ) : (
                                <span className="text-gray-600">—</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
