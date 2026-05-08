"use client";

import { useEffect } from "react";

export function CopyCodeButtons() {
  useEffect(() => {
    const blocks = document.querySelectorAll(".prose-content pre");
    blocks.forEach((block) => {
      if (block.querySelector("button")) return;
      const button = document.createElement("button");
      button.textContent = "Copy";
      button.className = "absolute right-3 top-3 rounded bg-white/10 px-2 py-1 text-xs text-white";
      button.addEventListener("click", async () => {
        await navigator.clipboard.writeText(block.textContent ?? "");
        button.textContent = "Copied";
        window.setTimeout(() => {
          button.textContent = "Copy";
        }, 1200);
      });
      block.appendChild(button);
    });
  }, []);

  return null;
}
