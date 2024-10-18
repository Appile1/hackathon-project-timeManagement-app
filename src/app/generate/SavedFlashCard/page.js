"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Header from "@/componets/header/header";

export default function SaveFlashCard() {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchFlashcardSets = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const userDocRef = collection(db, "users", user.id, "flashcards");
        const q = query(userDocRef);
        const querySnapshot = await getDocs(q);

        const flashcardSetList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.id, // Assuming the document ID is the name of the flashcard set
          ...doc.data(),
        }));

        setFlashcardSets(flashcardSetList);
      } catch (error) {
        setError("Failed to load flashcard sets.");
        console.error("Error fetching flashcard sets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSets();
  }, [user]);

  const handleClick = (id) => {
    router.push(`/generate/SavedFlashCard/${id}`);
  };

  const FlashcardSetCard = ({ set }) => {
    return (
      <div
        className="group relative w-64 h-96 perspective-1000 cursor-pointer"
        onClick={() => handleClick(set.id)}
      >
        <div className="w-full h-full transition-all duration-500 transform-style-3d ">
          <div className="absolute w-full h-full rounded-2xl shadow-xl backface-hidden bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500">
            <div className="flex flex-col justify-center items-center h-full p-6 text-white">
              <h2 className="text-3xl font-bold text-center mb-4">
                {set.name}
              </h2>
              <p className="text-lg opacity-80">Click to view</p>
            </div>
          </div>
          <div className="absolute w-full h-full rounded-2xl shadow-xl backface-hidden rotate-y-180 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
            <div className="flex flex-col justify-center items-center h-full p-6 text-white">
              <p className="text-2xl font-semibold text-center">
                Explore {set.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-gradient-x">
              Your Saved Flashcards
            </h1>
            <p className="mt-3 text-xl text-gray-300 sm:mt-4">
              Click a set to view its flashcards
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-lg text-red-500">{error}</p>
            </div>
          ) : flashcardSets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
              {flashcardSets.map((set) => (
                <FlashcardSetCard key={set.id} set={set} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-400">
                No flashcard sets available.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
