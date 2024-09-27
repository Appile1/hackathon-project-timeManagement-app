'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import './pomodoro.css';

const PomodoroTimer = () => {
  const [mode, setMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    switch(mode) {
      case 'pomodoro':
        setTimeLeft(25 * 60);
        break;
      case 'shortBreak':
        setTimeLeft(5 * 60);
        break;
      case 'longBreak':
        setTimeLeft(15 * 60);
        break;
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    switch(newMode) {
      case 'pomodoro':
        setTimeLeft(25 * 60);
        break;
      case 'shortBreak':
        setTimeLeft(5 * 60);
        break;
      case 'longBreak':
        setTimeLeft(15 * 60);
        break;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pomodoro-container">
      <div className="timer-display">{formatTime(timeLeft)}</div>
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
    </div>
  );
};

export default PomodoroTimer;