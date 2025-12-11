import React, { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { FaArrowLeft, FaExpandAlt, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../../utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";

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
  const [selectedBlock, setSelectedBlock] = useState("A Block");
  const [firebaseRooms, setFirebaseRooms] = useState([]);

  // Fetch rooms from Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "rooms"),
      (snapshot) => {
        const roomsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFirebaseRooms(roomsData);
      },
      (error) => {
        console.error("Error fetching rooms:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Helper to get rooms for a block organized by floor
  const getRoomsForBlock = (blockLetter) => {
    const blockRooms = firebaseRooms.filter((r) => r.block === blockLetter);
    const floorMap = {};

    blockRooms.forEach((room) => {
      const floorKey = room.floor ? `${room.floor} Floor` : "Unknown Floor";
      if (!floorMap[floorKey]) {
        floorMap[floorKey] = [];
      }
      // Format room with amenities info
      let roomInfo = room.name;
      if (room.type && room.type !== "Classroom") {
        roomInfo += ` (${room.type})`;
      }
      floorMap[floorKey].push({
        name: roomInfo,
        capacity: room.capacity,
        hasLCD: room.hasLCD,
        hasProjector: room.hasProjector,
        hasAC: room.hasAC,
      });
    });

    return Object.entries(floorMap).map(([level, rooms]) => ({
      level,
      rooms: rooms.map((r) => r.name),
      roomDetails: rooms,
    }));
  };

  const BLOCK_DETAILS = {
    "W Block": {
      title: "W Block - Workshop & Labs",
      description:
        "Technical workshops, mechanical labs, and practical training areas.",
      color: "from-violet-500 to-purple-600",
      image: "/W_Block.jpg",
      floors: [
        {
          level: "Ground Floor",
          rooms: ["Workshop 1", "Workshop 2", "Mechanical Lab", "Storage"],
        },
        {
          level: "1st Floor",
          rooms: ["Training Hall", "Equipment Room", "Faculty Office"],
        },
      ],
    },
    "A Block": {
      title: "A Block - Admin",
      description:
        "Director Office, Admin office, Auditorium, Library, Badminton Court, etc.",
      color: "from-blue-500 to-blue-600",
      image: "/A_Block.jpg",
      floors: [
        {
          level: "Ground Floor",
          rooms: [
            "A1",
            "A2",
            "Director Office",
            "Sir Ameer Gillani Office",
            "Ms. Nosheen Ramzan office",
            "Dr.Fakher Mustafa office",
            "Mr.Nasir Mehdi office",
            "Mr.Ali Usman office",
            "Ms.Sabeen Amin office",
          ],
        },
        {
          level: "1st Floor",
          rooms: ["Lecture Hall A1", "Lecture Hall A2", "Auditorium", "Labs"],
        },
        {
          level: "2nd Floor",
          rooms: [
            "Faculty Offices",
            "Lecture Hall A1.1",
            "Lecture Hall A1.2",
            "Lecture Hall A1.3",
            "Meeting Room",
          ],
        },
      ],
    },
    "B Block": {
      title: "Block B – Management Sciences",
      description: "Peaceful Lecture Halls, Beautiful Ground, Common Room.",
      color: "from-cyan-500 to-cyan-600",
      image: "/B_Block.jpg",
      floors: [
        {
          level: "Ground Floor",
          rooms: [
            "Electronics Lab 1",
            "Store",
            "Faculty offices",
            "Lecture Hall B1",
            "Lecture Hall B2",
            "Lecture Hall B3",
            "Lecture Hall B4",
            "Lecture Hall B5",
            "Lecture Hall B6",
            "Lecture Hall B7",
            "Lecture Hall B8",
            "Lecture Hall B9",
            "Lecture Hall B10",
            "Lecture Hall B11",
            "Lecture Hall B12",
            "Lecture Hall B13",
            "Lecture Hall B14",
          ],
        },
      ],
    },
    "C Block": {
      title: "C Block – Computer Science",
      description: "HOD Office, DC Office, Faculty Offices.",
      color: "from-green-500 to-green-600",
      image: "/C_Block.jpg",
      floors: [
        {
          level: "Ground Floor",
          rooms: [
            "HOD office",
            "DC Office",
            "Dr.Javed Ferzund office",
            "Dr.Muhammad Farhan office",
            "Mr.Tariq Rafiq office",
            "Ms.Aniqa Rehman office",
            "Dr.Mohammad Inaam-ul-Haq office",
            "Mr.Muhammad Umer office",
            "Ms.Mubeen Javed office",
            "Ms.Raheela Shahzadi office",
            "Dr.Yawar Abbas office",
            "Dr.Shaheen Akhter office",
            "Ms.Sana Nasir office",
            "Me.Ali Sher Kashif office",
            "Ms.Amna Pir office",
            "Ms.Anam Khan office",
            "Mr.Ghias-ul-Din Bulbun office",
            "Ms.Aqsa Kazmi office",
            "Ms.Shaheen Kauser office",
            "Ms.Kanwal Fatima office",
            "Lecture Hall C1",
            "Lecture Hall C2",
            "Lecture Hall C3",
            "Lecture Hall C4",
            "Lecture Hall C5",
          ],
        },
        {
          level: "1st Floor",
          rooms: [
            "Lecture Hall C1.1",
            "Common Room C1.2",
            "Lecture Hall C1.3",
            "Lecture Hall C1.4",
            "Lecture Hall C1.5",
            "Lecture Hall C1.6",
            "Lecture Hall C1.7",
            "Lecture Hall C1.8",
            "Lecture Hall C1.9",
            "C-Lab1",
            "C-Lab2",
          ],
        },
        {
          level: "2nd Floor",
          rooms: [
            "FYP-SE",
            "Lecture Hall C2.1",
            "Lecture Hall C2.2",
            "Lecture Hall C2.3",
            "Lecture Hall C2.4",
            "Lecture Hall C2.5",
            "C-Lab3",
            "C-Lab4",
          ],
        },
      ],
    },
    "D Block": {
      title: "D Block– Software Engineering",
      description: "Faculty Offices, Labs, and peaceful study halls.",
      color: "from-orange-500 to-orange-600",
      image: "/D_Block.jpg",
      floors: [
        {
          level: "Ground Floor",
          rooms: [
            "Lab-FSN",
            "Mr.Arslan Sarwer",
            "Ms.Anam Khan",
            "Mr.Muhammad Jamil",
            "Mr.Imran Shahzad",
            "Mr.Hafiz Muhammad Mudassar Khan",
            "Ms.Aqsa Tehseen",
            "Ms.Azka Riaz",
            "Faculty offices",
            "Lecture Hall D1",
            "Lecture Hall D2",
            "Lecture Hall D3",
            "Lecture Hall D4",
            "Lecture Hall D5",
            "Lecture Hall D6",
            "Lecture Hall D7",
            "Lecture Hall D8",
            "Lecture Hall D9",
            "Lecture Hall D10",
          ],
        },
        {
          level: "1st Floor",
          rooms: [
            "Mr.Fahad Ameem office",
            "Mr.Manzar Abbas",
            "Mr.Muhammad Ali Shahid",
            "Mr.Bilal Shabbie Qaisar",
            "Mr.Sunil Ashraf",
            "Ms.Abida Kousar",
            "Mr.Syed Anwaar Mehdi",
            "Ms.Sameen Fatima",
            "Mr.Mubasher Raza",
            "Mr.Muhammad Usman Ali",
            "Mr.Shehzad Ahmad",
            "Ms.Saba Latif",
            "Mr.Javed iqbal",
            "Mr.Muhammad Imran",
            "Ms.Hafsa Mehreen Fatima",
          ],
        },
      ],
    },
    "Sports Ground": {
      title: "Sports Ground",
      description:
        "Football field, cricket pitch, and outdoor sports facilities for students.",
      color: "from-emerald-500 to-green-600",
      image: "/Sports_Ground.jpg",
      floors: [
        {
          level: "Facilities",
          rooms: [
            "Football Field",
            "Cricket Pitch",
            "Running Track",
            "Spectator Area",
          ],
        },
      ],
    },
    Mosque: {
      title: "Campus Mosque",
      description: "A peaceful place for prayers and spiritual activities.",
      color: "from-teal-500 to-emerald-600",
      image: "/Mosque.jpg",
      floors: [
        {
          level: "Prayer Hall",
          rooms: ["Main Prayer Hall", "Wudu Area", "Shoe Rack"],
        },
      ],
    },
    Gate: {
      title: "Main Gate",
      description: "The main entrance to COMSATS University Sahiwal Campus.",
      color: "from-red-500 to-rose-600",
      image: "/gate.webp",
      floors: [
        {
          level: "Entry Points",
          rooms: [
            "Security Checkpoint",
            "Visitor Registration",
            "Vehicle Entry",
          ],
        },
      ],
    },
  };

  // Get the base block details
  const baseDetails = BLOCK_DETAILS[selectedBlock];

  // Map selected block to block letter for Firebase lookup
  const blockLetterMap = {
    "A Block": "A",
    "B Block": "B",
    "C Block": "C",
    "D Block": "D",
    "W Block": "W",
  };

  // Get Firebase rooms for this block
  const blockLetter = blockLetterMap[selectedBlock];
  const firebaseFloors = blockLetter ? getRoomsForBlock(blockLetter) : [];

  // Merge: if we have Firebase rooms, use them; otherwise use static data
  const activeDetails = {
    ...baseDetails,
    floors: firebaseFloors.length > 0 ? firebaseFloors : baseDetails.floors,
  };

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
            {/* W Block - Top Left */}
            <Block3D
              name="W Block"
              color="#8b5cf6"
              position={[-3, 0, -18]}
              isSelected={selectedBlock === "W Block"}
              onClick={setSelectedBlock}
            />
            {/* A Block - Middle Left (below W Block) */}
            <Block3D
              name="A Block"
              color="#2563eb"
              position={[-3, 0, -12]}
              isSelected={selectedBlock === "A Block"}
              onClick={setSelectedBlock}
            />
            {/* C Block - Top Right */}
            <Block3D
              name="C Block"
              color="#22c55e"
              position={[8, 0, -15]}
              isSelected={selectedBlock === "C Block"}
              onClick={setSelectedBlock}
            />
            {/* B Block - Bottom Right */}
            <Block3D
              name="B Block"
              color="#0ea5e9"
              position={[6, 0, -6]}
              isSelected={selectedBlock === "B Block"}
              onClick={setSelectedBlock}
            />
            {/* D Block - Next to B Block (Far Right) */}
            <Block3D
              name="D Block"
              color="#f97316"
              position={[14, 0, -6]}
              isSelected={selectedBlock === "D Block"}
              onClick={setSelectedBlock}
            />
            {/* Gate - Bottom Left */}
            <mesh
              position={[-14, 0, -6]}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBlock("Gate");
              }}
            >
              <boxGeometry args={[2, 1.5, 2]} />
              <meshStandardMaterial
                color={selectedBlock === "Gate" ? "#dc2626" : "#ef4444"}
              />
              <Html position={[0, 1.2, 0]} center distanceFactor={8}>
                <div
                  className={`px-2 py-1 rounded-lg text-xs font-semibold shadow-lg whitespace-nowrap ${
                    selectedBlock === "Gate"
                      ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/50"
                      : "bg-red-500 text-white"
                  }`}
                >
                  🚪 Gate
                </div>
              </Html>
            </mesh>

            {/* Sports Ground */}
            <mesh
              position={[-7, 0.1, 0]}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBlock("Sports Ground");
              }}
            >
              <boxGeometry args={[6, 0.3, 5]} />
              <meshStandardMaterial
                color={
                  selectedBlock === "Sports Ground" ? "#059669" : "#16a34a"
                }
              />
              <Html position={[0, 0.8, 0]} center distanceFactor={8}>
                <div
                  className={`px-2 py-1 rounded-lg text-xs font-semibold shadow-lg whitespace-nowrap ${
                    selectedBlock === "Sports Ground"
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-green-500/50"
                      : "bg-green-600 text-white"
                  }`}
                >
                  ⚽ Sports Ground
                </div>
              </Html>
            </mesh>

            {/* Mosque */}
            <mesh
              position={[10, 0, 2]}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBlock("Mosque");
              }}
            >
              <boxGeometry args={[3, 2.5, 3]} />
              <meshStandardMaterial
                color={selectedBlock === "Mosque" ? "#0d9488" : "#059669"}
              />
              <Html position={[0, 1.8, 0]} center distanceFactor={8}>
                <div
                  className={`px-2 py-1 rounded-lg text-xs font-semibold shadow-lg whitespace-nowrap ${
                    selectedBlock === "Mosque"
                      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-teal-500/50"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  🕌 Mosque
                </div>
              </Html>
            </mesh>

            {/* Paths/Roads - Left vertical path (connecting W Block → A Block → Sports Ground) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3, -0.9, -9]}>
              <planeGeometry args={[1.5, 22]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
            {/* Right vertical path (connecting C Block → B Block → Mosque area) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8, -0.9, -7]}>
              <planeGeometry args={[1.5, 18]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
            {/* Horizontal path at bottom (connecting Gate → B Block → D Block) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, -6]}>
              <planeGeometry args={[32, 1.5]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
            {/* Horizontal path at middle (connecting A Block area → C Block area) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, -0.9, -12]}>
              <planeGeometry args={[14, 1.5]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
            {/* Horizontal path near Sports Ground and Mosque */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
              <planeGeometry args={[20, 1.5]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
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

        {/* Block Image - Before Details */}
        {activeDetails.image && (
          <div className="mb-4 rounded-xl overflow-hidden border border-slate-700/40 shadow-lg">
            <div className="relative">
              <img
                src={activeDetails.image}
                alt={activeDetails.title}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1F]/60 to-transparent" />
              <div className="absolute bottom-2 left-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-medium bg-gradient-to-r ${activeDetails.color} text-white shadow`}
                >
                  📸 {selectedBlock}
                </span>
              </div>
            </div>
          </div>
        )}

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
            Floor Details{" "}
            {firebaseFloors.length > 0 && (
              <span className="text-green-400 ml-1">• Live Data</span>
            )}
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
                {floor.roomDetails && (
                  <span className="text-xs text-gray-500 font-normal ml-auto">
                    {floor.roomDetails.length} rooms
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {floor.roomDetails
                  ? // Firebase rooms with amenity details
                    floor.roomDetails.map((room, rIdx) => (
                      <span
                        key={rIdx}
                        className="text-xs bg-[#0A0F1F]/50 text-gray-300 px-2.5 py-1.5 rounded-lg border border-gray-700/30 flex items-center gap-1.5"
                        title={`Capacity: ${room.capacity || 0}${
                          room.hasLCD ? " • LCD" : ""
                        }${room.hasProjector ? " • Projector" : ""}${
                          room.hasAC ? " • AC" : ""
                        }`}
                      >
                        {room.name}
                        {(room.hasLCD || room.hasProjector || room.hasAC) && (
                          <span className="text-[10px] opacity-70">
                            {room.hasLCD && "🖥️"}
                            {room.hasProjector && "📽️"}
                            {room.hasAC && "❄️"}
                          </span>
                        )}
                      </span>
                    ))
                  : // Static rooms (simple strings)
                    floor.rooms.map((room, rIdx) => (
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
