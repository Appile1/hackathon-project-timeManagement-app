"use client";

import { useEffect, useState } from "react";
import { PlusCircle, X, Loader2 } from "lucide-react";
import { db, storage } from "../firebase.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import Header from "../../componets/header/header.js";
import Footer from "../../componets/footer/footer.js";

type Memory = {
  id: string;
  title: string;
  description: string;
  image: string;
};

type UserMemories = {
  memories: Memory[];
};

export default function VisualMemoryRoom() {
  const { user } = useUser();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const userDocRef = doc(db, "users", user.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as UserMemories;
          setMemories(userData.memories || []);
        } else {
          // Create a new document for the user if it doesn't exist
          await setDoc(userDocRef, { memories: [] });
        }
      } catch (error) {
        console.error("Error fetching memories: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemories();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!title || !description || !file || !user) {
      alert("Please fill out all fields and upload an image.");
      return;
    }

    setIsUploading(true);

    try {
      const storageRef = ref(storage, `memories/${user.id}/${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      const newMemory: Memory = {
        id: Date.now().toString(),
        title,
        description,
        image: imageUrl,
      };

      const userDocRef = doc(db, "users", user.id);
      await updateDoc(userDocRef, {
        memories: arrayUnion(newMemory),
      });

      setMemories((prevMemories) => [...prevMemories, newMemory]);

      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error) {
      console.error("Error uploading memory: ", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
  };

  const closePopup = () => {
    setSelectedMemory(null);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-8">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-8">
          Memory Room
        </h1>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
            Create a New Memory
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition duration-300">
                <PlusCircle size={20} />
                <span>Choose Image</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              {file && (
                <span className="text-sm text-indigo-600">{file.name}</span>
              )}
            </div>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50 flex items-center justify-center"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Memory"
              )}
            </button>
          </div>
        </div>

        {/* Memory Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center text-xl text-indigo-800">
            You haven't added any memories yet. Create your first memory above!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {memories.map((memory) => (
              <div
                key={memory.id}
                className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer transform hover:scale-105 transition duration-300"
                onClick={() => handleMemoryClick(memory)}
              >
                <img
                  src={memory.image}
                  alt={memory.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {memory.title}
                  </h3>
                  <p className="text-sm text-gray-200">{memory.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Memory Popup */}
        {selectedMemory && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full overflow-hidden shadow-2xl">
              <div className="relative">
                <img
                  src={selectedMemory.image}
                  alt={selectedMemory.title}
                  className="w-full h-96 object-cover"
                />
                <button
                  onClick={closePopup}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition duration-300"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-3xl font-bold text-indigo-800 mb-2">
                  {selectedMemory.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {selectedMemory.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
