"""
Script to build/rebuild the FAISS index for QA system
Run this after updating knowledge base files
"""
from qa_engine import OfflineQAEngine

print("🔧 Building QA Index...")
print("=" * 60)

engine = OfflineQAEngine()
engine.initialize()

print("\n✅ Index built successfully!")
print(f"Total documents indexed: {len(engine.documents)}")
print("\nTesting with sample questions:")
print("-" * 60)

sample_questions = [
    "Where is the CS Lab?",
    "Who teaches Data Structures?",
    "Where can I pay fees?",
    "What are library hours?"
]

for q in sample_questions:
    result = engine.answer_question(q)
    print(f"\nQ: {q}")
    print(f"A: {result['answer']}")
    print(f"Confidence: {result['confidence']}")

print("\n" + "=" * 60)
print("Done! The index is ready for use.")
