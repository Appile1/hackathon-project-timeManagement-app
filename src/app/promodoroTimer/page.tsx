"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import useSound from "use-sound";
import { db } from "../firebase";
import Header from "../../componets/header/header";
import YoutubePlayer from "../../componets/youtuber/youtuber";
import BackGroundChanger from "../../componets/background changer/backgroundChange";
const TIMER_MODES = {
  POMODORO: "pomodoro",
  SHORT_BREAK: "shortBreak",
  LONG_BREAK: "longBreak",
};

const MOODS = {
  FOCUSED: "focused",
  DISTRACTED: "distracted",
  ENERGETIC: "energetic",
  TIRED: "tired",
  STRESSED: "stressed",
  RELAXED: "relaxed",
  MOTIVATED: "motivated",
  UNMOTIVATED: "unmotivated",
  CREATIVE: "creative",
  BLOCKED: "blocked",
};

export default function PomodoroTimer() {
  const { user } = useUser();
  const [mode, setMode] = useState(TIMER_MODES.POMODORO);
  const [timers, setTimers] = useState({
    [TIMER_MODES.POMODORO]: 25 * 60,
    [TIMER_MODES.SHORT_BREAK]: 5 * 60,
    [TIMER_MODES.LONG_BREAK]: 15 * 60,
  });
  const [isActive, setIsActive] = useState(false);
  const [durations, setDurations] = useState({
    [TIMER_MODES.POMODORO]: 25,
    [TIMER_MODES.SHORT_BREAK]: 5,
    [TIMER_MODES.LONG_BREAK]: 15,
  });
  const [mood, setMood] = useState("");
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [showDurationSettings, setShowDurationSettings] = useState(false);
  const [moodAction, setMoodAction] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#ef4444");
  const [bodyColor, setBodyColor] = useState("rgb(186, 73, 73)");
  const [timeStudied, setTimeStudied] = useState(0);
  const timeStudiedRef = useRef(0);
  const [background, setBackground] = useState("");

  const [playSound] = useSound("/audio.mp3", { volume: 0.5 });
  const [playFocusedSound, { stop: stopFocusedSound }] = useSound(
    "/Focused.mp3",
    { volume: 0.5 }
  );
  const [playEnergeticSound, { stop: stopEnergeticSound }] = useSound(
    "/Energetic.mp3",
    { volume: 0.5 }
  );
  const [playDistractedSound, { stop: stopDistractedSound }] = useSound(
    "/Distracted.mp3",
    { volume: 0.5 }
  );
  const [playBlockedSound, { stop: stopBlockedSound }] = useSound(
    "/Blocked.mp3",
    { volume: 0.5 }
  );
  const [playTiredSound, { stop: stopTiredSound }] = useSound("/Tired.mp3", {
    volume: 0.5,
  });
  const [playStressedSound, { stop: stopStressedSound }] = useSound(
    "/Stressed.mp3",
    { volume: 0.5 }
  );
  const [playRelaxedSound, { stop: stopRelaxedSound }] = useSound(
    "/Relaxed.mp3",
    { volume: 0.5 }
  );
  const [playMotivatedSound, { stop: stopMotivatedSound }] = useSound(
    "/Motivated.mp3",
    { volume: 0.5 }
  );
  const [playUnmotivatedSound, { stop: stopUnmotivatedSound }] = useSound(
    "/Unmotivated.mp3",
    { volume: 0.5 }
  );
  const [playCreativeSound, { stop: stopCreativeSound }] = useSound(
    "/Creative.mp3",
    { volume: 0.5 }
  );

  const stopAllSounds = () => {
    stopFocusedSound();
    stopEnergeticSound();
    stopDistractedSound();
    stopBlockedSound();
    stopTiredSound();
    stopStressedSound();
    stopRelaxedSound();
    stopMotivatedSound();
    stopUnmotivatedSound();
    stopCreativeSound();
  };

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userRef = doc(db, "users", user.id);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setTimeStudied(userData.timeStudied || 0);
            timeStudiedRef.current = userData.timeStudied || 0;
          } else {
            await setDoc(userRef, {
              name: user.fullName,
              photoUrl: user.imageUrl,
              timeStudied: 0,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timers[mode] > 0) {
      interval = setInterval(() => {
        setTimers((prevTimers) => ({
          ...prevTimers,
          [mode]: prevTimers[mode] - 1,
        }));

        if (mode === TIMER_MODES.POMODORO) {
          setTimeStudied((prevTime) => {
            const newTime = prevTime + 1;
            timeStudiedRef.current = newTime;
            return newTime;
          });
        }
      }, 1000);
    } else if (timers[mode] === 0) {
      setIsActive(false);
      playSound();
      if (mode === TIMER_MODES.POMODORO) {
        updateTimeStudied(timeStudiedRef.current);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, mode, timers, playSound]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mode", mode);
      localStorage.setItem("timers", JSON.stringify(timers));
      localStorage.setItem("isActive", isActive.toString());
      localStorage.setItem("durations", JSON.stringify(durations));
      localStorage.setItem("mood", mood);
      localStorage.setItem("backgroundColor", backgroundColor);
    }
  }, [mode, timers, isActive, durations, mood, backgroundColor]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("mode");
      const savedTimers = JSON.parse(localStorage.getItem("timers") || "{}");
      const savedIsActive = localStorage.getItem("isActive") === "true";
      const savedDurations = JSON.parse(
        localStorage.getItem("durations") || "{}"
      );
      const savedMood = localStorage.getItem("mood");
      const savedBackgroundColor = localStorage.getItem("backgroundColor");

      if (savedMode) setMode(savedMode as keyof typeof TIMER_MODES);
      if (Object.keys(savedTimers).length) setTimers(savedTimers);
      if (savedIsActive) setIsActive(savedIsActive);
      if (Object.keys(savedDurations).length) setDurations(savedDurations);
      if (savedMood) setMood(savedMood);
      if (savedBackgroundColor) setBackgroundColor(savedBackgroundColor);
    }
  }, []);

  const updateTimeStudied = async (newTime: number) => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.id);
        await updateDoc(userRef, {
          timeStudied: newTime,
        });
      } catch (error) {
        console.error("Error updating time studied:", error);
      }
    }
  };

  const toggleTimer = async () => {
    if (isActive) {
      if (mode === TIMER_MODES.POMODORO) {
        await updateTimeStudied(timeStudiedRef.current);
      }
    }

    if (user) {
      try {
        const userRef = doc(db, "users", user.id);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        const updates: { [key: string]: any } = {};
        if (userData?.name !== user.fullName) {
          updates.name = user.fullName;
        }
        if (userData?.photoUrl !== user.imageUrl) {
          updates.photoUrl = user.imageUrl;
        }

        if (Object.keys(updates).length > 0) {
          await updateDoc(userRef, {
            ...updates,
            lastActive: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
    setIsActive((prev) => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimers((prevTimers) => ({
      ...prevTimers,
      [mode]: durations[mode] * 60,
    }));
    if (mode === TIMER_MODES.POMODORO) {
      updateTimeStudied(timeStudiedRef.current);
    }
  };

  const switchMode = (newMode: keyof typeof TIMER_MODES) => {
    if (mode !== newMode) {
      if (mode === TIMER_MODES.POMODORO && isActive) {
        updateTimeStudied(timeStudiedRef.current);
      }
      setMode(newMode);
      setIsActive(false);
      setTimers((prevTimers) => ({
        ...prevTimers,
        [newMode]: durations[newMode] * 60,
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDurationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    timerKey: keyof typeof TIMER_MODES
  ) => {
    const value = parseInt(e.target.value);
    setDurations((prevDurations) => ({
      ...prevDurations,
      [timerKey]: value,
    }));
    setTimers((prevTimers) => ({
      ...prevTimers,
      [timerKey]: value * 60,
    }));
  };

  const handleMoodSubmit = (newMood: keyof typeof MOODS) => {
    setMood(newMood);
    setShowMoodInput(false);
    handleMood(newMood);
    playAudio(newMood);
  };

  const playAudio = (currentMood: keyof typeof MOODS) => {
    stopAllSounds();
    switch (currentMood) {
      case MOODS.FOCUSED:
        playFocusedSound();
        break;
      case MOODS.ENERGETIC:
        playEnergeticSound();
        break;
      case MOODS.BLOCKED:
        playBlockedSound();
        break;
      case MOODS.TIRED:
        playTiredSound();
        break;
      case MOODS.STRESSED:
        playStressedSound();
        break;
      case MOODS.RELAXED:
        playRelaxedSound();
        break;
      case MOODS.MOTIVATED:
        playMotivatedSound();
        break;
      case MOODS.UNMOTIVATED:
        playUnmotivatedSound();
        break;
      case MOODS.CREATIVE:
        playCreativeSound();
        break;
      case MOODS.DISTRACTED:
        playDistractedSound();
        break;
      default:
        break;
    }
  };
  function stopMusic() {}
  const handleMood = (currentMood: keyof typeof MOODS) => {
    let action = "";
    let newBackgroundColor = backgroundColor;
    let bodiesBackgroundColor = bodyColor;

    switch (currentMood) {
      case MOODS.FOCUSED:
        action =
          "Playing ambient sounds to maintain your focus. Timer settings optimized for deep work.";
        setDurations((prev) => ({
          ...prev,
          [TIMER_MODES.POMODORO]: 30,
          [TIMER_MODES.SHORT_BREAK]: 5,
        }));
        newBackgroundColor = "#e6f3ff";
        bodiesBackgroundColor = "#ADD8FF";
        break;
      case MOODS.ENERGETIC:
        action =
          "Extended work sessions to capitalize on your energy. Upbeat background music enabled.";
        setDurations((prev) => ({
          ...prev,
          [TIMER_MODES.POMODORO]: 40,
          [TIMER_MODES.SHORT_BREAK]: 5,
        }));
        newBackgroundColor = "#f4976c";
        bodiesBackgroundColor = "#f4976c";
        break;
      case MOODS.BLOCKED:
        action =
          "Taking a break to clear your mind. Consider a quick walk or meditation.";
        newBackgroundColor = "#ffdddd";
        bodiesBackgroundColor = "#FFECB3";
        break;
      case MOODS.TIRED:
        action = "Try to break up your tasks.";
        newBackgroundColor = "#e6ffe6";
        bodiesBackgroundColor = "#e6ffe6";
        break;
      case MOODS.DISTRACTED:
         action = "Try to break up your tasks.";
         newBackgroundColor = "#A3EBB1";
        bodiesBackgroundColor = "#A3EBB1";
        break;
      default:
        action =
          "Timer settings unchanged. Remember to adjust your environment for optimal productivity.";
    }

    setMoodAction(action);
    setBackgroundColor(newBackgroundColor);
    setBodyColor(bodiesBackgroundColor);
  };

  const [streak, setStreak] = useState<number | null>(null);
  const [lastStreakUpdate, setLastStreakUpdate] = useState<number | null>(null);
  const [displayStreak, setDisplayStreak] = useState<number>(0);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const [hideLoader, setHideLoader] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStreak = Number(localStorage.getItem("streak")) || 1;
      setStreak(savedStreak);
      setDisplayStreak(savedStreak);
      setLastStreakUpdate(
        Number(localStorage.getItem("lastStreakUpdate")) || Date.now()
      );
      setHideLoader(false);
    }
  }, []);

  useEffect(() => {
    if (streak === null || lastStreakUpdate === null || isAnimating) return;

    const checkStreak = setInterval(() => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastStreakUpdate;

      if (timeSinceLastUpdate === 86400 && !isAnimating) {
        const newStreak = streak + 1;
        setIsAnimating(true);
        setShowStreakAnimation(true);
        setHideLoader(false);

        // Start at current streak and animate up
        setDisplayStreak(streak);

        setTimeout(() => {
          setDisplayStreak(newStreak);
          setStreak(newStreak);
          setLastStreakUpdate(now);

          localStorage.setItem("streak", String(newStreak));
          localStorage.setItem("lastStreakUpdate", String(now));

          setTimeout(() => {
            setHideLoader(true);
            setIsAnimating(false);
          }, 900);
        }, 1000); // Show current streak for 1 second before incrementing
      } else {
        setHideLoader(true);
        setShowStreakAnimation(true);
      }
    }, 900);

    return () => clearInterval(checkStreak);
  }, [streak, lastStreakUpdate, isAnimating]);

  // Modified streak display in render
  const streakDisplay =
    streak === null ? (
      <div className="hidden">Loading...</div>
    ) : (
      <div className="text-4xl font-bold text-black-800 ">
        {streak} Day Streak!
      </div>
    );
  // Modify your return statement to include the streak animation
  return (
    <div className="min-h-screen">
      <div
        className={`fixed inset-0 bg-white transition-opacity duration-500 
        ${hideLoader ? "opacity-0 pointer-events-none" : "opacity-100"} 
        ${showStreakAnimation ? "z-50" : "-z-10"}`}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-6xl animate-bounce">🔥</span>
            </div>
            <div className="text-4xl font-bold text-gray-800 ">
              {streak} Day Streak!
            </div>
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-700 transform ${
          showStreakAnimation
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
        }`}
      >
        <div className="min-h-screen flex flex-col mt-10">
          <Header />
          <div
            className="flex-grow flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat min-h-screen"
            style={{
              backgroundColor: background ? "transparent" : bodyColor,
              backgroundImage: background ? `url(${background})` : "none",
            }}
          >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h1 className="text-2xl font-bold text-center mb-6">
                Pomodoro Timer
              </h1>
              <div
                className="text-6xl font-bold text-center mb-8"
                style={{ color: backgroundColor }}
              >
                {formatTime(timers[mode])}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {Object.values(TIMER_MODES).map((timerMode) => (
                  <button
                    key={timerMode}
                    onClick={() =>
                      switchMode(timerMode as keyof typeof TIMER_MODES)
                    }
                    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      mode === timerMode
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {timerMode.replace(/_/g, " ").toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={toggleTimer}
                  className="flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {isActive ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </>
                  )}
                </button>
                <button
                  onClick={resetTimer}
                  className="flex items-center justify-center py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </button>
              </div>

              <button
                onClick={() => setShowDurationSettings((prev) => !prev)}
                className="w-full mb-4 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                Set Durations
              </button>

              {showDurationSettings && (
                <div className="space-y-4 mb-6">
                  {Object.entries(durations).map(([key, value]) => (
                    <div key={key}>
                      <label
                        htmlFor={key}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {key.replace(/_/g, " ").toUpperCase()} Duration
                        (minutes)
                      </label>
                      <input
                        type="range"
                        id={key}
                        min="1"
                        max="60"
                        value={value}
                        onChange={(e) =>
                          handleDurationChange(
                            e,
                            key as keyof typeof TIMER_MODES
                          )
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-right text-sm text-gray-500 mt-1">
                        {value} minutes
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* <button
                onClick={() => setShowMoodInput((prev) => !prev)}
                className="w-full mb-4 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Select Mood
              </button> */}

              {showMoodInput && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {Object.values(MOODS).map((moodOption) => (
                    <button
                      key={moodOption}
                      onClick={() =>
                        handleMoodSubmit(moodOption as keyof typeof MOODS)
                      }
                      className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
                    >
                      {moodOption}
                    </button>
                  ))}
                </div>
              )}

              {mood && (
                <div className="text-sm text-center mb-4 text-gray-600">
                  {moodAction}
                </div>
              )}

              <div className="containerLinks">
              <YoutubePlayer />
                <BackGroundChanger setBackground={setBackground} />
                
              </div>

              <div className="text-center text-sm text-gray-500">
                Time studied: {formatTime(timeStudiedRef.current)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
