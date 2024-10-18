import React, { useState } from "react";
import "./youtuber.css"
export default function YoutubePlayer() {
  const [link, setLink] = useState("")

  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null; // Return video ID or null if no match
  };

  const videoId = getVideoId(link);

  return (
    <div className="youtubePlayerContainer">
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter YouTube link"
        className="youtubeInput"
      />
      {videoId && (
        <div className="youtubeEmbedContainer ">
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
}