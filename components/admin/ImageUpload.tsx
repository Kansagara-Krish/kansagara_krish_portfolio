"use client";

import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/upload/route";

const UploadButton = generateUploadButton<OurFileRouter>();

export function ImageUpload({ onUploaded }: { onUploaded: (url: string) => void }) {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(files) => {
        const file = files.at(0);
        if (file?.url) onUploaded(file.url);
      }}
      onUploadError={(error: Error) => {
        window.alert(error.message);
      }}
      appearance={{
        button: "h-10 rounded-[6px] bg-primary px-4 text-sm font-medium text-white",
        container: "items-start"
      }}
    />
  );
}
