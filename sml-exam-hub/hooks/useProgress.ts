"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProgressState } from "@/types";
import { getAllQuestions } from "@/lib/dataLoader";

const STORAGE_KEY = "sml-hub-progress";

function loadFromStorage(): ProgressState {
  if (typeof window === "undefined")
    return { completed: {}, lastVisited: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: {}, lastVisited: null };
    return JSON.parse(raw) as ProgressState;
  } catch {
    return { completed: {}, lastVisited: null };
  }
}

function saveToStorage(state: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage quota exceeded or private browsing
  }
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>({
    completed: {},
    lastVisited: null,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setState(loadFromStorage());
    setMounted(true);
  }, []);

  const toggle = useCallback((questionId: string) => {
    setState((prev) => {
      const next: ProgressState = {
        ...prev,
        completed: {
          ...prev.completed,
          [questionId]: !prev.completed[questionId],
        },
      };
      saveToStorage(next);
      return next;
    });
  }, []);

  const markVisited = useCallback((sectionId: string) => {
    setState((prev) => {
      const next = { ...prev, lastVisited: sectionId };
      saveToStorage(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const next: ProgressState = { completed: {}, lastVisited: null };
    saveToStorage(next);
    setState(next);
  }, []);

  const isCompleted = useCallback(
    (questionId: string) => !!state.completed[questionId],
    [state]
  );

  // Progress percentage across all questions
  const totalQuestions = getAllQuestions().length;
  const completedCount = Object.values(state.completed).filter(Boolean).length;
  const percentage =
    totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;

  return {
    mounted,
    toggle,
    markVisited,
    reset,
    isCompleted,
    completedCount,
    totalQuestions,
    percentage,
    lastVisited: state.lastVisited,
  };
}
