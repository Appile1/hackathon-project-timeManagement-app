"use client";

import { useEffect, useState } from "react";
import { PlusCircle, X, Loader2, Upload, Search, Calendar } from "lucide-react";
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
  createdAt: string;
};

type UserMemories = {
  memories: Memory[];
};

export default function VisualMemoryRoom() {
  const { user } = useUser();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
          setFilteredMemories(userData.memories || []);
        } else {
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

  useEffect(() => {
    const filtered = memories.filter(
      (memory) =>
        memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memory.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMemories(filtered);
  }, [searchTerm, memories]);

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
        createdAt: new Date().toISOString(),
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-indigo-800 mb-12">
          Visual Memory Room
        </h1>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-12 transition-all duration-300 hover:shadow-3xl">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
            Create a New Memory
          </h2>
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 h-32 resize-none"
            />
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer bg-indigo-100 text-indigo-700 px-6 py-3 rounded-lg hover:bg-indigo-200 transition duration-300">
                <PlusCircle size={24} />
                <span className="font-medium">Choose Image</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              {file && (
                <span className="text-sm text-indigo-600 font-medium">
                  {file.name}
                </span>
              )}
            </div>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50 flex items-center justify-center font-semibold text-lg"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Memory
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400"
              size={20}
            />
          </div>
        </div>

        {/* Memory Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="text-center text-xl text-indigo-800 bg-white rounded-xl shadow-lg p-8">
            {searchTerm
              ? "No memories found matching your search."
              : "You haven't added any memories yet. Create your first memory above!"}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMemories.map((memory) => (
              <div
                key={memory.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition duration-300"
                onClick={() => handleMemoryClick(memory)}
              >
                <img
                  src={memory.image}
                  alt={memory.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                    {memory.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {memory.description}
                  </p>
                  <div className="flex items-center text-xs text-indigo-500">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(memory.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Memory Popup */}
        {selectedMemory && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl">
              <div className="relative">
                <img
                  src={selectedMemory.image}
                  alt={selectedMemory.title}
                  className="w-full h-96 object-cover"
                />
                <button
                  onClick={closePopup}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition duration-300 bg-black bg-opacity-50 rounded-full p-2"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold text-indigo-800 mb-4">
                  {selectedMemory.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  {selectedMemory.description}
                </p>
                <div className="flex items-center text-sm text-indigo-500">
                  <Calendar size={16} className="mr-2" />
                  Created on {formatDate(selectedMemory.createdAt)}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
