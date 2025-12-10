import React, { useState, useRef } from "react";
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
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// Audio Player Component
const AudioPlayer = ({ src, onClose }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  const formatTime = (t) =>
    `${Math.floor(t / 60)}:${Math.floor(t % 60)
      .toString()
      .padStart(2, "0")}`;

  return (
    <div className="bg-gradient-to-br from-[#1a1f35] to-[#252b45] p-5 rounded-2xl border border-purple-500/30">
      <audio
        ref={audioRef}
        src={src}
        autoPlay
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <FaTimes />
        </button>
      )}

      <p className="text-center text-purple-300 text-sm mb-3">
        🔊 Voice Response
      </p>

      {/* Progress */}
      <div
        className="h-2 bg-gray-700 rounded-full cursor-pointer mb-2"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          audioRef.current.currentTime =
            ((e.clientX - rect.left) / rect.width) * duration;
        }}
      >
        <div
          className="h-full bg-purple-500 rounded-full"
          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400 mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            audioRef.current.volume = isMuted ? volume : 0;
          }}
          className="text-gray-400 hover:text-white"
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>

        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500"
        >
          {isPlaying ? (
            <FaPause className="text-white" />
          ) : (
            <FaPlay className="text-white ml-1" />
          )}
        </button>
      </div>
    </div>
  );
};

// Main Component
const Ask = () => {
  const [question, setQuestion] = useState("");
  const [recording, setRecording] = useState(false);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [responseFormat, setResponseFormat] = useState("text");
  const [audioResponse, setAudioResponse] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingIntervalRef = useRef(null);

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://robot.campus-navigator-cui-swl.online";

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setRecording(true);
      setRecordingDuration(0);

      recordingIntervalRef.current = setInterval(
        () => setRecordingDuration((p) => p + 1),
        1000
      );
      mediaRecorder.ondataavailable = (e) =>
        audioChunksRef.current.push(e.data);
    } catch {
      setError("Microphone permission denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    clearInterval(recordingIntervalRef.current);

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      sendToBackend(blob, true);
    };
  };

  const sendToBackend = async (data, isAudio = false) => {
    setLoading(true);
    setResponse("");
    setError("");
    setAudioResponse(null);

    const formData = new FormData();
    if (isAudio) formData.append("audio", data, "recording.webm");
    else formData.append("text", data);
    formData.append("response_format", responseFormat);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error("Server error");

      if (responseFormat === "audio") {
        const blob = await res.blob();
        setAudioResponse(URL.createObjectURL(blob));
      } else {
        const json = await res.json();
        setResponse(json.answer || "No response");
      }

      if (!isAudio) setQuestion("");
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timed out. Backend may be offline.");
      } else {
        setError("Could not connect to server. Is it running?");
      }
    }

    setLoading(false);
  };

  const handleSubmit = () => {
    if (question.trim()) sendToBackend(question);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1F] text-white px-4 py-8">
      {/* Background */}
      <div className="fixed top-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-600/30 rounded-full blur-[140px]" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[140px]" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm"
        >
          <FaArrowLeft /> Back
        </Link>

        <div className="text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Campus Assistant
          </h1>
          <p className="text-gray-400 mt-2">
            Ask anything about COMSATS Sahiwal 🎓
          </p>
        </div>

        {/* Response Format Toggle */}
        <div className="flex justify-center gap-3">
          {["text", "audio"].map((f) => (
            <button
              key={f}
              onClick={() => setResponseFormat(f)}
              className={`px-5 py-2 rounded-xl transition ${
                responseFormat === f
                  ? "bg-purple-600 text-white"
                  : "bg-[#1C2431] text-gray-400 hover:text-white"
              }`}
            >
              {f === "text" ? "📝 Text" : "🔊 Voice"}
            </button>
          ))}
        </div>

        {/* Response Box */}
        <div className="bg-[#101726] p-6 rounded-2xl border border-slate-700/40 min-h-[100px]">
          {loading ? (
            <div className="flex items-center gap-3 text-blue-400">
              <FaSpinner className="animate-spin" /> Processing...
            </div>
          ) : error ? (
            <div className="text-red-400">⚠️ {error}</div>
          ) : response ? (
            <p className="text-gray-200">{response}</p>
          ) : (
            <p className="text-gray-500 text-center">
              Ask something to get started...
            </p>
          )}
        </div>

        {/* Audio Response */}
        {audioResponse && (
          <AudioPlayer
            src={audioResponse}
            onClose={() => setAudioResponse(null)}
          />
        )}

        {/* Input */}
        <div className="flex flex-col gap-2 ">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={recording ? "Recording..." : "Type your question..."}
            disabled={recording || loading}
            className="bg-[#1C2431]  text-white placeholder-gray-500 outline-none p-3 rounded-2xl border border-gray-700/50"
          />

          <div className="flex items-center gap-2 justify-center">
            {recording && (
              <span className="text-red-400 text-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {Math.floor(recordingDuration / 60)}:
                {(recordingDuration % 60).toString().padStart(2, "0")}
              </span>
            )}

            <button
              onClick={handleSubmit}
              disabled={!question.trim() || loading || recording}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl disabled:opacity-40"
            >
              <FaPaperPlane />
            </button>

            {!recording ? (
              <button
                onClick={startRecording}
                disabled={loading}
                className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl disabled:opacity-40"
              >
                <FaMicrophone />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-xl"
              >
                <FaStop />
              </button>
            )}
          </div>
        </div>

        {/* Upload */}
        <label className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm cursor-pointer">
          <FaUpload /> Upload audio file
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) =>
              e.target.files[0] && sendToBackend(e.target.files[0], true)
            }
            disabled={loading}
          />
        </label>
      </div>
    </div>
  );
};

export default Ask;
