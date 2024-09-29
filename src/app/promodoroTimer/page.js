'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import useSound from 'use-sound';

import './pomodoro.css';

const PomodoroTimer = () => {
  const [mode, setMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroDuration, setPomodoroDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [mood, setMood] = useState('');
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [showDurationSettings, setShowDurationSettings] = useState(false);
  const [playSound, { stop }] = useSound("/audio.mp3", { volume: 0.1 }); // Set volume to 0.1

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      playAudio();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    // Update timeLeft when mode or durations change
    switch (mode) {
      case 'pomodoro':
        setTimeLeft(pomodoroDuration * 60);
        break;
      case 'shortBreak':
        setTimeLeft(shortBreakDuration * 60);
        break;
      case 'longBreak':
        setTimeLeft(longBreakDuration * 60);
        break;
      default:
        break;
    }
  }, [mode, pomodoroDuration, shortBreakDuration, longBreakDuration]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (isActive) {
      stop(); // Stop sound if timer is paused
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    stop(); // Stop sound when resetting
    switch (mode) {
      case 'pomodoro':
        setTimeLeft(pomodoroDuration * 60);
        break;
      case 'shortBreak':
        setTimeLeft(shortBreakDuration * 60);
        break;
      case 'longBreak':
        setTimeLeft(longBreakDuration * 60);
        break;
      default:
        break;
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    stop(); // Stop sound when switching modes
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDurationChange = (e, setter) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setter(value);
    }
  };

  const handleMoodSubmit = (e) => {
    e.preventDefault();
    setShowMoodInput(false);
    // Add any additional logic here
  };

  function playAudio() {
    playSound(); // Play sound when time runs out
    setTimeout(() => {
      stop(); // Stop sound after 10 seconds
    }, 10000); // 10000 milliseconds = 10 seconds
  }

  return (
    <div className="pomodoro-container">
      <div className="timer-display" style={{ fontWeight: 'bold' }}>{formatTime(timeLeft)}</div>
      <div className="button-container">
        <button 
          onClick={() => switchMode('pomodoro')}
          className={`timer-button ${mode === 'pomodoro' ? 'active' : ''}`}
        >
          Pomodoro
        </button>
        <button 
          onClick={() => switchMode('shortBreak')}
          className={`timer-button ${mode === 'shortBreak' ? 'active' : ''}`}
        >
          Short Break
        </button>
        <button 
          onClick={() => switchMode('longBreak')}
          className={`timer-button ${mode === 'longBreak' ? 'active' : ''}`}
        >
          Long Break
        </button>
      </div>
      <div className="button-container">
        <button onClick={toggleTimer} className="control-button">
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={resetTimer} className="control-button">
          <RotateCcw size={24} />
        </button>
      </div>
      <button onClick={() => setShowDurationSettings(!showDurationSettings)} className="settings-button">
        Set Durations
      </button>
      {showDurationSettings && (
        <div className="duration-settings">
          <div className="duration-input">
            <label htmlFor="pomodoro">Pomodoro:</label>
            <input
              id="pomodoro"
              type="number"
              value={pomodoroDuration}
              onChange={(e) => handleDurationChange(e, setPomodoroDuration)}
              min="1"
            />
          </div>
          <div className="duration-input">
            <label htmlFor="shortBreak">Short Break:</label>
            <input
              id="shortBreak"
              type="number"
              value={shortBreakDuration}
              onChange={(e) => handleDurationChange(e, setShortBreakDuration)}
              min="1"
            />
          </div>
          <div className="duration-input">
            <label htmlFor="longBreak">Long Break:</label>
            <input
              id="longBreak"
              type="number"
              value={longBreakDuration}
              onChange={(e) => handleDurationChange(e, setLongBreakDuration)}
              min="1"
            />
          </div>
        </div>
      )}
      <button onClick={() => setShowMoodInput(!showMoodInput)} className="mood-button">
        What's your mood?
      </button>
      {showMoodInput && (
        <form onSubmit={handleMoodSubmit} className="mood-form">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Enter your mood..."
            className="mood-input"
          />
          <button type="submit" className="mood-submit">Submit</button>
        </form>
      )}
      {mood && <div className="mood-display">Current mood: {mood}</div>}
    </div>
  );
};

export default PomodoroTimer;
