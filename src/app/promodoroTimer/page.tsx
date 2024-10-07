"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import useSound from "use-sound";
import { db } from "../firebase";
import Header from "@/componets/header/header";
import Footer from "@/componets/footer/footer";

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
  const [timeStudied, setTimeStudied] = useState(0);
  const timeStudiedRef = useRef(0);

  const [playSound] = useSound("/audio.mp3");
  const [playFocusedSound, { stop: stopFocusedSound }] =
    useSound("/Focused.mp3");
  const [playEnergeticSound, { stop: stopEnergeticSound }] =
    useSound("/Energetic.mp3");
  const [playDistractedSound, { stop: stopDistractedSound }] =
    useSound("/Distracted.mp3");
  const [playBlockedSound, { stop: stopBlockedSound }] =
    useSound("/Distracted.mp3");
  const [playTiredSound, { stop: stopTiredSound }] = useSound("/Tired.mp3");
  const [playStressedSound, { stop: stopStressedSound }] =
    useSound("/Stressed.mp3");
  const [playRelaxedSound, { stop: stopRelaxedSound }] =
    useSound("/Relaxed.mp3");
  const [playMotivatedSound, { stop: stopMotivatedSound }] =
    useSound("/Motivated.mp3");
  const [playUnmotivatedSound, { stop: stopUnmotivatedSound }] =
    useSound("/Unmotivated.mp3");
  const [playCreativeSound, { stop: stopCreativeSound }] =
    useSound("/Creative.mp3");

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
      };

      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    let interval = null;
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
    return () => clearInterval(interval);
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
      const savedTimers = JSON.parse(localStorage.getItem("timers"));
      const savedIsActive = localStorage.getItem("isActive") === "true";
      const savedDurations = JSON.parse(localStorage.getItem("durations"));
      const savedMood = localStorage.getItem("mood");
      const savedBackgroundColor = localStorage.getItem("backgroundColor");

      if (savedMode) setMode(savedMode);
      if (savedTimers) setTimers(savedTimers);
      if (savedIsActive) setIsActive(savedIsActive);
      if (savedDurations) setDurations(savedDurations);
      if (savedMood) setMood(savedMood);
      if (savedBackgroundColor) setBackgroundColor(savedBackgroundColor);
    }
  }, []);

  const updateTimeStudied = async (newTime) => {
    if (user) {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        timeStudied: newTime,
      });
    }
  };

  const toggleTimer = async () => {
    if (isActive) {
      // Timer is being paused
      if (mode === TIMER_MODES.POMODORO) {
        await updateTimeStudied(timeStudiedRef.current);
      }
    }

    if (user) {
      const userRef = doc(db, "users", user.id);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const updates = {};
      if (userData.name !== user.fullName) {
        updates.name = user.fullName;
      }
      if (userData.photoUrl !== user.imageUrl) {
        updates.photoUrl = user.imageUrl;
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(userRef, {
          ...updates,
          lastActive: new Date().toISOString(),
        });
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

  const switchMode = (newMode) => {
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDurationChange = (e, timerKey) => {
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

  const handleMoodSubmit = (newMood) => {
    setMood(newMood);
    setShowMoodInput(false);
    handleMood(newMood);
    playAudio(newMood);
  };

  const playAudio = (currentMood) => {
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

  const handleMood = (currentMood) => {
    let action = "";
    let newBackgroundColor = backgroundColor;

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
        break;
      case MOODS.ENERGETIC:
        action =
          "Extended work sessions to capitalize on your energy. Upbeat background music enabled.";
        setDurations((prev) => ({
          ...prev,
          [TIMER_MODES.POMODORO]: 40,
          [TIMER_MODES.SHORT_BREAK]: 5,
        }));
        newBackgroundColor = "#e6ffe6";
        break;
      case MOODS.BLOCKED:
        action =
          "Taking a break to clear your mind. Consider a quick walk or meditation.";
        newBackgroundColor = "#ffdddd";
        break;
      default:
        action =
          "Timer settings unchanged. Remember to adjust your environment for optimal productivity.";
    }
    setMoodAction(action);
    setBackgroundColor(newBackgroundColor);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
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
                onClick={() => switchMode(timerMode)}
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
                    {key.replace(/_/g, " ").toUpperCase()} Duration (minutes)
                  </label>
                  <input
                    type="range"
                    id={key}
                    min="1"
                    max="60"
                    value={value}
                    onChange={(e) => handleDurationChange(e, key)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {value} minutes
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowMoodInput((prev) => !prev)}
            className="w-full mb-4 py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Select Mood
          </button>
          {showMoodInput && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.values(MOODS).map((moodOption) => (
                <button
                  key={moodOption}
                  onClick={() => handleMoodSubmit(moodOption)}
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
          <div className="text-center text-sm text-gray-500">
            Total Time Studied: {formatTime(timeStudied)}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
