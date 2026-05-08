"use client";

import { useEffect } from "react";

export function ViewTracker({ path }: { path: string }) {
  useEffect(() => {
    void fetch(path, { method: "PATCH" });
  }, [path]);

  return null;
}
