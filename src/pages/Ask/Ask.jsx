import React, { useState, useRef, useEffect } from "react";
import {
  FaMicrophone,
  FaStop,
  FaPaperPlane,
  FaArrowLeft,
  FaUpload,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// ========================================
// CUSTOM AUDIO PLAYER COMPONENT
// ========================================
const AudioPlayer = ({ src, title = "Audio Response", onClose }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setVolume(percentage);
    audio.volume = percentage;
    setIsMuted(percentage === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 1;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative bg-gradient-to-br from-[#1a1f35] via-[#252b45] to-[#1a1f35] p-5 rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl transition-all duration-500 ${
            isPlaying
              ? "bg-purple-500/40 scale-150"
              : "bg-purple-500/20 scale-100"
          }`}
        />
      </div>

      <audio ref={audioRef} src={src} />

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10"
        >
          <FaTimes size={16} />
        </button>
      )}

      {/* Title */}
      <div className="relative z-10 text-center mb-4">
        <p className="text-xs text-purple-300 uppercase tracking-widest mb-1">
          Now Playing
        </p>
        <h3 className="text-white font-semibold text-lg">{title}</h3>
      </div>

      {/* Visualizer Effect */}
      <div className="relative z-10 flex justify-center items-end gap-1 h-16 mb-4">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-150 ${
              isPlaying
                ? "bg-gradient-to-t from-purple-500 to-pink-400"
                : "bg-gray-600"
            }`}
            style={{
              // eslint-disable-next-line react-hooks/purity
              height: isPlaying ? `${Math.random() * 60 + 20}%` : "20%",
              animation: isPlaying
                ? `pulse ${
                    // eslint-disable-next-line react-hooks/purity
                    0.3 + Math.random() * 0.5
                  }s ease-in-out infinite alternate`
                : "none",
            }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 mb-4">
        <div
          className="h-2 bg-gray-700/50 rounded-full cursor-pointer overflow-hidden backdrop-blur-sm"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 rounded-full relative transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-purple-500/50" />
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex items-center justify-center gap-6">
        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
          </button>
          <div
            className="w-16 h-1.5 bg-gray-700 rounded-full cursor-pointer overflow-hidden"
            onClick={handleVolumeChange}
          >
            <div
              className="h-full bg-purple-400 rounded-full"
              style={{ width: `${isMuted ? 0 : volume * 100}%` }}
            />
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={!isLoaded}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isPlaying
              ? "bg-gradient-to-br from-pink-500 to-purple-600 shadow-purple-500/50"
              : "bg-gradient-to-br from-purple-500 to-pink-600 shadow-pink-500/50"
          } hover:scale-105 active:scale-95 disabled:opacity-50`}
        >
          {isPlaying ? (
            <FaPause size={20} className="text-white" />
          ) : (
            <FaPlay size={20} className="text-white ml-1" />
          )}
        </button>

        {/* Spacer for symmetry */}
        <div className="w-24" />
      </div>

      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#1a1f35]/80 flex items-center justify-center rounded-3xl z-20">
          <FaSpinner className="animate-spin text-purple-400 text-2xl" />
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scaleY(0.5);
          }
          100% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
};

// ========================================
// DEMO AUDIO PLAYER (FOR PREVIEW)
// ========================================
const DemoAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [animationTick, setAnimationTick] = useState(0);

  const duration = 185; // 3:05 demo duration

  // Simulate playback
  useEffect(() => {
    let interval;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime]);

  // Animate visualizer bars
  useEffect(() => {
    let animationInterval;
    if (isPlaying) {
      animationInterval = setInterval(() => {
        setAnimationTick((prev) => prev + 1);
      }, 150);
    }
    return () => clearInterval(animationInterval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = Math.floor(percentage * duration);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setVolume(percentage);
    setIsMuted(percentage === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div className="relative bg-gradient-to-br from-[#1a1f35] via-[#252b45] to-[#1a1f35] p-5 rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl transition-all duration-500 ${
            isPlaying
              ? "bg-purple-500/40 scale-150"
              : "bg-purple-500/20 scale-100"
          }`}
        />
      </div>

      {/* Title */}
      <div className="relative z-10 text-center mb-4">
        <p className="text-xs text-purple-300 uppercase tracking-widest mb-1">
          Now Playing
        </p>
        <h3 className="text-white font-semibold text-lg">
          Campus Assistant Response
        </h3>
        <p className="text-xs text-gray-500 mt-1">Demo Preview Mode</p>
      </div>

      {/* Visualizer Effect */}
      <div className="relative z-10 flex justify-center items-end gap-1 h-16 mb-4">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-full transition-all duration-150 ${
              isPlaying
                ? "bg-gradient-to-t from-purple-500 to-pink-400"
                : "bg-gray-600"
            }`}
            style={{
              height: isPlaying
                ? `${20 + Math.sin(animationTick / 2 + i) * 30 + 30}%`
                : "20%",
              transition: isPlaying ? "height 0.15s ease" : "height 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 mb-4">
        <div
          className="h-2 bg-gray-700/50 rounded-full cursor-pointer overflow-hidden backdrop-blur-sm"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 rounded-full relative transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-purple-500/50" />
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex items-center justify-center gap-6">
        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
          </button>
          <div
            className="w-16 h-1.5 bg-gray-700 rounded-full cursor-pointer overflow-hidden"
            onClick={handleVolumeChange}
          >
            <div
              className="h-full bg-purple-400 rounded-full transition-all"
              style={{ width: `${isMuted ? 0 : volume * 100}%` }}
            />
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isPlaying
              ? "bg-gradient-to-br from-pink-500 to-purple-600 shadow-purple-500/50"
              : "bg-gradient-to-br from-purple-500 to-pink-600 shadow-pink-500/50"
          } hover:scale-105 active:scale-95`}
        >
          {isPlaying ? (
            <FaPause size={20} className="text-white" />
          ) : (
            <FaPlay size={20} className="text-white ml-1" />
          )}
        </button>

        {/* Spacer for symmetry */}
        <div className="w-24" />
      </div>
    </div>
  );
};

// ========================================
// STATUS TOAST COMPONENT
// ========================================
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
    recording: {
      icon: <FaMicrophone className="animate-pulse" />,
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
      {status !== "sending" && status !== "recording" && (
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

// ========================================
// MAIN ASK COMPONENT
// ========================================
const Ask = () => {
  const [question, setQuestion] = useState("");
  const [recording, setRecording] = useState(false);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioToSend, setAudioToSend] = useState(null);
  const [responseFormat, setResponseFormat] = useState("text");
  const [audioResponse, setAudioResponse] = useState(null);
  const [toast, setToast] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showDemoPlayer, setShowDemoPlayer] = useState(true); // Demo player visible by default

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://10.204.112.173:5000";

  // Show toast helper
  const showToast = (status, message, duration = null) => {
    setToast({ status, message });
    if (duration) {
      setTimeout(() => setToast(null), duration);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setRecording(true);
      setRecordingDuration(0);
      showToast("recording", "Recording... Speak now");

      // Recording duration timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
    } catch (err) {
      showToast("error", "Microphone permission denied!", 3000);
      console.error(err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setRecording(false);
    clearInterval(recordingIntervalRef.current);
    setToast(null);

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      setAudioToSend(audioBlob);
      sendAudioToBackend(audioBlob);
    };
  };

  // Send audio to backend
  const sendAudioToBackend = async (audioBlob) => {
    setLoading(true);
    setResponse("");
    setAudioResponse(null);
    showToast("sending", "Sending your voice message...");

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");
    formData.append("response_format", responseFormat);

    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      if (responseFormat === "audio") {
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioResponse(audioUrl);
        setResponse("");
        showToast("success", "Voice response received!", 3000);
      } else {
        const data = await res.json();
        setResponse(data.answer || "No response received.");
        showToast("success", "Response received!", 3000);
      }
    } catch (err) {
      console.error(err);
      setResponse("");
      showToast("error", "Failed to send audio. Please try again.", 4000);
    }

    setLoading(false);
  };

  // Upload selected voice file
  const uploadSelectedVoice = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioToSend(file);
      sendAudioToBackend(file);
    }
  };

  // Send typed text
  const sendTextQuestion = async () => {
    if (!question.trim()) {
      showToast("error", "Please enter a question first!", 3000);
      return;
    }

    setLoading(true);
    setResponse("");
    setAudioResponse(null);
    showToast("sending", "Sending your question...");

    const formData = new FormData();
    formData.append("text", question);
    formData.append("response_format", responseFormat);

    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      if (responseFormat === "audio") {
        const audioBlob = await res.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioResponse(audioUrl);
        setResponse("");
        showToast("success", "Voice response received!", 3000);
      } else {
        const data = await res.json();
        setResponse(data.answer || "No answer found.");
        showToast("success", "Response received!", 3000);
      }
      setQuestion("");
    } catch (err) {
      console.error(err);
      setResponse("");
      showToast("error", "Connection failed. Is the server running?", 4000);
    }

    setLoading(false);
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendTextQuestion();
    }
  };

  // Format recording duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0F1F] text-white px-4 md:px-6 py-8 relative overflow-hidden">
      {/* Status Toast */}
      {toast && (
        <StatusToast
          status={toast.status}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-[40%] right-[20%] w-[200px] h-[200px] bg-pink-600/20 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-5">
        {/* Back Button */}
        <Link
          to={"/"}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white 
                     bg-[#1C2431]/80 backdrop-blur-sm px-4 py-2.5 rounded-xl w-fit border border-gray-700/30
                     transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
        >
          <FaArrowLeft /> Back to Home
        </Link>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300 animate-gradient">
            Ask the Assistant
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Type or speak your question — I'm here to help! 🎧✨
          </p>
        </div>

        {/* Response Format Selector */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setResponseFormat("text")}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
              responseFormat === "text"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-[#1C2431] text-gray-400 hover:text-white border border-gray-700/50 hover:border-purple-500/50"
            }`}
          >
            📝 Text
          </button>
          <button
            onClick={() => setResponseFormat("audio")}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
              responseFormat === "audio"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                : "bg-[#1C2431] text-gray-400 hover:text-white border border-gray-700/50 hover:border-purple-500/50"
            }`}
          >
            🔊 Voice
          </button>
        </div>

        {/* Response Box */}
        <div className="bg-[#101726]/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/40 shadow-xl min-h-[140px] relative overflow-hidden">
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
                Processing your request...
              </p>
            </div>
          ) : response ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-400 text-sm mb-2">
                <FaCheckCircle />
                <span>Response received</span>
              </div>
              <p className="text-gray-200 leading-relaxed text-base">
                {response}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[80px] text-center">
              <div className="text-3xl mb-2 opacity-50">💬</div>
              <p className="text-gray-500">Your response will appear here...</p>
            </div>
          )}
        </div>

        {/* Audio Response Player */}
        {audioResponse && (
          <AudioPlayer
            src={audioResponse}
            title="Assistant Response"
            onClose={() => setAudioResponse(null)}
          />
        )}

        {/* Demo Audio Player Preview */}
        {showDemoPlayer && !audioResponse && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-purple-300 text-sm font-medium">
                🎨 Audio Player Preview (Demo)
              </p>
              <button
                onClick={() => setShowDemoPlayer(false)}
                className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1 rounded-lg bg-gray-800/50"
              >
                Hide Preview
              </button>
            </div>
            <DemoAudioPlayer />
          </div>
        )}

        {/* Show Demo Button when hidden */}
        {!showDemoPlayer && !audioResponse && (
          <button
            onClick={() => setShowDemoPlayer(true)}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4"
          >
            🎵 Show Audio Player Preview
          </button>
        )}

        {/* Input Section */}
        <div className="flex flex-col gap-3">
          <div
            className={`flex items-center gap-3 w-full bg-[#1C2431]/90 backdrop-blur-sm border 
                        px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 ${
                          recording
                            ? "border-red-500/70 shadow-red-500/20"
                            : "border-gray-700/50 hover:border-purple-500/50"
                        }`}
          >
            <input
              type="text"
              placeholder={
                recording ? "Recording in progress..." : "Type your question..."
              }
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={recording || loading}
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-base disabled:opacity-50"
            />

            {/* Recording Duration Display */}
            {recording && (
              <div className="flex items-center gap-2 text-red-400 text-sm font-mono">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {formatDuration(recordingDuration)}
              </div>
            )}

            {/* Send Text Button */}
            <button
              onClick={sendTextQuestion}
              disabled={recording || loading || !question.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 
                         px-4 py-3 rounded-xl transition-all duration-300 text-lg shadow-lg shadow-blue-500/20
                         disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            >
              <FaPaperPlane />
            </button>

            {/* Mic Button */}
            {!recording ? (
              <button
                onClick={startRecording}
                disabled={loading}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 
                           px-4 py-3 rounded-xl transition-all duration-300 text-lg shadow-lg shadow-red-500/20
                           disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                <FaMicrophone />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-3 rounded-xl transition-all duration-300 text-lg
                           animate-pulse hover:scale-105 active:scale-95"
              >
                <FaStop />
              </button>
            )}
          </div>

          {/* Secondary Actions Row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Upload Voice File */}
            <label
              className="bg-[#1C2431] hover:bg-[#252d40] px-4 py-2.5 rounded-xl cursor-pointer 
                              flex items-center gap-2 border border-gray-700/50 hover:border-purple-500/50
                              transition-all duration-300 text-sm text-gray-300 hover:text-white"
            >
              <FaUpload />
              <span>Upload Audio File</span>
              <input
                type="file"
                accept="audio/*"
                onChange={uploadSelectedVoice}
                disabled={recording || loading}
                className="hidden"
              />
            </label>

            {/* Clear Response Button */}
            {(response || audioResponse) && (
              <button
                onClick={() => {
                  setResponse("");
                  setAudioResponse(null);
                  setAudioToSend(null);
                }}
                className="px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white
                           bg-[#1C2431] border border-gray-700/50 hover:border-red-500/50
                           transition-all duration-300 flex items-center gap-2"
              >
                <FaTimes />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Uploaded Audio Preview */}
        {audioToSend && (
          <div className="bg-[#101726]/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/40">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <FaMicrophone className="text-purple-400" />
                Your Recording Preview
              </p>
              <button
                onClick={() => setAudioToSend(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <FaTimes size={14} />
              </button>
            </div>
            <AudioPlayer
              src={URL.createObjectURL(audioToSend)}
              title="Your Recording"
            />
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-2 p-4 rounded-xl bg-[#1C2431]/50 border border-gray-700/30">
          <p className="text-gray-500 text-xs text-center">
            💡 <span className="text-gray-400">Tip:</span> Press Enter to send
            your message, or click the microphone to record a voice question!
          </p>
        </div>
      </div>

      {/* CSS for gradient animation */}
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

export default Ask;
