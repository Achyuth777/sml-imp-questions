// ─── Question Types ───────────────────────────────────────────────────────────

export type QuestionType = "2-mark" | "5-mark" | "10-mark";

export type QuestionTag =
  | "important"
  | "repeated"
  | "easy"
  | "tricky"
  | "10-mark"
  | "MCQ";

export interface Question {
  id: string;
  question: string;
  answer: string;
  type: QuestionType;
  year: string;
  tags: QuestionTag[];
  answer_key?: string;
  options?: string[];
  marks?: number;
  co?: number;
  bl?: number;
  unit?: string;
}

// ─── Unit Types ───────────────────────────────────────────────────────────────

export interface Unit {
  id: string;
  unit: string;
  title: string;
  color: string;
  topics: string[];
  summary: string;
  questions: Question[];
}

// ─── PYQ Types ────────────────────────────────────────────────────────────────

export interface PYQQuestion {
  id: string;
  question: string;
  options?: string[];
  answer: string;
  marks: number;
  co: number;
  bl: number;
  unit: string;
  tags: QuestionTag[];
}

export interface PYQPaper {
  id: string;
  exam: string;
  year: string;
  totalMarks: number;
  duration: string;
  questions: PYQQuestion[];
}

// ─── Cheat Sheet Types ────────────────────────────────────────────────────────

export interface CheatSheetItem {
  label: string;
  formula: string;
  note: string;
}

export interface CheatSheet {
  id: string;
  title: string;
  unit: string;
  color: string;
  icon: string;
  items: CheatSheetItem[];
}

// ─── Overview Types ───────────────────────────────────────────────────────────

export interface ExamPattern {
  name: string;
  marks: number;
  units: string;
}

export interface Overview {
  subject: string;
  code: string;
  semester: string;
  department: string;
  university: string;
  description: string;
  totalUnits: number;
  examPattern: Record<string, ExamPattern>;
  importantTopics: string[];
  references: string[];
}

// ─── Progress Types ───────────────────────────────────────────────────────────

export interface ProgressState {
  completed: Record<string, boolean>; // questionId → true
  lastVisited: string | null;
}

// ─── Search Types ─────────────────────────────────────────────────────────────

export interface SearchResult {
  question: Question;
  unitId: string;
  unitTitle: string;
  score: number;
}

// ─── Filter Types ─────────────────────────────────────────────────────────────

export interface FilterState {
  types: QuestionType[];
  tags: QuestionTag[];
  units: string[];
  revisionMode: boolean;
}
