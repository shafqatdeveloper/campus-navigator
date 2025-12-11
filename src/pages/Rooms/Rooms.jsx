import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaDoorOpen,
  FaSearch,
  FaMapMarkerAlt,
  FaBuilding,
  FaTimes,
  FaSpinner,
  FaUsers,
  FaTv,
  FaSnowflake,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../../utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";

const Rooms = () => {
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Realtime listener for rooms
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "rooms"),
      (snapshot) => {
        const roomsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Helper to format location
  const formatLocation = (block, floor) => {
    if (!block && !floor) return "N/A";
    return `Block ${block || "?"} - ${floor || "?"} Floor`;
  };

  const filtered = rooms.filter(
    (r) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.type?.toLowerCase().includes(search.toLowerCase()) ||
      r.block?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoomColor = (type) => {
    if (type?.includes("Lab")) return "from-emerald-500 to-green-600";
    if (type?.includes("Lecture")) return "from-blue-500 to-cyan-600";
    if (type?.includes("Study")) return "from-amber-500 to-orange-600";
    if (type?.includes("Seminar") || type?.includes("Conference"))
      return "from-rose-500 to-pink-600";
    return "from-purple-500 to-pink-600";
  };

  const closeModal = () => setSelectedRoom(null);

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white px-4 md:px-6 py-6 md:py-8 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-blue-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-purple-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-[40%] left-[60%] w-[150px] md:w-[200px] h-[150px] md:h-[200px] bg-amber-500/15 rounded-full blur-[100px]" />

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
            Rooms Directory
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Find classrooms, labs, and study areas 🚪
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
            placeholder="Search by room name, type, or block..."
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
          Showing {filtered.length} of {rooms.length} rooms
        </p>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20">
            <FaSpinner className="text-3xl md:text-4xl text-purple-400 animate-spin mb-4" />
            <p className="text-gray-400 text-sm md:text-base">
              Loading rooms...
            </p>
          </div>
        ) : (
          <>
            {/* Rooms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRoom(r)}
                  className="group relative cursor-pointer bg-[#101726]/80 backdrop-blur-xl 
                             border border-slate-700/50 p-4 md:p-5 rounded-2xl shadow-lg 
                             transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                             hover:border-purple-500/50 active:scale-[0.98]"
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
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${getRoomColor(
                      r.type
                    )} 
                                  flex items-center justify-center shadow-lg mb-3`}
                  >
                    <FaDoorOpen className="text-white text-base md:text-lg" />
                  </div>

                  {/* Info */}
                  <h2 className="text-lg md:text-xl font-bold text-white mb-1 truncate">
                    {r.name || "Room"}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-400 mb-2 truncate">
                    {r.type || "Room"}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <FaBuilding className="text-blue-400 flex-shrink-0" />
                    <span className="truncate">
                      {formatLocation(r.block, r.floor)}
                    </span>
                  </div>

                  {/* Amenities Icons */}
                  <div className="flex items-center gap-2 text-sm">
                    {r.hasLCD && <span title="LCD Screen">🖥️</span>}
                    {r.hasProjector && <span title="Projector">📽️</span>}
                    {r.hasAC && <span title="Air Conditioned">❄️</span>}
                    {r.capacity > 0 && (
                      <span className="text-xs text-gray-500 ml-auto">
                        {r.capacity} seats
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {filtered.length === 0 && !loading && (
                <div className="col-span-3 text-center py-10">
                  <div className="text-4xl mb-3 opacity-50">🔍</div>
                  <p className="text-gray-500 text-sm md:text-base">
                    {rooms.length === 0
                      ? "No rooms available yet."
                      : `No rooms found matching "${search}"`}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal Overlay */}
      {selectedRoom && (
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
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${getRoomColor(
                  selectedRoom.type
                )} flex items-center justify-center shadow-lg`}
              >
                <FaDoorOpen className="text-white text-xl md:text-2xl" />
              </div>
              <div>
                <p className="text-xs text-purple-300 uppercase tracking-widest">
                  Room
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  {selectedRoom.name}
                </h2>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="bg-[#1C2431]/50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Type</p>
                <p className="text-white font-medium">
                  {selectedRoom.type || "N/A"}
                </p>
              </div>
              <div className="bg-[#1C2431]/50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Location</p>
                <p className="text-white font-medium flex items-center gap-1 text-xs">
                  <FaMapMarkerAlt className="text-pink-400 flex-shrink-0" />
                  <span className="truncate">
                    {formatLocation(selectedRoom.block, selectedRoom.floor)}
                  </span>
                </p>
              </div>
              <div className="bg-[#1C2431]/50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Capacity</p>
                <p className="text-white font-medium flex items-center gap-1">
                  <FaUsers className="text-blue-400 flex-shrink-0" />
                  {selectedRoom.capacity || 0} seats
                </p>
              </div>
              <div className="bg-[#1C2431]/50 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Block</p>
                <p className="text-white font-medium flex items-center gap-1">
                  <FaBuilding className="text-purple-400 flex-shrink-0" />
                  Block {selectedRoom.block || "N/A"}
                </p>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="bg-[#1C2431]/50 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-3">Amenities</p>
              <div className="flex flex-wrap gap-2">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs ${
                    selectedRoom.hasLCD
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-700/30 text-gray-500"
                  }`}
                >
                  <FaTv className="text-sm" />
                  LCD {selectedRoom.hasLCD ? "✓" : "✗"}
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs ${
                    selectedRoom.hasProjector
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-700/30 text-gray-500"
                  }`}
                >
                  📽️ Projector {selectedRoom.hasProjector ? "✓" : "✗"}
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs ${
                    selectedRoom.hasAC
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-700/30 text-gray-500"
                  }`}
                >
                  <FaSnowflake className="text-sm" />
                  AC {selectedRoom.hasAC ? "✓" : "✗"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
