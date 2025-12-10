# Campus Navigator - Offline Question Answering System

## 🎯 Overview

This QA system uses **offline NLP** with:

- **Sentence-BERT** (all-MiniLM-L6-v2) for semantic embeddings
- **FAISS** for fast vector similarity search
- **No internet required** after initial model download

## 📦 Installation

```bash
cd backend
pip install -r requirements_qa.txt
```

**First time:** The sentence transformer model (~90MB) will download automatically.

## 🔨 Build the Index

Before running the API, build the FAISS index:

```bash
python build_qa_index.py
```

This will:

1. Load knowledge base files (FAQs, faculty)
2. Generate embeddings for all documents
3. Build FAISS index
4. Save to `knowledge_base/faiss.index`

## 🚀 Usage

### Start the API Server

```bash
python app.py
```

The QA engine initializes in the background. Check status:

```bash
curl http://localhost:5000/health
```

Response:

```json
{
  "status": "ok",
  "service": "Campus Navigator Robot API",
  "qa_initialized": true
}
```

### Ask Questions (API)

**Text Question:**

```bash
curl -X POST http://localhost:5000/ask/text \
  -H "Content-Type: application/json" \
  -d '{"question": "Where is the CS Lab?"}'
```

Response:

```json
{
  "answer": "The CS Lab is located on the first floor...",
  "confidence": 0.87,
  "source": {
    "type": "faq",
    "category": "Rooms",
    "id": "faq_003"
  }
}
```

### Use the Frontend

1. Start backend: `python app.py`
2. Start frontend: `npm run dev`
3. Navigate to "Ask" page
4. Type your question and hit send!

## 📊 Knowledge Base Structure

```
knowledge_base/
├── faqs.json          # Question-answer pairs
├── faculty.json       # Faculty directory
├── faqs.index         # FAISS index (auto-generated)
└── documents.pkl      # Document embeddings (auto-generated)
```

## ➕ Adding New Knowledge

### Add FAQ

Edit `knowledge_base/faqs.json`:

```json
{
  "id": "faq_new",
  "category": "General",
  "question": "Your question",
  "answer": "Your answer",
  "keywords": ["keywords"]
}
```

### Add Faculty Member

Edit `knowledge_base/faculty.json`:

```json
{
  "name": "Dr. Name",
  "title": "Professor",
  "department": "Computer Science",
  "office": "Room",
  "email": "email@university.edu",
  "specialization": "Field"
}
```

**Rebuild index after changes:**

```bash
python build_qa_index.py
```

## 🧪 Testing

Test the QA engine directly:

```python
from qa_engine import qa_engine

# Initialize
qa_engine.initialize()

# Ask a question
result = qa_engine.answer_question("Who teaches Data Structures?")
print(result['answer'])
print(f"Confidence: {result['confidence']}")
```

## 🔍 How It Works

1. **Indexing** (build time):

   - Load all documents from knowledge base
   - Generate 384-dim embeddings using SentenceTransformer
   - Build FAISS index for fast similarity search

2. **Query** (runtime):

   - User asks question
   - Embed question using same model
   - Search FAISS index for top-k most similar documents
   - Return answer from best match

3. **Confidence Score**:
   - Based on L2 distance in embedding space
   - Lower distance = higher confidence
   - Threshold: 0.3 (below this, returns "not sure")

## 🎓 Example Questions

- "Where is the CS Lab?"
- "Who teaches Data Structures?"
- "Where can I pay my fees?"
- "What are the library hours?"
- "Who is the head of Computer Science?"
- "Where is Professor Sara Ali's office?"

## 🔧 Customization

### Change Embedding Model

Edit `qa_engine.py`:

```python
self.model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')  # Multilingual
```

### Adjust Confidence Threshold

Edit `qa_engine.py` in `answer_question()`:

```python
if confidence < 0.5:  # Stricter threshold
    return {...}
```

## 📈 Performance

- **Index build time**: ~10 seconds (15 documents)
- **Query time**: ~50ms per question
- **Model size**: 90MB (cached after first download)
- **Index size**: ~1MB (for 15 documents)

## 🚀 Production Deployment

For Raspberry Pi:

1. **Build index on development machine** (faster)
2. **Copy to Pi**:
   ```bash
   scp -r knowledge_base/ pi@raspberrypi:/path/to/backend/
   ```
3. **Install dependencies on Pi**:
   ```bash
   pip3 install -r requirements_qa.txt
   ```
4. **Run**:
   ```bash
   python3 app.py
   ```

## 🌐 Offline Operation

After first run, the system is **100% offline**:

- ✅ Model cached locally
- ✅ Index stored on disk
- ✅ No API calls
- ✅ No internet needed

Perfect for campus deployment!
