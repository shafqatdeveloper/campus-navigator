import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { FaArrowLeft, FaExpandAlt, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

// ---------- 3D BLOCK COMPONENT ----------
const Block3D = ({ name, color, position, onClick, isSelected }) => {
  return (
    <mesh
      position={position}
      castShadow
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        onClick(name);
      }}
      scale={isSelected ? 1.15 : 1}
    >
      <boxGeometry args={[4, 2, 4]} />
      <meshStandardMaterial
        color={color}
        emissive={isSelected ? color : "#000000"}
        emissiveIntensity={isSelected ? 0.6 : 0}
      />

      <Html position={[0, 1.7, 0]} center distanceFactor={8}>
        <div
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 whitespace-nowrap
                      ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/50"
                          : "bg-black/70 text-gray-200 backdrop-blur-sm border border-gray-700/50"
                      }`}
        >
          {name}
        </div>
      </Html>
    </mesh>
  );
};

// ---------- MAIN PAGE ----------
const CampusMap = () => {
  const [selectedBlock, setSelectedBlock] = useState("Block A");

  const BLOCK_DETAILS = {
    "Block A": {
      title: "Block A – Computer Science",
      description:
        "Home of Computer Science, AI Labs, and modern lecture halls for tech students.",
      color: "from-blue-500 to-blue-600",
      floors: [
        { level: "Ground Floor", rooms: ["CS Lab 1", "CS Lab 2", "Reception"] },
        { level: "1st Floor", rooms: ["Lecture Hall A1", "Lecture Hall A2"] },
        { level: "2nd Floor", rooms: ["Faculty Offices", "Meeting Room"] },
      ],
    },
    "Block B": {
      title: "Block B – Electrical / Electronics",
      description:
        "All electronics labs, circuits lab, and project rooms reside here.",
      color: "from-cyan-500 to-cyan-600",
      floors: [
        { level: "Ground Floor", rooms: ["Electronics Lab 1", "Store"] },
        { level: "1st Floor", rooms: ["Circuits Lab", "Power Lab"] },
        { level: "2nd Floor", rooms: ["Project Rooms", "Faculty Offices"] },
      ],
    },
    "Block C": {
      title: "Block C – Admin & Management",
      description:
        "Accounts, administration, examination branch, and director's office.",
      color: "from-green-500 to-green-600",
      floors: [
        { level: "Ground Floor", rooms: ["Reception", "Accounts Office"] },
        { level: "1st Floor", rooms: ["Examination Branch", "Record Room"] },
        { level: "2nd Floor", rooms: ["Conference Hall", "Director Office"] },
      ],
    },
    "Block D": {
      title: "Block D – Library & Study Area",
      description: "Main library, digital library, and peaceful study halls.",
      color: "from-orange-500 to-orange-600",
      floors: [
        { level: "Ground Floor", rooms: ["Library Entry", "Issue Desk"] },
        { level: "1st Floor", rooms: ["Reading Hall", "Reference Section"] },
        { level: "2nd Floor", rooms: ["Digital Library", "Group Study Rooms"] },
      ],
    },
  };

  const activeDetails = BLOCK_DETAILS[selectedBlock];

  return (
    <div className="min-h-screen w-full bg-[#0A0F1F] text-white flex flex-col md:flex-row relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute top-[-20%] left-[-15%] w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[450px] h-[450px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute top-[50%] left-[40%] w-[200px] h-[200px] bg-pink-500/15 rounded-full blur-[100px]" />

      {/* 3D MAP LEFT SIDE */}
      <div className="w-full md:w-2/3 h-[45vh] md:h-screen border-b md:border-b-0 md:border-r border-slate-800/50 relative z-10">
        {/* Back Button - Floating */}
        <Link
          to="/"
          className="absolute top-4 left-4 z-20 flex items-center gap-2 text-sm text-gray-300 hover:text-white 
                     bg-[#1C2431]/90 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-gray-700/30
                     transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
        >
          <FaArrowLeft /> Back
        </Link>

        {/* Controls Hint */}
        <div
          className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-xs text-gray-500 
                        bg-[#1C2431]/70 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700/30"
        >
          <FaExpandAlt className="text-purple-400" />
          <span>Drag to rotate • Scroll to zoom</span>
        </div>

        <Canvas
          shadows
          camera={{ position: [10, 10, 10], fov: 45 }}
          className="bg-[#0A0F1F]"
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 15, 5]} intensity={1.2} castShadow />

          {/* Ground */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
            receiveShadow
          >
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#0A0F1F" />
          </mesh>

          <Suspense fallback={null}>
            <Block3D
              name="Block A"
              color="#2563eb"
              position={[-6, 0, 0]}
              isSelected={selectedBlock === "Block A"}
              onClick={setSelectedBlock}
            />
            <Block3D
              name="Block B"
              color="#0ea5e9"
              position={[0, 0, 0]}
              isSelected={selectedBlock === "Block B"}
              onClick={setSelectedBlock}
            />
            <Block3D
              name="Block C"
              color="#22c55e"
              position={[6, 0, 0]}
              isSelected={selectedBlock === "Block C"}
              onClick={setSelectedBlock}
            />
            <Block3D
              name="Block D"
              color="#f97316"
              position={[0, 0, -6]}
              isSelected={selectedBlock === "Block D"}
              onClick={setSelectedBlock}
            />
          </Suspense>

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={8}
            maxDistance={30}
          />
        </Canvas>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-1/3 p-6 md:p-8 bg-[#0F1626]/90 backdrop-blur-xl border-l border-slate-800/50 relative z-10 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-purple-300 uppercase tracking-widest mb-2">
            Interactive View
          </p>
          <h2
            className="text-3xl font-extrabold bg-clip-text text-transparent 
                         bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300 animate-gradient"
          >
            Campus 3D Map
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Click on any block to explore its details
          </p>
        </div>

        {/* Block Selector Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(BLOCK_DETAILS).map((block) => (
            <button
              key={block}
              onClick={() => setSelectedBlock(block)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedBlock === block
                  ? `bg-gradient-to-r ${BLOCK_DETAILS[block].color} text-white shadow-lg`
                  : "bg-[#1C2431] text-gray-400 hover:text-white border border-gray-700/50 hover:border-purple-500/50"
              }`}
            >
              {block}
            </button>
          ))}
        </div>

        {/* Selected Block Details */}
        <div className="bg-[#101726]/80 backdrop-blur-sm rounded-2xl border border-slate-700/40 p-5 mb-6 relative overflow-hidden">
          {/* Decorative Corner */}
          <div
            className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${activeDetails.color} opacity-10 rounded-bl-full`}
          />

          <div className="flex items-start gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeDetails.color} 
                            flex items-center justify-center shadow-lg`}
            >
              <FaInfoCircle className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {activeDetails.title}
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                {activeDetails.description}
              </p>
            </div>
          </div>
        </div>

        {/* Floors */}
        <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1 custom-scroll">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Floor Details
          </p>
          {activeDetails.floors.map((floor, idx) => (
            <div
              key={idx}
              className="bg-[#1C2431]/60 backdrop-blur-sm border border-slate-700/40 rounded-xl p-4 
                         hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeDetails.color}`}
                />
                {floor.level}
              </div>
              <div className="flex flex-wrap gap-2">
                {floor.rooms.map((room, rIdx) => (
                  <span
                    key={rIdx}
                    className="text-xs bg-[#0A0F1F]/50 text-gray-300 px-2.5 py-1 rounded-lg border border-gray-700/30"
                  >
                    {room}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Button */}
        <button
          className="mt-6 w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 
                     hover:from-blue-500 hover:to-purple-500 rounded-xl text-sm font-semibold 
                     transition-all duration-300 shadow-lg shadow-blue-500/20 
                     hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => alert(`Start navigation to ${selectedBlock}`)}
        >
          📍 Navigate to {selectedBlock}
        </button>

        {/* Tips */}
        <div className="mt-4 p-3 rounded-xl bg-[#1C2431]/30 border border-gray-700/20">
          <p className="text-gray-500 text-xs text-center">
            💡 Use the 3D view to explore the campus layout
          </p>
        </div>
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
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #3b4261;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default CampusMap;
