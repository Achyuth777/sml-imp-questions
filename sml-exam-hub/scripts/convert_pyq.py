#!/usr/bin/env python3
"""
SML Exam Hub — PYQ ZIP to JSON Converter
=========================================
Usage:
    python3 scripts/convert_pyq.py --input "Question paper/" --output data/pyq.json

Requirements:
    pip install python-docx
"""

import argparse
import json
import os
import re
import zipfile
from pathlib import Path
from typing import Optional

try:
    from docx import Document
except ImportError:
    print("Install python-docx: pip install python-docx")
    raise


# ─── Helpers ──────────────────────────────────────────────────────────────────

def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def extract_docx_text(path: str) -> list[str]:
    """Extract paragraphs from a .docx file."""
    doc = Document(path)
    return [p.text.strip() for p in doc.paragraphs if p.text.strip()]


def detect_exam_meta(filename: str) -> dict:
    """Infer exam name, set, and year from filename."""
    name = os.path.basename(filename).upper()
    exam = "CT1"
    if "CT2" in name:
        exam = "CT2"
    elif "CT3" in name:
        exam = "CT3"

    set_num = "1"
    if "SET 2" in name:
        set_num = "2"
    elif "SET 3" in name:
        set_num = "3"

    return {
        "id": f"pyq-{exam.lower()}-set{set_num}",
        "exam": f"{exam} - Set {set_num}",
        "year": "2024-25",
        "totalMarks": 20,
        "duration": "1 hour",
    }


def parse_mcq_block(lines: list[str], start: int) -> Optional[dict]:
    """
    Parse an MCQ block starting at `start`.
    Expected format:
        Q<n>. <question text>
        A) option
        B) option
        ...
    """
    question_line = lines[start]
    match = re.match(r"^[Qq]?(\d+)[.)]\s*(.+)", question_line)
    if not match:
        return None

    q_num = match.group(1)
    q_text = match.group(2).strip()

    # Collect options
    options = []
    i = start + 1
    while i < len(lines):
        opt_match = re.match(r"^([A-Da-d])\s*[).]\s*(.+)", lines[i])
        if opt_match:
            options.append(f"{opt_match.group(1).upper()}) {opt_match.group(2).strip()}")
            i += 1
        else:
            break

    return {
        "qNum": q_num,
        "question": q_text,
        "options": options,
        "nextLine": i,
    }


def parse_answer_key(lines: list[str]) -> dict[str, str]:
    """
    Parse answer key file.
    Expected format: 1. A   or  1) B   or  Q1 - C
    Returns: {"1": "A) ...", "2": "B) ..."}
    """
    answers = {}
    for line in lines:
        match = re.match(r"[Qq]?(\d+)\s*[.):\-]\s*([A-Da-d])", line)
        if match:
            answers[match.group(1)] = match.group(2).upper()
    return answers


def convert_paper(docx_path: str, answer_key: dict[str, str]) -> dict:
    """Convert a single question paper docx to JSON format."""
    meta = detect_exam_meta(docx_path)
    lines = extract_docx_text(docx_path)

    questions = []
    i = 0
    q_counter = 0

    while i < len(lines):
        parsed = parse_mcq_block(lines, i)
        if parsed:
            q_counter += 1
            q_num = parsed["qNum"]
            ans_letter = answer_key.get(q_num, "")
            ans_text = next(
                (opt for opt in parsed["options"] if opt.startswith(ans_letter)),
                ans_letter
            )

            questions.append({
                "id": f"{meta['id']}-q{q_num}",
                "question": parsed["question"],
                "options": parsed["options"],
                "answer": ans_text,
                "marks": 1,
                "co": 1,
                "bl": 1,
                "unit": "Unit 1",          # ← update manually or auto-detect
                "tags": ["MCQ"],
            })
            i = parsed["nextLine"]
        else:
            i += 1

    return {**meta, "questions": questions}


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Convert PYQ docs to JSON")
    parser.add_argument("--input", default="Question paper/", help="Folder with .docx files")
    parser.add_argument("--answer-key", default=None, help="Path to ANSWER KEY.docx")
    parser.add_argument("--output", default="data/pyq.json", help="Output JSON path")
    args = parser.parse_args()

    folder = Path(args.input)
    if not folder.exists():
        print(f"❌ Folder not found: {folder}")
        return

    # Load answer key
    answer_key = {}
    key_path = args.answer_key or str(folder / "ANSWER KEY.docx")
    if Path(key_path).exists():
        key_lines = extract_docx_text(key_path)
        answer_key = parse_answer_key(key_lines)
        print(f"✅ Loaded {len(answer_key)} answers from key")
    else:
        print(f"⚠️  No answer key found at {key_path} — answers will be empty")

    # Process each .docx (skip answer key)
    papers = []
    for docx_file in sorted(folder.glob("*.doc*")):
        if "ANSWER" in docx_file.name.upper():
            continue
        print(f"📄 Processing: {docx_file.name}")
        try:
            paper = convert_paper(str(docx_file), answer_key)
            papers.append(paper)
            print(f"   → {len(paper['questions'])} questions parsed")
        except Exception as e:
            print(f"   ❌ Error: {e}")

    # Write output
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(papers, indent=2, ensure_ascii=False))
    print(f"\n✅ Written {len(papers)} papers to {out}")
    print("""
Next steps:
  1. Open data/pyq.json
  2. Manually set "unit" for each question (Unit 1, Unit 2, etc.)
  3. Add "tags" like ["important", "repeated"] as needed
  4. Run `npm run dev` and refresh the app
""")


if __name__ == "__main__":
    main()
