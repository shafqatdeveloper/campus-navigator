import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

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
            {/* Block Shape */}
            <boxGeometry args={[4, 2, 4]} />
            <meshStandardMaterial
                color={color}
                emissive={isSelected ? color : "#000000"}
                emissiveIntensity={isSelected ? 0.6 : 0}
            />

            {/* Floating Label */}
            <Html position={[0, 1.7, 0]} center distanceFactor={8}>
                <div
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-300 
                    ${isSelected
                            ? "bg-blue-500 text-white shadow-md shadow-blue-500/50"
                            : "bg-black/60 text-gray-200 backdrop-blur-sm"
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
            floors: [
                { level: "Ground Floor", rooms: ["Electronics Lab 1", "Store"] },
                { level: "1st Floor", rooms: ["Circuits Lab", "Power Lab"] },
                { level: "2nd Floor", rooms: ["Project Rooms", "Faculty Offices"] },
            ],
        },
        "Block C": {
            title: "Block C – Admin & Management",
            description:
                "Accounts, administration, examination branch, and director’s office.",
            floors: [
                { level: "Ground Floor", rooms: ["Reception", "Accounts Office"] },
                { level: "1st Floor", rooms: ["Examination Branch", "Record Room"] },
                { level: "2nd Floor", rooms: ["Conference Hall", "Director Office"] },
            ],
        },
        "Block D": {
            title: "Block D – Library & Study Area",
            description:
                "Main library, digital library, and peaceful study halls.",
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

            {/* Floating gradients for theme consistency */}
            <div className="absolute top-[-20%] left-[-15%] w-[450px] h-[450px] bg-blue-600/20 rounded-full blur-[150px] animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-15%] w-[450px] h-[450px] bg-purple-600/20 rounded-full blur-[150px] animate-pulse-slower" />

            {/* ---------------- 3D MAP LEFT SIDE ---------------- */}
            <div className="w-full md:w-2/3 h-[45vh] md:h-screen border-b md:border-b-0 md:border-r border-slate-800 relative z-10">
                <Canvas
                    shadows
                    camera={{ position: [10, 10, 10], fov: 45 }}
                    className="bg-[#0A0F1F]"
                >
                    <ambientLight intensity={0.4} />
                    <directionalLight
                        position={[10, 15, 5]}
                        intensity={1.2}
                        castShadow
                    />

                    {/* Ground */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                        <planeGeometry args={[50, 50]} />
                        <meshStandardMaterial color="#0A0F1F" />
                    </mesh>

                    <Suspense fallback={null}>
                        {/* Blocks */}
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

            {/* ---------------- RIGHT PANEL ---------------- */}
            <div className="w-full md:w-1/3 p-7 md:p-10 bg-[#0F1626]/70 backdrop-blur-xl border-l border-slate-800 relative z-10">

                <h2 className="text-3xl font-extrabold mb-3 bg-clip-text text-transparent 
                               bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300 animate-gradient-x">
                    Campus 3D Map
                </h2>

                <p className="text-slate-400 text-sm mb-6">
                    Rotate, zoom, and tap on any block to explore details in real time.
                </p>

                {/* Selected Block */}
                <div className="mb-4">
                    <span className="text-xs uppercase tracking-wide text-slate-500">
                        Selected Block
                    </span>
                    <h3 className="text-xl font-semibold mt-1">{activeDetails.title}</h3>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm mb-6">{activeDetails.description}</p>

                {/* Floors */}
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 custom-scroll">
                    {activeDetails.floors.map((floor, idx) => (
                        <div key={idx} className="border border-slate-700 rounded-xl p-4 bg-slate-900/40 hover:bg-slate-900/60 transition">
                            <div className="text-sm font-semibold text-sky-400">{floor.level}</div>
                            <ul className="mt-1 text-xs text-slate-300 list-disc list-inside space-y-1">
                                {floor.rooms.map((room, rIdx) => (
                                    <li key={rIdx}>{room}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Navigation Button */}
                <button
                    className="mt-7 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm 
                               font-semibold transition shadow-lg shadow-blue-600/30"
                    onClick={() => alert(`Start navigation to ${selectedBlock}`)}
                >
                    Start Navigation to {selectedBlock}
                </button>
            </div>

            {/* Animations */}
            <style>{`
                .animate-pulse-slow {
                    animation: pulse 6s ease-in-out infinite;
                }
                .animate-pulse-slower {
                    animation: pulse 9s ease-in-out infinite;
                }
                @keyframes pulse {
                    0% { opacity: .5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                    100% { opacity: .5; transform: scale(1); }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 6s ease infinite;
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: left center; }
                    50% { background-position: right center; }
                }
            `}</style>
        </div>
    );
};

export default CampusMap;
