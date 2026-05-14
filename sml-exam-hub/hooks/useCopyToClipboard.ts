"use client";

import { useState, useCallback } from "react";

export function useCopyToClipboard(timeout = 2000) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string, id: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), timeout);
      } catch {
        // Fallback for older browsers
        const el = document.createElement("textarea");
        el.value = text;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), timeout);
      }
    },
    [timeout]
  );

  return { copy, copiedId };
}
