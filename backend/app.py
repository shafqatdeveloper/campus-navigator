"""
Flask API - REST Endpoints for Q&A System
"""
import os
import traceback
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

from config import UPLOAD_FOLDER
from qa_engine import qa_engine

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "kb_size": len(qa_engine.knowledge_base)
    })


@app.route('/ask', methods=['POST'])
def ask_question():
    try:
        response_format = request.form.get('response_format', 'text')
        
        # Get question from text or audio
        if 'text' in request.form:
            query = request.form['text']
        elif 'audio' in request.files:
            audio_file = request.files['audio']
            if not qa_engine.allowed_file(audio_file.filename):
                return jsonify({"error": "Invalid audio format"}), 400
            
            filename = secure_filename(audio_file.filename)
            audio_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            audio_file.save(audio_path)
            
            query = qa_engine.transcribe_audio(audio_path)
            if os.path.exists(audio_path):
                os.remove(audio_path)
            
            if not query:
                return jsonify({"error": "Could not understand audio"}), 400
        else:
            return jsonify({"error": "No text or audio provided"}), 400
        
        print(f"\n💬 Question: {query}")
        
        # Get answer
        answer, source = qa_engine.get_answer(query)
        print(f"📝 Answer ({source}): {answer[:100]}...")
        
        # Return in requested format
        if response_format == 'audio':
            audio_file = qa_engine.generate_speech(answer)
            if audio_file and os.path.exists(audio_file):
                return send_file(audio_file, mimetype='audio/wav')
            else:
                return jsonify({"error": "TTS failed"}), 500
        else:
            return jsonify({
                "answer": answer,
                "source": source,
                "format": "text"
            })
    
    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route('/navigate', methods=['POST'])
def navigate():
    try:
        data = request.json
        destination = data.get('destination')
        if not destination:
            return jsonify({"error": "No destination"}), 400
        
        print(f"🧭 Navigating to: {destination}")
        return jsonify({
            "status": "success",
            "message": f"Navigating to {destination}"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    if not qa_engine.initialize():
        print("❌ Failed to initialize. Exiting.")
        exit(1)
    
    print("\n🚀 Server: http://0.0.0.0:5000")
    print("Endpoints: GET /health, POST /ask, POST /navigate\n")
    
    app.run(host='0.0.0.0', port=5000, debug=False)
