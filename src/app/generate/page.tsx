"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Header from "../../componets/header/header.js";
import Footer from "../../componets/footer/footer.js";

interface Flashcard {
  id: string;
  cardFront: string;
  cardBack: string;
}

export default function ChatArea() {
  const [inputValue, setInputValue] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { user } = useUser();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const systemPrompt = `Create 9 flashcards based on the following text, focusing on the most important concepts, definitions, and questions. Each flashcard should be formatted as an object in a JSON array with the following properties:

  id: A unique identifier for the card (e.g., card1, card2, etc.).
  cardFront: A concise, clear question, term, or concept. This should be something that prompts the learner to recall key information.
  cardBack: A detailed explanation, definition, or answer that directly addresses the content on the front of the card. Ensure the explanation is clear, accurate, and provides any necessary context or examples.
  Guidelines for creating the best flashcards:

  Focus on key concepts and terms that are essential for understanding the topic.
  Ensure questions are direct and encourage active recall.
  Provide concise yet comprehensive answers or explanations on the back.
  Include examples or additional context if it helps clarify the concept.
  Avoid overly complex or ambiguous wording; aim for clarity and simplicity.
  Please generate the flashcards in the JSON array format with no additional text.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/chatai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              { role: "user", content: inputValue },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const parsedData = JSON.parse(data.message);
        setFlashcards(parsedData);
        setFlippedCards({});
      } catch (error) {
        setError("Failed to generate flashcards. Please try again.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }

      setInputValue("");
    }
  };

  const handleCardFlip = (cardId: string) => {
    setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
            Generate Flashcards
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Enter text to generate flashcards with key concepts and definitions.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px] resize-y transition-all duration-300 ease-in-out"
            />
            <div className="flex justify-center">
              <button
                type="submit"
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="inline-block mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Flashcards"
                )}
              </button>
            </div>
          </form>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {flashcards.length > 0 && (
            <div className="mt-12  cursor-pointer">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Generated Flashcards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcards.map((card) => (
                  <div
                    key={card.id}
                    className="relative h-64 w-full perspective"
                    onClick={() => handleCardFlip(card.id)}
                  >
                    <div
                      className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out preserve-3d ${
                        flippedCards[card.id] ? "rotate-y-180" : ""
                      }`}
                    >
                      <div className="absolute inset-0 w-full h-full bg-white rounded-lg shadow-lg p-6 flex items-center justify-center backface-hidden">
                        <h3 className="text-xl font-semibold text-gray-800 text-center">
                          {card.cardFront}
                        </h3>
                      </div>
                      <div className="absolute inset-0 w-full h-full bg-blue-100 rounded-lg shadow-lg p-6 flex items-center justify-center backface-hidden rotate-y-180">
                        <p className="text-gray-700 text-center">
                          {card.cardBack}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
