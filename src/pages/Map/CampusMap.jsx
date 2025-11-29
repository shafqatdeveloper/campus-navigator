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
        >
            {/* Box shape */}
            <boxGeometry args={[4, 2, 4]} />
            <meshStandardMaterial
                color={color}
                emissive={isSelected ? "#3b82f6" : "#000000"}
                emissiveIntensity={isSelected ? 0.7 : 0}
            />

            {/* Floating label above the block */}
            <Html position={[0, 1.6, 0]} center distanceFactor={8}>
                <div
                    className={`px-2 py-1 rounded-md text-xs font-semibold ${isSelected ? "bg-blue-500 text-white" : "bg-black/70 text-gray-200"
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

    // You’ll later replace / extend this with real data
    const BLOCK_DETAILS = {
        "Block A": {
            title: "Block A – Computer Science",
            description:
                "Contains CS labs, AI lab, faculty offices, and main lecture halls.",
            floors: [
                { level: "Ground Floor", rooms: ["CS Lab 1", "CS Lab 2", "Reception"] },
                { level: "1st Floor", rooms: ["Lecture Hall A1", "Lecture Hall A2"] },
                { level: "2nd Floor", rooms: ["Faculty Offices", "Meeting Room"] },
            ],
        },
        "Block B": {
            title: "Block B – Electrical / Electronics",
            description:
                "Electronics labs, circuits lab, power lab, and project rooms.",
            floors: [
                { level: "Ground Floor", rooms: ["Electronics Lab 1", "Store"] },
                { level: "1st Floor", rooms: ["Circuits Lab", "Power Lab"] },
                { level: "2nd Floor", rooms: ["Project Rooms", "Faculty Offices"] },
            ],
        },
        "Block C": {
            title: "Block C – Admin & Management",
            description:
                "Administration offices, accounts, examination branch, and conference room.",
            floors: [
                { level: "Ground Floor", rooms: ["Reception", "Accounts Office"] },
                { level: "1st Floor", rooms: ["Examination Branch", "Record Room"] },
                { level: "2nd Floor", rooms: ["Conference Hall", "Director Office"] },
            ],
        },
        "Block D": {
            title: "Block D – Library & Study Area",
            description:
                "Main library, group study rooms, digital library, and reading halls.",
            floors: [
                { level: "Ground Floor", rooms: ["Library Entry", "Issue Desk"] },
                { level: "1st Floor", rooms: ["Reading Hall", "Reference Section"] },
                { level: "2nd Floor", rooms: ["Digital Library", "Group Study Rooms"] },
            ],
        },
    };

    const activeDetails = BLOCK_DETAILS[selectedBlock];

    return (
        <div className="min-h-screen w-full bg-[#020617] text-white flex flex-col md:flex-row">
            {/* -------------- LEFT: 3D VIEW -------------- */}
            <div className="w-full md:w-2/3 h-[50vh] md:h-screen border-b md:border-b-0 md:border-r border-slate-800">
                <Canvas
                    shadows
                    camera={{ position: [10, 10, 10], fov: 45 }}
                    className="bg-[#020617]"
                >
                    {/* Lights */}
                    <ambientLight intensity={0.4} />
                    <directionalLight
                        position={[10, 15, 5]}
                        intensity={1.2}
                        castShadow
                    />

                    {/* Ground plane */}
                    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                        <planeGeometry args={[40, 40]} />
                        <meshStandardMaterial color="#020617" />
                    </mesh>

                    <Suspense fallback={null}>
                        {/* Block A */}
                        <Block3D
                            name="Block A"
                            color="#1D4ED8"
                            position={[-6, 0, 0]}
                            isSelected={selectedBlock === "Block A"}
                            onClick={setSelectedBlock}
                        />

                        {/* Block B */}
                        <Block3D
                            name="Block B"
                            color="#0EA5E9"
                            position={[0, 0, 0]}
                            isSelected={selectedBlock === "Block B"}
                            onClick={setSelectedBlock}
                        />

                        {/* Block C */}
                        <Block3D
                            name="Block C"
                            color="#22C55E"
                            position={[6, 0, 0]}
                            isSelected={selectedBlock === "Block C"}
                            onClick={setSelectedBlock}
                        />

                        {/* Block D */}
                        <Block3D
                            name="Block D"
                            color="#F97316"
                            position={[0, 0, -6]}
                            isSelected={selectedBlock === "Block D"}
                            onClick={setSelectedBlock}
                        />
                    </Suspense>

                    {/* Camera Controls */}
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

            {/* -------------- RIGHT: DETAILS PANEL -------------- */}
            <div className="w-full md:w-1/3 p-6 md:p-8 bg-[#020617]">
                <h2 className="text-2xl font-bold mb-2">Campus 3D Map</h2>
                <p className="text-slate-400 text-sm mb-6">
                    Rotate, zoom, and tap on any block in the 3D view to see its details.
                </p>

                {/* Selected Block Name */}
                <div className="mb-4">
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                        Selected Block
                    </span>
                    <h3 className="text-xl font-semibold mt-1">{activeDetails.title}</h3>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm mb-6">
                    {activeDetails.description}
                </p>

                {/* Floors */}
                <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1">
                    {activeDetails.floors.map((floor, idx) => (
                        <div
                            key={idx}
                            className="border border-slate-700 rounded-xl p-3 bg-slate-900/40"
                        >
                            <div className="text-sm font-semibold text-sky-400">
                                {floor.level}
                            </div>
                            <ul className="mt-1 text-xs text-slate-300 list-disc list-inside space-y-1">
                                {floor.rooms.map((room, rIdx) => (
                                    <li key={rIdx}>{room}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Future: link with robot */}
                <button
                    className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold transition"
                    onClick={() => {
                        // Later you can integrate real navigation here
                        // e.g., open directions to this block
                        alert(`Start navigation to ${selectedBlock}`);
                    }}
                >
                    Start Navigation to {selectedBlock}
                </button>
            </div>
        </div>
    );
};

export default CampusMap;
