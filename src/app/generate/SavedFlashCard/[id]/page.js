"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import Flashcard from "../../../../componets/Flashcards/flashcards";
import { useUser } from "@clerk/nextjs";

const FlashcardDetail = ({ params }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const id = params.id;

  useEffect(() => {
    const fetchFlashcards = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user && id) {
          // Correct Firebase path for the user's flashcards collection
          const flashcardsDocRef = doc(db, "users", user.id, "flashcards", id);

          const docSnap = await getDoc(flashcardsDocRef);

          if (docSnap.exists()) {
            // Assuming the document contains an array of flashcards
            const flashcards = docSnap.data().flashcards || [];
            setFlashcards(flashcards);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Flashcard Details</h1>
        {loading ? (
          <p className="text-lg">Loading...</p>
        ) : error ? (
          <p className="text-lg text-red-500">{error}</p>
        ) : flashcards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {flashcards.map((flashcard, index) => (
              <div key={index} className="mb-4">
                <Flashcard
                  cardFront={flashcard.cardFront}
                  cardBack={flashcard.cardBack}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg">No flashcards available.</p>
        )}
      </div>
    </div>
  );
};

export default FlashcardDetail;
