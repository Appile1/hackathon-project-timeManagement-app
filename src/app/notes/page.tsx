"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import {
  PlusIcon,
  SearchIcon,
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
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase.js"; // Adjust the import based on your firebase config

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
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      fetchNotes(); // Fetch notes from Firestore when the user is authenticated
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const notesCollection = collection(db, "notes");
      const notesQuery = query(
        notesCollection,
        where("userId", "==", user.id), // Fetch notes for the current user
        orderBy("updatedAt", "desc")
      );
      const querySnapshot = await getDocs(notesQuery);
      const notesData = querySnapshot.docs.map((doc) => doc.data() as Note);
      setNotes(notesData);
    } catch (error) {
      console.error("Error fetching notes:", error);
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
      const noteDocRef = doc(db, "notes", newNote.id);
      await setDoc(noteDocRef, { ...newNote, userId: user.id });
      setNotes([newNote, ...notes]);
      setTitle("");
      setDescription("");
      setSelectedCategory(categoryOptions[0].value);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const startEditing = (id: string) => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setDescription(noteToEdit.description);
      setSelectedCategory(noteToEdit.category);
      setEditingId(id);
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
        const noteDocRef = doc(db, "notes", editingId);
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
        await deleteDoc(doc(db, "notes", noteToDelete));
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
        const noteDocRef = doc(db, "notes", restoredNote.id);
        await setDoc(noteDocRef, { ...restoredNote, userId: user.id });
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
        className="mb-4 p-2 border rounded w-full"
      />

      <div className="mb-4">
        <label className="mr-2">Filter by Category:</label>
        <select
          value={filterCategory || ""}
          onChange={(e) => setFilterCategory(e.target.value || null)}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <motion.div
            key={note.id}
            className="bg-gray-100 p-4 rounded-lg shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="font-bold text-xl">{note.title}</h2>
            <p className="text-gray-700">{note.description}</p>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">
                {format(note.updatedAt, "MMM dd, yyyy")}
              </span>
              <div className="flex space-x-2">
                <button onClick={() => startEditing(note.id)}>
                  <PencilIcon className="h-5 w-5 text-blue-600" />
                </button>
                <button onClick={() => confirmDeleteNote(note.id)}>
                  <TrashIcon className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">Confirm Delete</h3>
            <p>Are you sure you want to delete this note?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={deleteNote}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-gray-300 p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deletedNotes.length > 0 && (
        <button
          onClick={undoDelete}
          className="mt-4 bg-yellow-500 text-white p-2 rounded"
        >
          Undo Delete
        </button>
      )}
    </div>
  );
}
