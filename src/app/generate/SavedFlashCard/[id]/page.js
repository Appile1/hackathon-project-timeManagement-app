"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useUser } from "@clerk/nextjs";

const FlashcardDetail = ({ params }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const { user } = useUser();
  const id = params.id;

  useEffect(() => {
    const fetchFlashcards = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user && id) {
          const flashcardsDocRef = doc(db, "users", user.id, "flashcards", id);
          const docSnap = await getDoc(flashcardsDocRef);

          if (docSnap.exists()) {
            const flashcardsData = docSnap.data().flashcards || [];
            setFlashcards(flashcardsData);
          } else {
            setError("No flashcards document found.");
          }
        }
      } catch (error) {
        setError("Failed to load flashcards.");
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [id, user]);

  const handleCardFlip = (cardId) => {
    setFlippedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Flashcard Details
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Click on a card to reveal the answer
          </p>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          ) : flashcards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {flashcards.map((card, index) => (
                <div
                  key={index}
                  className="relative h-64 w-full perspective cursor-pointer"
                  onClick={() => handleCardFlip(index)}
                >
                  <div
                    className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out preserve-3d ${
                      flippedCards[index] ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Front of the flashcard */}
                    <div className="absolute inset-0 w-full h-full bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center backface-hidden">
                      <p className="text-lg text-gray-800 font-bold text-center flex items-center justify-center h-full ">
                        {card.cardFront}
                      </p>
                    </div>
                    {/* Back of the flashcard */}
                    <div className="absolute inset-0 w-full h-full bg-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center backface-hidden rotate-y-180">
                      <p className="text-lg text-gray-800 text-center flex items-center justify-center h-full  overflow-y-auto">
                        {card.cardBack}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-md">
              <p className="font-bold">No Flashcards</p>
              <p>There are no flashcards available for this set.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardDetail;
