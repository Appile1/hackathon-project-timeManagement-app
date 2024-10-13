"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const SaveFlashCard = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        // Access the user's sub-collection by their Clerk ID
        const userDocRef = collection(db, "users", user.id, "flashcards");
        const q = query(userDocRef);
        const querySnapshot = await getDocs(q);

        const flashcardList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFlashcards(flashcardList);
      } catch (error) {
        setError("Failed to load flashcards.");
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [user]);

  const handleClick = (id) => {
    router.push(`/generate/SavedFlashCard/${id}`);
  };

  const FlashcardCard = ({ card }) => {
    return (
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer transform"
        onClick={() => handleClick(card.id)}
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">{card.name}</h2>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white">
            Your Saved Flashcards
          </h1>
          <p className="text-gray-400 mt-2">
            Click a flashcard to view or edit it
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center">
              <p className="text-lg text-gray-300">Loading...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center">
              <p className="text-lg text-red-500">{error}</p>
            </div>
          ) : flashcards.length > 0 ? (
            flashcards.map((card) => (
              <FlashcardCard key={card.id} card={card} />
            ))
          ) : (
            <div className="col-span-full text-center">
              <p className="text-lg text-gray-400">No flashcards available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SaveFlashCard;
