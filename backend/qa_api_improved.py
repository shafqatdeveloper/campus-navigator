import os
import json
import subprocess
import traceback

import faiss
import numpy as np
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
from sentence_transformers import SentenceTransformer
from llama_cpp import Llama
import speech_recognition as sr
from pydub import AudioSegment

# -------------------------------------------------------
# CONFIG - IMPROVED SETTINGS
# -------------------------------------------------------
MODEL_PATH = os.path.expanduser("~/.llama_models/tinyllama-1.1b-chat-v0.3.Q4_K_M.gguf")
LLM_CTX = 2048
LLM_MAX_TOKENS = 400  # Increased for better responses
LLM_TEMPERATURE = 0.8
FAISS_L2_THRESHOLD = 0.8  # STRICTER (was 1.5) - only exact matches

EMBED_MODEL = "all-MiniLM-L6-v2"
KB_PATH = "knowledge_base.json"
FAISS_PATH = "vector.index"
TTS_MODEL = os.path.expanduser("~/tts_models/en_US-libritts-high.onnx")

UPLOAD_FOLDER = "/tmp/robot_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_AUDIO_EXTENSIONS = {'mp3', 'wav', 'ogg', 'webm', 'm4a', 'flac'}

# -------------------------------------------------------
# SYSTEM PROMPT
# -------------------------------------------------------
SYSTEM_PROMPT = """You are a helpful, friendly AI assistant for COMSATS University Sahiwal.

Guidelines:
- Be conversational and warm like ChatGPT
- Answer both campus AND general questions
- Keep responses 2-4 sentences
- For campus info you don't know, suggest visiting the office
- Be helpful with greetings, small talk, and general knowledge

Campus Info:
- COMSATS University Sahiwal, Punjab, Pakistan
- Programs: CS, Software Engineering, EE, Management
- Facilities: Library, Labs, Cafeteria, Sports Ground"""

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

embedder = None
llm = None
knowledge_base = []
faiss_index = None

def initialize_models():
    global embedder, llm, knowledge_base, faiss_index
    
    try:
        print("=" * 60)
        print("INITIALIZING IMPROVED Q&A SYSTEM")
        print("=" * 60)
        
        print("\n[1/4] Loading Sentence Transformer...")
        embedder = SentenceTransformer(EMBED_MODEL)
        print("✅ Embedding model loaded")
        
        print("\n[2/4] Loading Knowledge Base...")
        knowledge_base = load_kb()
        print(f"✅ Loaded {len(knowledge_base)} Q&A pairs")
        
        print("\n[3/4] Building FAISS Index...")
        faiss_index = build_faiss_index(knowledge_base)
        print("✅ FAISS index ready")
        
        print("\n[4/4] Loading TinyLlama Model...")
        if not os.path.exists(MODEL_PATH):
            print(f"❌ ERROR: Model not found at {MODEL_PATH}")
            return False
        
        llm = Llama(model_path=MODEL_PATH, n_ctx=LLM_CTX, n_threads=4, verbose=False)
        print("✅ LLaMA model loaded")
        
        print("\n" + "=" * 60)
        print("🤖 IMPROVED Q&A SYSTEM READY!")
        print(f"📊 Knowledge Base: {len(knowledge_base)} pairs")
        print(f"🎯 Match Threshold: {FAISS_L2_THRESHOLD} (stricter)")
        print("=" * 60)
        return True
        
    except Exception as e:
        print(f"\n❌ INIT FAILED: {str(e)}")
        traceback.print_exc()
        return False

def load_kb():
    if not os.path.exists(KB_PATH):
        default_kb = [{"question": "What is your name?", "answer": "I am the campus assistant."}]
        with open(KB_PATH, "w", encoding="utf-8") as f:
            json.dump(default_kb, f, indent=2)
        return default_kb
    
    with open(KB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def build_faiss_index(kb):
    if len(kb) == 0:
        return faiss.IndexFlatL2(384)
    
    if os.path.exists(FAISS_PATH):
        print(f"Loading existing index...")
        return faiss.read_index(FAISS_PATH)
    
    print("Building new index...")
    vectors = embedder.encode([item["question"] for item in kb])
    vectors = np.array(vectors).astype("float32")
    
    index = faiss.IndexFlatL2(vectors.shape[1])
    index.add(vectors)
    
    faiss.write_index(index, FAISS_PATH)
    return index

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_AUDIO_EXTENSIONS

def transcribe_audio(audio_path):
    try:
        recognizer = sr.Recognizer()
        audio = AudioSegment.from_file(audio_path)
        wav_path = os.path.join(UPLOAD_FOLDER, "temp.wav")
        audio.export(wav_path, format="wav")
        
        with sr.AudioFile(wav_path) as source:
            audio_data = recognizer.record(source)
        
        text = recognizer.recognize_google(audio_data)
        if os.path.exists(wav_path):
            os.remove(wav_path)
        
        return text
    except:
        return None

def search_kb(query):
    """Search with top 3 results for better visibility"""
    if len(knowledge_base) == 0:
        return None, None
    
    try:
        query_vec = embedder.encode([query]).astype("float32")
        distances, indexes = faiss_index.search(query_vec, 3)
        
        best_idx = indexes[0][0]
        best_dist = distances[0][0]
        
        print(f"\n🔍 Search results for: '{query}'")
        for i in range(min(3, len(indexes[0]))):
            idx = indexes[0][i]
            dist = distances[0][i]
            q = knowledge_base[idx]["question"][:60]
            match = "✅ MATCH" if dist <= FAISS_L2_THRESHOLD else "❌"
            print(f"   {i+1}. [{dist:.3f}] {match} - '{q}...'")
        
        if best_dist <= FAISS_L2_THRESHOLD:
            print(f"📌 Using KB answer (distance={best_dist:.3f})")
            return knowledge_base[best_idx]["answer"], best_dist
        else:
            print(f"🤖 No close match, using LLM")
            return None, best_dist
            
    except Exception as e:
        print(f"Search error: {e}")
        return None, None

def llama_answer(query):
    """Improved LLM with better prompting"""
    try:
        # TinyLlama chat format
        prompt = f"""<|system|>
{SYSTEM_PROMPT}</s>
