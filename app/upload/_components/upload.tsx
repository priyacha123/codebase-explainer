"use client";
import { FileUpload } from "@/components/ui/file-upload";
import React, { useState } from "react";

export function FileUploadComponent() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-gray-400 dark:bg-gray-700 border-neutral-300 dark:border-neutral-600 rounded-xl p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto">
        <FileUpload onChange={handleFileUpload} />
      </div>
    </div>
  );
}
