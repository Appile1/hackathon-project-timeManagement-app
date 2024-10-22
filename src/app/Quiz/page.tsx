"use client";

import { useState } from "react";
import { UploadCloud, FileText, CheckCircle } from "lucide-react";

export default function TestGenerator() {
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState("medium");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a PDF file.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Test Generator
          </h1>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload PDF
              </label>
              <div className="relative">
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                  className="w-full py-4 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {file ? (
                    <div className="flex items-center justify-center">
                      <FileText className="w-5 h-5 mr-2" />
                      <span className="truncate max-w-xs">{file.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <UploadCloud className="w-5 h-5 mr-2" />
                      <span>Click to upload PDF</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="input-text"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Or paste your text here
              </label>
              <textarea
                id="input-text"
                placeholder="Enter your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-shadow duration-300"
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Select Difficulty
              </span>
              <div className="flex space-x-4">
                {["easy", "medium", "hard"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
                      difficulty === level
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-4 bg-gray-50">
          <button className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Generate Test
          </button>
        </div>
      </div>
    </div>
  );
}
