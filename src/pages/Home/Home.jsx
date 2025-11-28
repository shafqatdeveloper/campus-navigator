import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const CARDS = [
        { title: "Navigate Campus", path: "/navigate", icon: "🧭" },
        { title: "Ask Questions", path: "/ask", icon: "🤖" },
        { title: "Search Rooms & Teachers", path: "/search", icon: "🏫" },
        { title: "Campus Map", path: "/map", icon: "🗺️" },
        { title: "Robot Live Control", path: "/control", icon: "🎮" },
        { title: "Scan QR & Start", path: "/scan", icon: "📷" },
    ];

    return (
        <div className="min-h-screen w-full bg-[#0B0F19] text-white px-6 py-10">
            <h1 className="text-3xl font-bold text-center mb-8">
                Campus Navigator Assistant
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {CARDS.map((card, index) => (
                    <div
                        key={index}
                        onClick={() => navigate(card.path)}
                        className="cursor-pointer bg-[#111827] border border-gray-700 hover:border-blue-500 
                       p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center 
                       text-center transition transform hover:scale-105 active:scale-95"
                    >
                        <span className="text-5xl mb-3">{card.icon}</span>
                        <h2 className="text-lg font-semibold">{card.title}</h2>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Home;
