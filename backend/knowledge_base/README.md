# Knowledge Base Directory

This directory contains the academic knowledge base for the QA system.

## Files:

- `faqs.json` - Frequently asked questions
- `faculty.json` - Faculty directory
- `faqs.index` - FAISS vector index (auto-generated)
- `documents.pkl` - Serialized documents (auto-generated)

## Adding New Data:

### FAQs

Edit `faqs.json` and add entries:

```json
{
  "id": "faq_016",
  "category": "General",
  "question": "Your question here",
  "answer": "Your answer here",
  "keywords": ["key", "words"]
}
```

### Faculty

Edit `faculty.json`:

```json
{
  "name": "Dr. Name",
  "title": "Professor",
  "department": "Computer Science",
  "office": "Room Number",
  "email": "email@university.edu.pk",
  "specialization": "Field of study"
}
```

After editing, rerun the indexing script:

```bash
python build_qa_index.py
```
