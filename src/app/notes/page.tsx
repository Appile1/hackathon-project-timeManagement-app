"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import {
  TrashIcon,
  PencilIcon,
  UndoIcon,
  BriefcaseIcon,
  HomeIcon,
  BookIcon,
  CalendarIcon,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.js"; // Adjust the import based on your firebase config
import Header from "@/componets/header/header.js";
import Footer from "@/componets/footer/footer.js";

interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  category: string;
}

const categoryOptions = [
  { value: "work", label: "Work", icon: BriefcaseIcon },
  { value: "personal", label: "Personal", icon: HomeIcon },
  { value: "study", label: "Study", icon: BookIcon },
  { value: "other", label: "Other", icon: CalendarIcon },
];

export default function NotesSection() {
  const { user } = useUser(); // Get current user
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const [sortBy, setSortBy] = useState<"createdAt" | "updatedAt" | "title">(
    "updatedAt"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    categoryOptions[0].value
  );
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useEffect(() => {
    if (user) {
      fetchNotes(); // Fetch notes from Firestore when the user is authenticated
    }
  }, [user]);

  const fetchNotes = async () => {
    setIsLoading(true); // Start loading
    try {
      // Get notes from the `users/{userId}/notes` sub-collection
      const notesCollection = collection(db, `users/${user?.id}/notes`);
      const notesQuery = query(notesCollection, orderBy("updatedAt", "desc"));
      const querySnapshot = await getDocs(notesQuery);
      const notesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Note, "id">),
      }));
      setNotes(notesData); // Set notes to state
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const addNote = async () => {
    if (title.trim() === "" || description.trim() === "") return;
    const newNote: Note = {
      id: uuidv4(),
      title,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      category: selectedCategory,
    };

    try {
      // Add the note to `users/{userId}/notes` sub-collection
      const noteDocRef = doc(db, `users/${user?.id}/notes`, newNote.id);
      await setDoc(noteDocRef, newNote);
      setNotes([newNote, ...notes]);
      setTitle("");
      setDescription("");
      setSelectedCategory(categoryOptions[0].value);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const updateNote = async () => {
    if (editingId) {
      const updatedNotes = notes.map((note) =>
        note.id === editingId
          ? {
              ...note,
              title,
              description,
              updatedAt: Date.now(),
              category: selectedCategory,
            }
          : note
      );

      try {
        // Update the note in `users/{userId}/notes` sub-collection
        const noteDocRef = doc(db, `users/${user?.id}/notes`, editingId);
        await updateDoc(noteDocRef, {
          title,
          description,
          updatedAt: Date.now(),
          category: selectedCategory,
        });
        setNotes(updatedNotes);
        setTitle("");
        setDescription("");
        setSelectedCategory(categoryOptions[0].value);
        setEditingId(null);
      } catch (error) {
        console.error("Error updating note:", error);
      }
    }
  };

  const confirmDeleteNote = (id: string) => {
    setNoteToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const deleteNote = async () => {
    if (noteToDelete) {
      try {
        // Delete the note from `users/{userId}/notes` sub-collection
        await deleteDoc(doc(db, `users/${user?.id}/notes`, noteToDelete));
        const deletedNote = notes.find((note) => note.id === noteToDelete);
        if (deletedNote) {
          setDeletedNotes([deletedNote, ...deletedNotes.slice(0, 4)]);
        }
        setNotes(notes.filter((note) => note.id !== noteToDelete));
        setIsDeleteDialogOpen(false);
        setNoteToDelete(null);
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const undoDelete = async () => {
    if (deletedNotes.length > 0) {
      const [restoredNote, ...remainingDeleted] = deletedNotes;
      try {
        // Restore the deleted note back to `users/{userId}/notes` sub-collection
        const noteDocRef = doc(db, `users/${user?.id}/notes`, restoredNote.id);
        await setDoc(noteDocRef, restoredNote);
        setNotes([restoredNote, ...notes]);
        setDeletedNotes(remainingDeleted);
      } catch (error) {
        console.error("Error restoring note:", error);
      }
    }
  };

  const filteredNotes = notes
    .filter(
      (note) =>
        (filterCategory ? note.category === filterCategory : true) &&
        (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return b[sortBy] - a[sortBy];
    });

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Notes Section</h1>

        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
            rows={3}
          />
          <div className="flex items-center space-x-2 mb-2">
            <label className="mr-2">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-[180px] p-2 border rounded"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={editingId ? updateNote : addNote}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            {editingId ? "Update Note" : "Add Note"}
          </button>
        </div>

        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-6 p-2 border rounded"
        />

        <div className="mb-6">
          <label className="mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 border rounded"
          >
            <option value="updatedAt">Last Updated</option>
            <option value="createdAt">Date Created</option>
            <option value="title">Title</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  ">
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <h2 className="font-bold text-lg">{note.title}</h2>
                <p>{note.description}</p>
                <p className="text-gray-500 text-sm">
                  Created: {format(new Date(note.createdAt), "MMM dd, yyyy")}
                </p>
                <p className="text-gray-500 text-sm">
                  Updated: {format(new Date(note.updatedAt), "MMM dd, yyyy")}
                </p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => {
                      setEditingId(note.id);
                      setTitle(note.title);
                      setDescription(note.description);
                      setSelectedCategory(note.category);
                    }}
                    className="text-blue-500"
                  >
                    <PencilIcon className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => confirmDeleteNote(note.id)}
                    className="text-red-500"
                  >
                    <TrashIcon className="inline mr-1" /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div>No notes found.</div>
        )}

        <AnimatePresence>
          {isDeleteDialogOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white p-6 rounded shadow">
                <h2 className="text-lg mb-4">
                  Are you sure you want to delete this note?
                </h2>
                <div className="flex justify-between">
                  <button
                    onClick={deleteNote}
                    className="bg-red-500 text-white rounded p-2"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setIsDeleteDialogOpen(false)}
                    className="bg-gray-300 rounded p-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {deletedNotes.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold">Recently Deleted Notes:</h3>
            <div className="flex space-x-2">
              {deletedNotes.map((note) => (
                <div key={note.id} className="bg-gray-200 p-2 rounded">
                  <p>{note.title}</p>
                </div>
              ))}
              <button
                onClick={undoDelete}
                className="bg-blue-500 text-white p-2 rounded"
              >
                <UndoIcon className="inline mr-1" /> Undo
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
