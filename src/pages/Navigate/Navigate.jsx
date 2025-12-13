import React, { useState } from "react";
import {
  FaArrowLeft,
  FaPaperPlane,
  FaLocationArrow,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaRobot,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// Status Toast Component
const StatusToast = ({ status, message, onClose }) => {
  const statusConfig = {
    sending: {
      icon: <FaSpinner className="animate-spin" />,
      bg: "bg-blue-500/20 border-blue-500/50",
      text: "text-blue-300",
    },
    success: {
      icon: <FaCheckCircle />,
      bg: "bg-green-500/20 border-green-500/50",
      text: "text-green-300",
    },
    error: {
      icon: <FaExclamationCircle />,
      bg: "bg-red-500/20 border-red-500/50",
      text: "text-red-300",
    },
  };

  const config = statusConfig[status] || statusConfig.sending;

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 ${config.bg}`}
    >
      <span className={`text-lg ${config.text}`}>{config.icon}</span>
      <span className={`text-sm font-medium ${config.text}`}>{message}</span>
      {status !== "sending" && (
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-white transition-colors"
        >
          <FaTimes size={12} />
        </button>
      )}
    </div>
  );
};

const NavigateCampus = () => {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [robotMsg, setRobotMsg] = useState("");
  const [robotStatus, setRobotStatus] = useState(null);
  const [toast, setToast] = useState(null);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const SUGGESTIONS = [
    { name: "C1", type: "Classroom" },
    { name: "C2", type: "Classroom" },
    { name: "C3", type: "Classroom" },
    { name: "C4", type: "Classroom" },
    { name: "C5", type: "Classroom" },
    { name: "Faculty Offices", type: "Office" },
    { name: "C Block Entrance", type: "Building" },
    { name: "HOD Office", type: "Office" },
  ];

  const filtered = SUGGESTIONS.filter((s) =>
    s.name.toLowerCase().includes(location.toLowerCase())
  );

  const showToast = (status, message, duration = null) => {
    setToast({ status, message });
    if (duration) {
      setTimeout(() => setToast(null), duration);
    }
  };

  const sendNavigation = async () => {
    if (!location.trim()) {
      showToast("error", "Please enter a destination!", 3000);
      return;
    }

    setLoading(true);
    setRobotMsg("");
    setRobotStatus(null);
    showToast("sending", "Sending command to robot...");

    try {
      const res = await fetch(`${BACKEND_URL}/navigate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: location }),
      });

      const data = await res.json();

      if (data.status === "ok") {
        setRobotMsg(`Robot is now navigating to ${location}`);
        setRobotStatus("success");
        showToast("success", "Navigation started!", 3000);
      } else {
        setRobotMsg("Failed to send navigation command.");
        setRobotStatus("error");
        showToast("error", "Navigation failed!", 3000);
      }
    } catch {
      setRobotMsg("Robot connection error. Please try again.");
      setRobotStatus("error");
      showToast("error", "Connection error!", 3000);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendNavigation();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white px-4 md:px-6 py-8 relative overflow-hidden">
      {/* Toast */}
      {toast && (
        <StatusToast
          status={toast.status}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Enhanced Background Effects */}
      <div className="absolute top-[-20%] left-[-12%] w-[450px] h-[450px] bg-blue-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-12%] w-[450px] h-[450px] bg-purple-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-[30%] right-[10%] w-[200px] h-[200px] bg-rose-500/20 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col gap-6">
        {/* Back Button */}
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white 
                     bg-[#1C2431]/80 backdrop-blur-sm px-4 py-2.5 rounded-xl w-fit border border-gray-700/30
                     transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
        >
          <FaArrowLeft /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300 animate-gradient">
            Navigate Campus
          </h1>
          <p className="text-gray-400 text-base">
            Command the robot to guide you anywhere on campus 🤖
          </p>
        </div>

        {/* Status Box */}
        <div className="bg-[#101726]/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/40 shadow-xl min-h-[100px] relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />

          {loading ? (
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <p className="text-blue-400 text-lg">
                Sending command to robot...
              </p>
            </div>
          ) : robotMsg ? (
            <div className="space-y-2">
              <div
                className={`flex items-center gap-2 text-sm mb-2 ${
                  robotStatus === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {robotStatus === "success" ? (
                  <FaCheckCircle />
                ) : (
                  <FaExclamationCircle />
                )}
                <span>
                  {robotStatus === "success"
                    ? "Command sent successfully"
                    : "Command failed"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <FaRobot className="text-white" />
                </div>
                <p className="text-gray-200 text-base">{robotMsg}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[60px] text-center">
              <div className="text-3xl mb-2 opacity-50">🧭</div>
              <p className="text-gray-500">
                Enter a destination to navigate...
              </p>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div
          className="flex items-center gap-3 w-full bg-[#1C2431]/90 backdrop-blur-sm border border-gray-700/50 
                        px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:border-purple-500/50"
        >
          <FaLocationArrow className="text-gray-500" />
          <input
            type="text"
            placeholder="Enter room or place (e.g., D4, Faculty Offices)"
            className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-base"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            onClick={sendNavigation}
            disabled={loading || !location.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 
                       px-5 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20
                       disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            <FaPaperPlane />
          </button>
        </div>

        {/* Suggestions */}
        <div
          className="bg-[#101726]/80 backdrop-blur-xl rounded-2xl border border-slate-700/40 
                        p-5 shadow-xl max-h-[40vh] overflow-y-auto"
        >
          <p className="text-gray-400 text-sm mb-3 flex items-center gap-2">
            <span>📍</span> Quick Destinations
            <span className="text-gray-600 text-xs">
              ({filtered.length} results)
            </span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filtered.length > 0 ? (
              filtered.map((item, i) => (
                <div
                  key={i}
                  onClick={() => setLocation(item.name)}
                  className={`group relative cursor-pointer bg-[#1C2431]/60 backdrop-blur-xl 
                             border p-3 rounded-xl flex items-center gap-3 
                             transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
                             ${
                               location === item.name
                                 ? "border-purple-500/70 shadow-purple-500/20"
                                 : "border-slate-700/50 hover:border-purple-500/50"
                             }`}
                >
                  {/* Glow */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 
                                  transition bg-gradient-to-br from-blue-500 to-purple-500"
                  />

                  <div
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-red-600 
                                  flex items-center justify-center shadow"
                  >
                    <FaLocationArrow className="text-white text-xs" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-white font-medium">
                      {item.name}
                    </span>
                    <p className="text-xs text-gray-500">{item.type}</p>
                  </div>

                  {location === item.name && (
                    <FaCheckCircle className="text-purple-400 text-sm" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm col-span-2 text-center py-4">
                No matching destinations...
              </p>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="p-4 rounded-xl bg-[#1C2431]/50 border border-gray-700/30">
          <p className="text-gray-500 text-xs text-center">
            💡 <span className="text-gray-400">Tip:</span> Press Enter to send
            the navigation command, or click on a suggestion to select it!
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

export default NavigateCampus;
