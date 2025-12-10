import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRobot,
  FaChalkboardTeacher,
  FaDoorOpen,
  FaMap,
  FaCompass,
} from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  const CARDS = [
    {
      title: "Ask Questions",
      description: "Get instant answers from AI",
      path: "/ask",
      icon: <FaRobot className="text-4xl" />,
      color: "from-blue-500 to-cyan-400",
      emoji: "🤖",
    },
    {
      title: "Teachers",
      description: "Find faculty information",
      path: "/teachers",
      icon: <FaChalkboardTeacher className="text-4xl" />,
      color: "from-purple-500 to-pink-500",
      emoji: "👩‍🏫",
    },
    {
      title: "Rooms",
      description: "Locate classrooms & labs",
      path: "/rooms",
      icon: <FaDoorOpen className="text-4xl" />,
      color: "from-amber-400 to-orange-500",
      emoji: "🚪",
    },
    {
      title: "Campus Map",
      description: "Explore 3D campus view",
      path: "/campus-map",
      icon: <FaMap className="text-4xl" />,
      color: "from-emerald-400 to-green-500",
      emoji: "🗺️",
    },
    {
      title: "Navigate",
      description: "Guide robot to location",
      path: "/navigate-campus",
      icon: <FaCompass className="text-4xl" />,
      color: "from-rose-500 to-red-500",
      emoji: "🧭",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0A0F1F] text-white px-4 md:px-6 py-8 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-[40%] right-[20%] w-[250px] h-[250px] bg-pink-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[30%] left-[15%] w-[200px] h-[200px] bg-cyan-500/15 rounded-full blur-[100px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-500/30 mb-4">
            <span className="text-sm text-purple-300">
              ✨ AI-Powered Campus Assistant
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300 animate-gradient">
              Campus Navigator
            </span>
          </h1>

          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Your intelligent guide to COMSATS University Sahiwal. Ask questions,
            find teachers, locate rooms, and navigate the campus effortlessly.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARDS.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="group relative cursor-pointer bg-[#101726]/80 backdrop-blur-xl 
                         border border-slate-700/50 p-6 rounded-2xl shadow-xl
                         transition-all duration-300 hover:-translate-y-2 
                         hover:shadow-2xl hover:border-purple-500/50"
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 rounded-2xl opacity-0 
                            group-hover:opacity-20 transition-opacity duration-500
                            bg-gradient-to-br ${card.color}`}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                {/* Icon Container */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} 
                                flex items-center justify-center shadow-lg
                                transform transition-transform duration-300 
                                group-hover:scale-110 group-hover:rotate-3`}
                >
                  <span className="text-3xl">{card.emoji}</span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-white group-hover:text-white transition-colors">
                  {card.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  {card.description}
                </p>

                {/* Animated Line */}
                <div
                  className={`h-1 w-12 rounded-full bg-gradient-to-r ${card.color} 
                              opacity-60 group-hover:w-20 transition-all duration-300`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Tip */}
        <div className="mt-10 p-4 rounded-xl bg-[#1C2431]/50 border border-gray-700/30 text-center">
          <p className="text-gray-500 text-sm">
            💡 <span className="text-gray-400">Tip:</span> Use the Ask Questions
            feature for instant AI-powered answers about the campus!
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
      `}</style>
    </div>
  );
};

export default Home;
