"use client";

import { useState } from "react";
import { PlusCircle, X, Heart } from "lucide-react";

// Fake data for memories
const fakeMemories = [
  {
    id: 1,
    title: "Summer Vacation",
    description: "Beautiful beach sunset",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
  },
  {
    id: 2,
    title: "City Lights",
    description: "Night view of the skyline",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&q=80",
  },
  {
    id: 3,
    title: "Mountain Hike",
    description: "Breathtaking view from the peak",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80",
  },
  {
    id: 4,
    title: "Cozy Cafe",
    description: "Perfect spot for a rainy day",
    image:
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=500&q=80",
  },
  {
    id: 5,
    title: "Spring Bloom",
    description: "Cherry blossoms in full bloom",
    image:
      "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=500&q=80",
  },
];

export default function VisualMemoryRoom() {
  const [memories, setMemories] = useState(fakeMemories);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!title || !description || !file) {
      alert("Please fill out all fields and upload an image.");
      return;
    }

    const newMemory = {
      id: memories.length + 1, // Ensure unique ID
      title,
      description,
      image: URL.createObjectURL(file), // Use a local URL for the uploaded image
    };

    setMemories([...memories, newMemory]);
    setTitle("");
    setDescription("");
    setFile(null);
  };

  const handleMemoryClick = (memory) => {
    setSelectedMemory(memory);
  };

  const closePopup = () => {
    setSelectedMemory(null);
  };

  return (
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
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Upload Memory
          </button>
        </div>
      </div>

      {/* Memory Grid */}
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
              <p className="text-gray-600 mb-4">{selectedMemory.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Created on: {new Date().toLocaleDateString()}
                </span>
                <button className="text-red-500 hover:text-red-600 transition duration-300">
                  <Heart size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
