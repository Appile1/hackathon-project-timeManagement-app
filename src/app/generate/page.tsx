"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader, CheckCircle } from "lucide-react";
import { db } from "../firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import Header from "../../componets/header/header";
import Footer from "../../componets/footer/footer";
import Link from "next/link";

interface Flashcard {
  id: string;
  cardFront: string;
  cardBack: string;
}

export default function ChatArea() {
  const [inputValue, setInputValue] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { user } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [nameExists, setNameExists] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const getSystemPrompt = (difficulty: string) => {
    const basePrompt = `Create 9 flashcards based on the following text, focusing on the most important concepts, definitions, and questions. Each flashcard should be formatted as an object in a JSON array with the following properties:

    id: A unique identifier for the card (e.g., card1, card2, etc.).
    cardFront: A concise, clear question, term, or concept. This should be something that prompts the learner to recall key information.
    cardBack: A detailed explanation, definition, or answer that directly addresses the content on the front of the card. Ensure the explanation is clear, accurate, and provides any necessary context or examples.
    Guidelines for creating the best flashcards:`;

    const difficultySpecificPrompt = {
      easy: `
      - Focus on basic concepts and simple definitions.
      - Use straightforward language and avoid complex terminology.
      - Include more context and examples to aid understanding.
      - Limit the scope of each flashcard to one simple idea or fact.`,
      medium: `
      - Balance between basic and more advanced concepts.
      - Use a mix of straightforward and more specialized terminology.
      - Provide context and examples where necessary.
      - Cover broader concepts that may require understanding of multiple related ideas.`,
      hard: `
      - Focus on advanced concepts and complex relationships between ideas.
      - Use specialized terminology and expect a higher level of background knowledge.
      - Minimize additional context, expecting the user to draw from their existing knowledge.
      - Create questions that require synthesis of multiple concepts or application of knowledge to new situations.`,
    };

    return (
      basePrompt +
      difficultySpecificPrompt[
        difficulty as keyof typeof difficultySpecificPrompt
      ] +
      `
    
    Please generate the flashcards in the JSON array format with no additional text.`
    );
  };

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
                content: getSystemPrompt(difficulty),
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

  const checkFlashcardNameExists = async (name: string) => {
    if (!user) return false;
    const docRef = doc(db, `users/${user.id}/flashcards`, name);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  const handleSaveFlashcards = async () => {
    if (collectionName.trim() === "") return;
    setNameExists(false);
    setSaveSuccess(false);
    setSaving(true);
    try {
      const exists = await checkFlashcardNameExists(collectionName);
      if (exists) {
        setNameExists(true);
        setSaving(false);
        return;
      }
      const flashcardDocRef = doc(
        collection(db, `users/${user?.id}/flashcards`),
        collectionName
      );
      await setDoc(flashcardDocRef, {
        flashcards,
        difficulty,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSaveSuccess(false);
      }, 2000);
      setCollectionName("");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      setError("Failed to save flashcards. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        <Link
          href="/generate/SavedFlashCard"
          className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          View Saved Flashcards
        </Link>
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
            <div className="flex justify-center mb-4">
              <div className="flex space-x-4">
                {["easy", "medium", "hard"].map((level) => (
                  <label
                    key={level}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={level}
                      checked={difficulty === level}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="form-radio text-blue-600"
                    />
                    <span className="capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>
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
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Generated Flashcards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcards.map((card) => (
                  <div
                    key={card.id}
                    className="relative h-64 w-full perspective cursor-pointer"
                    onClick={() => handleCardFlip(card.id)}
                  >
                    <div
                      className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out preserve-3d ${
                        flippedCards[card.id] ? "rotate-y-180" : ""
                      }`}
                    >
                      <div className="absolute inset-0 w-full h-full bg-white rounded-lg shadow-lg p-4 flex flex-col justify-center items-center backface-hidden">
                        <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
                          {card.cardFront}
                        </h3>
                        <div className="text-sm text-gray-600 text-center">
                          Click to flip
                        </div>
                      </div>
                      <div className="absolute inset-0 w-full h-full bg-blue-100 rounded-lg shadow-lg p-4 flex flex-col justify-center items-center backface-hidden rotate-y-180 overflow-y-auto">
                        <p className="text-gray-700">{card.cardBack}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-8 space-x-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Save Flashcards
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Save Flashcards
            </h3>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => {
                setCollectionName(e.target.value);
                setNameExists(false);
              }}
              placeholder="Enter a collection name"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            />
            {nameExists && (
              <p className="text-red-500 text-sm mb-4">
                This name already exists. Please choose a different name.
              </p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFlashcards}
                className={`px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center ${
                  saving ? "opacity-75 cursor-not-allowed" : ""
                }`}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader className="inline-block mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-out">
          <CheckCircle className="w-5" />
          <span>Flashcards saved successfully!</span>
        </div>
      )}
    </div>
  );
}
