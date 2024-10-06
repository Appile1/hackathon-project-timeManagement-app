"use client";
import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Modal,
} from "@mui/material";
import Flashcards from "../../componets/Flashcards/flashcards";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react"; // Import from lucide-react for loader
import "./generate.css"; // Adjust if needed
import Header from "../../componets/header/header.js";
import Footer from "../../componets/footer/footer";

export default function ChatArea() {
  const [inputValue, setInputValue] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [flashcardName, setFlashcardName] = useState("");
  const [saveError, setSaveError] = useState("");
  const { user } = useUser();

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const systemPrompt = `Create 9 flashcards based on the following text, focusing on the most important concepts, definitions, and questions. Each flashcard should be formatted as an object in a JSON array with the following properties:

  id: A unique identifier for the card (e.g., card1, card2, etc.).
  cardFront: A concise, clear question, term, or concept. This should be something that prompts the learner to recall key information.
  cardBack: A detailed explanation, definition, or answer that directly addresses the content on the front of the card. Ensure the explanation is clear, accurate, and provides any necessary context or examples.
  Guidelines for creating the best flashcards:

  Focus on key concepts and terms that are essential for understanding the topic.
  Ensure questions are direct and encourage active recall.
  Provide concise yet comprehensive answers or explanations on the back.
  Include examples or additional context if it helps clarify the concept.
  Avoid overly complex or ambiguous wording; aim for clarity and simplicity.
  Please generate the flashcards in the JSON array format with no additional text.`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/chatai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              { role: "user", content: inputValue },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const parsedData = JSON.parse(data.message);
        setFlashcards(parsedData);
      } catch (error) {
        setError("Failed to generate flashcards. Please try again.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }

      setInputValue("");
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setSaveError("");
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" className="mx-auto mt-40">
        <Box textAlign="center" className="mb-8">
          <Typography variant="h4" gutterBottom className="font-bold">
            Generate Flashcards
          </Typography>
          <Typography variant="body1" paragraph className="text-gray-500">
            Enter text to generate flashcards with key concepts and definitions.
          </Typography>
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <TextField
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
            variant="outlined"
            fullWidth
            className="border rounded-md"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2"
          >
            {loading ? "Generating..." : "Generate Flashcards"}
          </Button>
        </form>

        {/* Flashcards display */}
        <Box
          className={
            flashcards.length > 0
              ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-10 mt-10`
              : "flex justify-center items-center h-64 mt-10"
          }
        >
          {loading ? (
            <Box className="flex justify-center items-center h-64">
              <Loader className="animate-spin text-blue-500 w-12 h-12" />
            </Box>
          ) : error ? (
            <Box className="text-center">
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            </Box>
          ) : flashcards.length > 0 ? (
            flashcards.map((card, index) => (
              <Flashcards
                key={index}
                cardFront={card.cardFront}
                cardBack={card.cardBack}
                className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition duration-300"
              />
            ))
          ) : (
            <Typography variant="body1" className="text-center mt-3 font-bold">
              No flashcards available. Please enter some text to generate them.
            </Typography>
          )}
        </Box>

        {/* Modal for saving flashcards */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="save-flashcards-modal"
          aria-describedby="modal-to-save-flashcards"
        >
          <Box className="bg-white p-8 rounded-lg shadow-lg mx-auto max-w-md">
            <Typography
              id="save-flashcards-modal"
              variant="h6"
              className="font-bold mb-4"
            >
              Save Flashcards
            </Typography>
            <TextField
              label="Flashcard Name"
              value={flashcardName}
              onChange={(e) => setFlashcardName(e.target.value)}
              fullWidth
              className="mb-4"
            />
            {saveError && (
              <Typography variant="body2" color="error" className="mb-2">
                {saveError}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseModal}
              fullWidth
              className="mt-2"
            >
              Cancel
            </Button>
          </Box>
        </Modal>
      </Container>
      <Footer />
    </>
  );
}
