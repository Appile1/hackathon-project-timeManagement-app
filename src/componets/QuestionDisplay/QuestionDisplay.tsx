"use client";

import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuestionDisplayProps {
  questions: Question[];
}

export default function QuestionDisplay({ questions }: QuestionDisplayProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    new Array(questions.length).fill("")
  );
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <div key={index} className="p-4 border rounded-lg shadow-md bg-white">
          <h3 className="text-lg font-semibold">{question.question}</h3>
          <div className="mt-2">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center mb-2">
                <input
                  type="radio"
                  value={option}
                  id={`q${index}-o${optionIndex}`}
                  checked={selectedAnswers[index] === option}
                  onChange={() => handleAnswerChange(index, option)}
                  className="mr-2 h-4 w-4 border-gray-300 focus:ring-blue-500"
                />
                <label
                  htmlFor={`q${index}-o${optionIndex}`}
                  className="text-gray-700"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
          {showResults && (
            <div className="mt-2">
              {selectedAnswers[index] === question.correctAnswer ? (
                <p className="text-green-600">Correct!</p>
              ) : (
                <p className="text-red-600">
                  Incorrect. The correct answer is: {question.correctAnswer}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
      {!showResults && (
        <button
          onClick={handleSubmit}
          disabled={selectedAnswers.some((answer) => answer === "")}
          className={`mt-4 w-full py-2 text-white rounded-md focus:outline-none ${
            selectedAnswers.some((answer) => answer === "")
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Submit Answers
        </button>
      )}
    </div>
  );
}
