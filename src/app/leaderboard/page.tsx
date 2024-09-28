"use client";
import { useState } from "react";
// Mock data for the leaderboard with anime character images
const leaderboardData = [
  {
    id: 1,
    name: "Alice Johnson",
    hours: 120,
    rank: 1,
    avatar: "https://example.com/anime-character-1.jpg",
  },
  {
    id: 2,
    name: "Bob Smith",
    hours: 115,
    rank: 2,
    avatar: "https://example.com/anime-character-2.jpg",
  },
  {
    id: 3,
    name: "Charlie Brown",
    hours: 110,
    rank: 3,
    avatar: "https://example.com/anime-character-3.jpg",
  },
  {
    id: 4,
    name: "David Lee",
    hours: 105,
    rank: 4,
    avatar: "https://example.com/anime-character-4.jpg",
  },
  {
    id: 5,
    name: "Emma Davis",
    hours: 100,
    rank: 5,
    avatar: "https://example.com/anime-character-5.jpg",
  },
  {
    id: 6,
    name: "Frank Wilson",
    hours: 95,
    rank: 6,
    avatar: "https://example.com/anime-character-6.jpg",
  },
  {
    id: 7,
    name: "Grace Taylor",
    hours: 90,
    rank: 7,
    avatar: "https://example.com/anime-character-7.jpg",
  },
  {
    id: 8,
    name: "Henry Martin",
    hours: 85,
    rank: 8,
    avatar: "https://example.com/anime-character-8.jpg",
  },
  {
    id: 9,
    name: "Ivy Chen",
    hours: 80,
    rank: 9,
    avatar: "https://example.com/anime-character-9.jpg",
  },
  {
    id: 10,
    name: "Jack Thompson",
    hours: 75,
    rank: 10,
    avatar: "https://example.com/anime-character-10.jpg",
  },
];

// Mock data for the logged-in user
const loggedInUser = {
  name: "You",
  hours: 98,
  rank: 5,
  avatar: "https://example.com/anime-character-you.jpg",
};

const MedalIcon = ({ rank }) => {
  const colors = {
    1: "text-yellow-500",
    2: "text-gray-400",
    3: "text-amber-600",
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={colors[rank]}
    >
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
      <path d="M15 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M9 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M12 6h.01" />
      <path d="M11 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3.96a1 1 0 0 1-.804.98l-1.196.24a1 1 0 0 1-.392 0l-1.196-.24A1 1 0 0 1 11 9.96V6Z" />
    </svg>
  );
};

const formatStudyTime = (hours) => {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ${remainingHours} hour${
      remainingHours !== 1 ? "s" : ""
    }`;
  } else {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }
};

export default function Leaderboard() {
  const [hoveredRank, setHoveredRank] = useState(null);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Study Time Leaderboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-white shadow-md rounded-lg">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Top Students</h2>
          </div>
          <div className="p-4 space-y-4">
            {leaderboardData.map((student) => (
              <div
                key={student.id}
                className={`flex items-center p-3 rounded-lg transition-all duration-300 ease-in-out
                  ${
                    student.rank <= 3
                      ? "bg-primary/10 shadow-lg"
                      : "bg-secondary/10"
                  }
                  ${hoveredRank === student.rank ? "scale-105" : ""} 
                  ${
                    student.rank === 1
                      ? "ring-2 ring-yellow-500"
                      : student.rank === 2
                      ? "ring-2 ring-gray-400"
                      : student.rank === 3
                      ? "ring-2 ring-amber-600"
                      : ""
                  }`}
                onMouseEnter={() => setHoveredRank(student.rank)}
                onMouseLeave={() => setHoveredRank(null)}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold text-lg
                  ${
                    student.rank === 1
                      ? "text-yellow-500"
                      : student.rank === 2
                      ? "text-gray-400"
                      : student.rank === 3
                      ? "text-amber-600"
                      : ""
                  }`}
                >
                  {student.rank}
                </div>
                <div className="ml-2">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <div className="font-semibold">{student.name}</div>
                  <div className="text-sm text-gray-500">
                    {formatStudyTime(student.hours)}
                  </div>
                </div>
                {student.rank <= 3 && (
                  <div className="flex-shrink-0">
                    <MedalIcon rank={student.rank} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Your Ranking</h2>
          </div>
          <div className="p-4 flex flex-col items-center space-y-4">
            <div className="w-20 h-20">
              <img
                src={loggedInUser.avatar}
                alt={loggedInUser.name}
                className="rounded-full"
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{loggedInUser.name}</div>
              <div className="text-xl text-gray-500">
                {formatStudyTime(loggedInUser.hours)}
              </div>
              <div className="mt-2 text-lg font-semibold">
                Rank: {loggedInUser.rank}
              </div>
            </div>
            <div className="text-sm text-center font-medium text-blue-500 mt-4">
              "Consistency is the key to success. Keep up the great work!"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
