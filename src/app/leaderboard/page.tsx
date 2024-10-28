"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Footer from "../../componets/footer/footer.js";
import Header from "../../componets/header/header";
import { useUser } from "@clerk/nextjs";

type UserData = {
  id: string;
  name: string;
  timeStudied: number;
  photoUrl: string;
};

const MedalIcon = ({ rank }: { rank: number }) => {
  const colors: { [key: number]: string } = {
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
      className={colors[rank] || "text-black"}
    >
      <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
      <path d="M15 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    </svg>
  );
};


const formatStudyTime = (seconds: number) => {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${totalMinutes < 60 ? "min" : "hours"}`;
};


export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<UserData[]>([]);
  const [hoveredRank, setHoveredRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [loggedInUserData, setLoggedInUserData] = useState<UserData | null>(
    null
  );

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const q = query(
          collection(db, "users"),
          orderBy("timeStudied", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const data: UserData[] = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          name: doc.data().name || "Anonymous",
          timeStudied: doc.data().timeStudied || 0,
          photoUrl: doc.data().photoUrl || "/placeholder.svg",
        }));
        setLeaderboardData(data);

        if (user) {
          const userDocRef = doc(db, "users", user.id);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setLoggedInUserData({
              id: user.id,
              name: userData.name || user.fullName || "Anonymous",
              timeStudied: userData.timeStudied || 0,
              photoUrl:
                userData.photoUrl || user.imageUrl || "/placeholder.svg",
            });
          } else {
            setLoggedInUserData(null);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [user]);

  const loggedInUserRank = loggedInUserData
    ? leaderboardData.findIndex(
        (userData) => userData.id === loggedInUserData.id
      ) + 1
    : -1;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Study Time Leaderboard
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 bg-white shadow-md rounded-lg">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Top Students</h2>
            </div>
            <div className="p-4 space-y-4">
              {leaderboardData.map((student, index) => (
                <div
                  key={student.id}
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 ease-in-out
                ${index < 3 ? "bg-primary/10 shadow-lg" : "bg-secondary/10"}
                ${hoveredRank === index + 1 ? "scale-105" : ""} 
                ${
                  index === 0
                    ? "ring-2 ring-yellow-500"
                    : index === 1
                    ? "ring-2 ring-gray-400"
                    : index === 2
                    ? "ring-2 ring-amber-600"
                    : ""
                }`}
                  onMouseEnter={() => setHoveredRank(index + 1)}
                  onMouseLeave={() => setHoveredRank(null)}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center font-bold text-lg
                    ${
                      index === 0
                        ? "text-yellow-500"
                        : index === 1
                        ? "text-gray-400"
                        : index === 2
                        ? "text-amber-600"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="ml-2">
                    <img
                      src={student.photoUrl}
                      alt={student.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="font-semibold">{student.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatStudyTime(student.timeStudied)}
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="flex-shrink-0">
                      <MedalIcon rank={index + 1} />
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
              {loggedInUserData ? (
                <>
                  <div className="w-20 h-20">
                    <img
                      src={loggedInUserData.photoUrl}
                      alt={loggedInUserData.name}
                      className="rounded-full"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {loggedInUserData.name}
                    </div>
                    <div className="text-xl text-gray-500">
                      {formatStudyTime(loggedInUserData.timeStudied)}
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                      Rank:{" "}
                      {loggedInUserRank > 0 ? loggedInUserRank : "Not Ranked"}
                    </div>
                  </div>
                  <div className="text-sm text-center font-medium text-blue-500 mt-4">
                    "Consistency is the key to success. Keep up the great work!"
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto">
                    <img
                      src={user?.imageUrl || "/placeholder.svg"}
                      alt="Your avatar"
                      className="rounded-full"
                    />
                  </div>
                  <div className="text-2xl font-bold">
                    {user?.fullName || "New User"}
                  </div>
                  <div className="text-xl text-gray-500">
                    Start your study journey!
                  </div>
                  <div className="text-sm font-medium text-blue-500 mt-4">
                    "The journey of a thousand miles begins with a single step.
                    Start your Pomodoro timer today!"
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    Use the Pomodoro timer to track your study time and join the
                    leaderboard.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
