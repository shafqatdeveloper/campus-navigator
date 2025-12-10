# -------------------------------------------------------
# CONFIG
# -------------------------------------------------------
import os

MODEL_PATH = os.path.expanduser("~/.llama_models/tinyllama-1.1b-chat-v0.3.Q4_K_M.gguf")
LLM_CTX = 2048
LLM_MAX_TOKENS = 1000
LLM_TEMPERATURE = 0.1
FAISS_L2_THRESHOLD = 0.8

EMBED_MODEL = "all-MiniLM-L6-v2"
KB_PATH = "knowledge_base.json"
FAISS_PATH = "vector.index"
TTS_MODEL = os.path.expanduser("~/tts_models/en_US-libritts-high.onnx")

UPLOAD_FOLDER = "/tmp/robot_uploads"
ALLOWED_AUDIO_EXTENSIONS = {'mp3', 'wav', 'ogg', 'webm', 'm4a', 'flac'}
