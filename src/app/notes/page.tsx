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
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (title.trim() === "" || description.trim() === "") return;
    const newNote: Note = {
      id: uuidv4(),
      title,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      category: selectedCategory,
    };
    setNotes([newNote, ...notes]);
    setTitle("");
    setDescription("");
    setSelectedCategory(categoryOptions[0].value);
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

  const updateNote = () => {
    if (editingId) {
      setNotes(
        notes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title,
                description,
                updatedAt: Date.now(),
                category: selectedCategory,
              }
            : note
        )
      );
      setTitle("");
      setDescription("");
      setSelectedCategory(categoryOptions[0].value);
      setEditingId(null);
    }
  };

  const confirmDeleteNote = (id: string) => {
    setNoteToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const deleteNote = () => {
    if (noteToDelete) {
      const deletedNote = notes.find((note) => note.id === noteToDelete);
      if (deletedNote) {
        setDeletedNotes([deletedNote, ...deletedNotes.slice(0, 4)]);
      }
      setNotes(notes.filter((note) => note.id !== noteToDelete));
      setIsDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };

  const undoDelete = () => {
    if (deletedNotes.length > 0) {
      const [restoredNote, ...remainingDeleted] = deletedNotes;
      setNotes([restoredNote, ...notes]);
      setDeletedNotes(remainingDeleted);
    }
  };

  const handleNoteChange = (
    id: string,
    field: "title" | "description",
    value: string
  ) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, [field]: value, updatedAt: Date.now() }
          : note
      )
    );

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      localStorage.setItem("notes", JSON.stringify(notes));
    }, 1000);
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
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow p-2 border rounded"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="w-[180px] p-2 border rounded"
        >
          <option value="updatedAt">Last Modified</option>
          <option value="createdAt">Date Created</option>
          <option value="title">Title</option>
        </select>
        <select
          value={filterCategory || ""}
          onChange={(e) => setFilterCategory(e.target.value || null)}
          className="w-[180px] p-2 border rounded"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {deletedNotes.length > 0 && (
          <button
            className="p-2 bg-gray-500 text-white rounded"
            onClick={undoDelete}
          >
            <UndoIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-full flex flex-col bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-bold">{note.title}</span>
                  <span className="text-sm bg-gray-200 text-gray-600 rounded px-2 py-1">
                    {
                      categoryOptions.find((cat) => cat.value === note.category)
                        ?.label
                    }
                  </span>
                </div>
                <div className="mt-2 flex-grow">
                  <p className="text-sm text-gray-600">
                    {note.description.length > 100
                      ? `${note.description.slice(0, 100)}...`
                      : note.description}
                  </p>
                  {note.description.length > 100 && (
                    <button
                      className="text-blue-500 mt-2"
                      onClick={() => startEditing(note.id)}
                    >
                      Read more
                    </button>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    <p>Created: {format(note.createdAt, "PPpp")}</p>
                    <p>Updated: {format(note.updatedAt, "PPpp")}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    className="p-2 border rounded hover:bg-gray-100"
                    onClick={() => startEditing(note.id)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 border rounded hover:bg-gray-100"
                    onClick={() => confirmDeleteNote(note.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this note? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="p-2 border rounded"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="p-2 bg-red-500 text-white rounded"
                onClick={deleteNote}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
