"use client";

import { useEffect } from "react";

export function ViewTracker({ path }: { path: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `viewed:${path}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    void fetch(path, { method: "PATCH" });
  }, [path]);

  return null;
}
