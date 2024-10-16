import React from "react";
import "../../componets/youtuber/youtuber.css";
export default function BackGroundChanger({setBackground }) {
  const handleUrlChange = (event) => {
    setBackground(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setBackground(fileUrl);
    }
  };

  return (
    <div className="youtubePlayerContainer">
      <input
        type="text"
        onChange={handleUrlChange}
        placeholder="Change background with URL"
        className="youtubeInput"
      />
      <label  id="file-upload">
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="youtubeInput"
      
      />
      </label>
    </div>
  );
}