import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const CARDS = [
        { title: "Ask Questions", path: "/ask", icon: "🤖", color: "from-blue-500 to-cyan-400" },
        { title: "Teachers", path: "/teachers", icon: "👩‍🏫", color: "from-purple-500 to-pink-500" },
        { title: "Rooms", path: "/rooms", icon: "🚪", color: "from-amber-400 to-orange-500" },
        { title: "Campus Map", path: "/campus-map", icon: "🗺️", color: "from-emerald-400 to-green-500" },
        { title: "Navigate Campus", path: "/navigate-campus", icon: "🧭", color: "from-rose-500 to-red-500" },
    ];

    return (
        <div className="min-h-screen w-full bg-[#0A0F1F] text-white px-6 py-5 relative overflow-hidden">

            {/* Soft beautiful floating gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse-slower" />
            <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[150px]" />

            <div className="max-w-5xl mx-auto relative z-10">

                {/* Humanized Hero Section */}
                <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-10 tracking-tight leading-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300 animate-gradient-x">
                        Campus Navigator
                    </span>
                </h1>

                {/* CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CARDS.map((card, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(card.path)}
                            className="group relative cursor-pointer bg-slate-800/40 backdrop-blur-xl 
                         border border-slate-700/50 p-8 rounded-3xl shadow-2xl flex 
                         flex-col items-center justify-center text-center 
                         transition-all duration-500 hover:-translate-y-3 
                         hover:shadow-2xl hover:shadow-blue-500/20 hover:bg-slate-800/60"
                        >
                            {/* Glow Hover */}
                            <div
                                className={`absolute inset-0 rounded-3xl opacity-0 
                            group-hover:opacity-20 transition-opacity duration-500
                            bg-gradient-to-br ${card.color}`}
                            />

                            {/* Icon */}
                            <span className="text-7xl mb-6 drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] 
                               transform transition-transform duration-500 
                               group-hover:scale-125 group-hover:rotate-6">
                                {card.icon}
                            </span>

                            {/* Title */}
                            <h2 className="text-xl font-bold text-slate-100 group-hover:text-white transition-colors">
                                {card.title}
                            </h2>

                            {/* Underline Animation */}
                            <div
                                className={`h-1 w-12 mt-4 rounded-full bg-gradient-to-r ${card.color} 
                            opacity-60 group-hover:w-28 transition-all duration-500`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom subtle animations */}
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

export default Home;
