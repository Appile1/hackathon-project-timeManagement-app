"use client";

import { useState } from "react";

interface FileUploadProps {
  onTextExtracted: (text: string) => void;
}

export default function FileUpload({ onTextExtracted }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/extract-text", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const { text } = await response.json();
          onTextExtracted(text);
        } else {
          console.error("Failed to extract text from PDF");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else if (text) {
      onTextExtracted(text);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <div>
        <textarea
          placeholder="Or enter text here..."
          value={text}
          onChange={handleTextChange}
          rows={5}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || (!file && !text)}
        className={`w-full py-2 px-4 font-semibold text-white rounded-md focus:outline-none ${
          isLoading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? "Processing..." : "Generate Questions"}
      </button>
    </form>
  );
}
