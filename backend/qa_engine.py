"""
QA Engine - Handles Knowledge Base, FAISS Search, LLM, and TTS
"""
import os
import json
import subprocess
import traceback

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from llama_cpp import Llama
import speech_recognition as sr
from pydub import AudioSegment

from config import (
    MODEL_PATH, LLM_CTX, LLM_MAX_TOKENS, LLM_TEMPERATURE,
    FAISS_L2_THRESHOLD, EMBED_MODEL, KB_PATH, FAISS_PATH,
    TTS_MODEL, UPLOAD_FOLDER, ALLOWED_AUDIO_EXTENSIONS
)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


class QAEngine:
    def __init__(self):
        self.embedder = None
        self.llm = None
        self.knowledge_base = []
        self.faiss_index = None
    
    def initialize(self):
        try:
            print("=" * 60)
            print("INITIALIZING Q&A ENGINE")
            print("=" * 60)
            
            print("\n[1/4] Loading Sentence Transformer...")
            self.embedder = SentenceTransformer(EMBED_MODEL)
            print("✅ Embedding model loaded")
            
            print("\n[2/4] Loading Knowledge Base...")
            self.knowledge_base = self._load_kb()
            print(f"✅ Loaded {len(self.knowledge_base)} Q&A pairs")
            
            print("\n[3/4] Building FAISS Index...")
            self.faiss_index = self._build_faiss_index()
            print("✅ FAISS index ready")
            
            print("\n[4/4] Loading TinyLlama Model...")
            if not os.path.exists(MODEL_PATH):
                print(f"❌ ERROR: Model not found at {MODEL_PATH}")
                return False
            
            self.llm = Llama(model_path=MODEL_PATH, n_ctx=LLM_CTX, n_threads=4, verbose=False)
            print("✅ LLaMA model loaded")
            
            print("\n" + "=" * 60)
            print("🤖 Q&A ENGINE READY!")
            print(f"📊 KB Size: {len(self.knowledge_base)} | Threshold: {FAISS_L2_THRESHOLD}")
            print("=" * 60)
            return True
            
        except Exception as e:
            print(f"\n❌ INIT FAILED: {str(e)}")
            traceback.print_exc()
            return False
    
    def _load_kb(self):
        if not os.path.exists(KB_PATH):
            default = [{"question": "What is your name?", "answer": "I am the campus assistant."}]
            with open(KB_PATH, "w", encoding="utf-8") as f:
                json.dump(default, f, indent=2)
            return default
        
        with open(KB_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    
    def _build_faiss_index(self):
        if len(self.knowledge_base) == 0:
            return faiss.IndexFlatL2(384)
        
        if os.path.exists(FAISS_PATH):
            print("Loading existing index...")
            return faiss.read_index(FAISS_PATH)
        
        print("Building new index...")
        vectors = self.embedder.encode([item["question"] for item in self.knowledge_base])
        vectors = np.array(vectors).astype("float32")
        
        index = faiss.IndexFlatL2(vectors.shape[1])
        index.add(vectors)
        faiss.write_index(index, FAISS_PATH)
        return index
    
    def search_kb(self, query):
        if len(self.knowledge_base) == 0:
            return None, None
        
        try:
            query_vec = self.embedder.encode([query]).astype("float32")
            distances, indexes = self.faiss_index.search(query_vec, 3)
            
            best_idx = indexes[0][0]
            best_dist = distances[0][0]
            
            print(f"\n🔍 Search: '{query}'")
            for i in range(min(3, len(indexes[0]))):
                idx = indexes[0][i]
                dist = distances[0][i]
                q = self.knowledge_base[idx]["question"][:50]
                status = "✅" if dist <= FAISS_L2_THRESHOLD else "❌"
                print(f"   {i+1}. [{dist:.3f}] {status} '{q}...'")
            
            if best_dist <= FAISS_L2_THRESHOLD:
                print(f"📌 Using KB (dist={best_dist:.3f})")
                return self.knowledge_base[best_idx]["answer"], best_dist
            else:
                print(f"🤖 Using LLM (dist={best_dist:.3f} > threshold)")
                return None, best_dist
                
        except Exception as e:
            print(f"Search error: {e}")
            return None, None
    
    def generate_llm_answer(self, query):
        try:
            prompt = f"""You are a helpful AI assistant at COMSATS University Sahiwal. Answer naturally in 2-3 sentences.

Question: {query}
Answer:"""
            
            result = self.llm(
                prompt,
                max_tokens=LLM_MAX_TOKENS,
                temperature=LLM_TEMPERATURE,
                stop=["Question:", "\n\n\n"]
            )
            
            text = result["choices"][0]["text"].strip()
            return text if text and len(text) > 5 else "Could you please rephrase your question?"
            
        except Exception as e:
            print(f"LLM error: {e}")
            return "I'm having trouble processing that. Please try again."
    
    def get_answer(self, query):
        kb_answer, distance = self.search_kb(query)
        
        if kb_answer:
            return kb_answer, "knowledge_base"
        else:
            return self.generate_llm_answer(query), "llm"
    
    def generate_speech(self, text):
        try:
            output_file = os.path.join(UPLOAD_FOLDER, f"response_{os.getpid()}.wav")
            tts_cmd = ["piper", "--model", TTS_MODEL, "--output_file", output_file]
            
            p = subprocess.Popen(tts_cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            stdout, stderr = p.communicate(input=text.encode(), timeout=30)
            
            if p.returncode != 0:
                print(f"TTS error: {stderr.decode()}")
                return None
            
            return output_file if os.path.exists(output_file) else None
        except Exception as e:
            print(f"TTS error: {e}")
            return None
    
    def transcribe_audio(self, audio_path):
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
    
    @staticmethod
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_AUDIO_EXTENSIONS


# Singleton instance
qa_engine = QAEngine()
