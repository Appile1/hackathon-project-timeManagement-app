"use client";

import { useState } from "react";
import FileUpload from "../../componets/FileUpload/FileUpload";
import QuestionDisplay from "../../componets/QuestionDisplay/QuestionDisplay";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTextExtracted = async (text: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const { questions } = await response.json();
        setQuestions(questions);
      } else {
        console.error("Failed to generate questions");
      }
    } catch (error) {
      console.error("Error generating questions:", error);
    }
    setIsLoading(false);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Test Generator</h1>
      <FileUpload onTextExtracted={handleTextExtracted} />
      {isLoading && <p className="mt-4">Generating questions...</p>}
      {questions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Generated Questions</h2>
          <QuestionDisplay questions={questions} />
        </div>
      )}
    </main>
  );
}
