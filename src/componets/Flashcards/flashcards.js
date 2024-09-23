"use client";
import React, { useState } from "react";
import "./flashcard.css";

export default function FlashCard({ cardFront, cardBack }) {
  const [isFlipped, setIsFlipped] = useState(false);

  function handleFlip() {
    setIsFlipped(!isFlipped);
  }

  return (
    <div
      className={`flip-card ${isFlipped ? "flipped" : ""}`}
      onClick={handleFlip}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <p className="text1">{cardFront}</p>
        </div>
        <div className="flip-card-back">
          <p className="text2">{cardBack}</p>
        </div>
      </div>
    </div>
  );
}
