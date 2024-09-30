'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Smile } from 'lucide-react';
import './pomodoro.css'
import useSound from 'use-sound';

const TIMER_MODES = {
  POMODORO: 'pomodoro',
  SHORT_BREAK: 'shortBreak',
  LONG_BREAK: 'longBreak',
};

const MOODS = {
  FOCUSED: 'focused',
  DISTRACTED: 'distracted',
  ENERGETIC: 'energetic',
  TIRED: 'tired',
  STRESSED: 'stressed',
  RELAXED: 'relaxed',
  MOTIVATED: 'motivated',
  UNMOTIVATED: 'unmotivated',
  CREATIVE: 'creative',
  BLOCKED: 'blocked',
};

const PomodoroTimer = () => {
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
  const [mood, setMood] = useState('');
  const [showMoodInput, setShowMoodInput] = useState(false);
  const [showDurationSettings, setShowDurationSettings] = useState(false);
  const [moodAction, setMoodAction] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ef4444');

  const [playSound, {stop: stopSound}] = useSound("/audio.mp3");

  useEffect(() => {
    let interval = null;
    if (isActive && timers[mode] > 0) {
      interval = setInterval(() => {
        setTimers(prevTimers => ({
          ...prevTimers,
          [mode]: prevTimers[mode] - 1
        }));
      }, 1000);
    } else if (timers[mode] === 0) {
      playAudio()
      setIsActive(false);
      
    }
    return () => clearInterval(interval);
  }, [isActive, mode, timers, playSound]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mode', mode);
      localStorage.setItem('timers', JSON.stringify(timers));
      localStorage.setItem('isActive', isActive.toString());
      localStorage.setItem('durations', JSON.stringify(durations));
      localStorage.setItem('mood', mood);
      localStorage.setItem('backgroundColor', backgroundColor);
    }
  }, [mode, timers, isActive, durations, mood, backgroundColor]);
 
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('mode');
      const savedTimers = JSON.parse(localStorage.getItem('timers'));
      const savedIsActive = localStorage.getItem('isActive') === 'true';
      const savedDurations = JSON.parse(localStorage.getItem('durations'));
      const savedMood = localStorage.getItem('mood');
      const savedBackgroundColor = localStorage.getItem('backgroundColor');

      if (savedMode) setMode(savedMode);
      if (savedTimers) setTimers(savedTimers);
      if (savedIsActive) setIsActive(savedIsActive);
      if (savedDurations) setDurations(savedDurations);
      if (savedMood) setMood(savedMood);
      if (savedBackgroundColor) setBackgroundColor(savedBackgroundColor);
    }
  }, []);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    stop()
    setIsActive(false);
    setTimers(prevTimers => ({
      ...prevTimers,
      [mode]: durations[mode] * 60
    }));
  };

  const switchMode = (newMode) => {
    if (mode !== newMode) {
      setMode(newMode);
      setIsActive(false);
    }
  };

  function playAudio(){

    playSound()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDurationChange = (e, timerKey) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setDurations(prevDurations => ({
        ...prevDurations,
        [timerKey]: value
      }));
      setTimers(prevTimers => ({
        ...prevTimers,
        [timerKey]: value * 60
      }));
    }
  };

  const handleMoodSubmit = (newMood) => {
    setMood(newMood);
    setShowMoodInput(false);
    handleMood(newMood);
  };

  const handleMood = (currentMood) => {
    let action = '';
    let newBackgroundColor = backgroundColor;

    switch(currentMood) {
      case MOODS.FOCUSED:
        action = "Playing ambient sounds to maintain your focus. Timer settings optimized for deep work.";
        setDurations(prev => ({...prev, [TIMER_MODES.POMODORO]: 30, [TIMER_MODES.SHORT_BREAK]: 5}));
        newBackgroundColor = '#e6f3ff';
        break;
      case MOODS.DISTRACTED:
        action = "Enabling website blocker for common distractions. Shortened work sessions to help regain focus.";
        setDurations(prev => ({...prev, [TIMER_MODES.POMODORO]: 15, [TIMER_MODES.SHORT_BREAK]: 3}));
        newBackgroundColor = '#fff2e6';
        break;
      case MOODS.ENERGETIC:
        action = "Extended work sessions to capitalize on your energy. Upbeat background music enabled.";
        setDurations(prev => ({...prev, [TIMER_MODES.POMODORO]: 40, [TIMER_MODES.SHORT_BREAK]: 5}));
        newBackgroundColor = '#e6ffe6';
        break;
      case MOODS.TIRED:
        action = "Shortened work sessions with longer breaks. Gentle reminder to stay hydrated.";
        setDurations(prev => ({...prev, [TIMER_MODES.POMODORO]: 20, [TIMER_MODES.SHORT_BREAK]: 10}));
        newBackgroundColor = '#f3e6ff';
        break;
      case MOODS.STRESSED:
        action = "Playing calming music. Adjusted timer for more frequent breaks. Remember to take deep breaths.";
        setDurations(prev => ({...prev, [TIMER_MODES.POMODORO]: 20, [TIMER_MODES.SHORT_BREAK]: 7}));
        newBackgroundColor = '#e6fff2';
        break;
      case MOODS.RELAXED:
        action = "Gentle background sounds enabled. Timer set for balanced work and break periods.";
        setDurations(prev => ({...prev, [TIMER_MODES.POMODORO]: 25, [TIMER_MODES.SHORT_BREAK]: 5}));
        newBackgroundColor = '#f0f8ff';
        break;
      case MOODS.MOTIVATED:
        action = "Longer work sessions with short, energizing breaks. Motivational quotes enabled between sessions.";
        setDurations(prev => ({...prev, [TIMER_MODES.POMODORO]: 35, [TIMER_MODES.SHORT_BREAK]: 3}));
        newBackgroundColor = '#fff5e6';
        break;
      case MOODS.UNMOTIVATED:
        action = "Shorter, manageable work sessions. Encouraging messages and task breakdown suggestions enabled.";
        setDurations(prev => ({...prev, [TIMER_MODES.POMODORO]: 15, [TIMER_MODES.SHORT_BREAK]: 5}));
        newBackgroundColor = '#ffe6e6';
        break;
      case MOODS.CREATIVE:
        action = "Extended work sessions with visual inspiration prompts. Background soundscapes for creativity enabled.";
        setDurations(prev => ({...prev, [TIMER_MODES.POMODORO]: 45, [TIMER_MODES.SHORT_BREAK]: 10}));
        newBackgroundColor = '#e6f9ff';
        break;
      case MOODS.BLOCKED:
        action = "Short work sprints with idea generation prompts during breaks. Suggestion: Try a change of environment.";
        setDurations(prev => ({...prev, [TIMER_MODES.POMODORO]: 10, [TIMER_MODES.SHORT_BREAK]: 5}));
        newBackgroundColor = '#f2f2f2';
        break;
      default:
        action = "Timer settings unchanged. Remember to adjust your environment for optimal productivity.";
    }
    setMoodAction(action);
    setBackgroundColor(newBackgroundColor);
  };

  return (
    <div className="pomodoro-container" style={{ backgroundColor }}>
      <div className="timer-display">{formatTime(timers[mode])}</div>
      <div className="button-container">
        <button 
          onClick={() => switchMode(TIMER_MODES.POMODORO)}
          className={`timer-button ${mode === TIMER_MODES.POMODORO ? 'active' : ''}`}
        >
          Pomodoro
        </button>
        <button 
          onClick={() => switchMode(TIMER_MODES.SHORT_BREAK)}
          className={`timer-button ${mode === TIMER_MODES.SHORT_BREAK ? 'active' : ''}`}
        >
          Short Break
        </button>
        <button 
          onClick={() => switchMode(TIMER_MODES.LONG_BREAK)}
          className={`timer-button ${mode === TIMER_MODES.LONG_BREAK ? 'active' : ''}`}
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
        <Settings size={24} className="mr-2" />
        Set Durations
      </button>
      {showDurationSettings && (
        <div className="duration-settings">
          {Object.entries(durations).map(([key, value]) => (
            <div key={key} className="duration-input">
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              <input
                id={key}
                type="number"
                value={value}
                onChange={(e) => handleDurationChange(e, key)}
                min="1"
              />
            </div>
          ))}
        </div>
      )}
      <button onClick={() => setShowMoodInput(!showMoodInput)} className="mood-button" id="mood-btn">
        <Smile size={24} className="mr-2" />
        Set Mood
      </button>
      {showMoodInput && (
        <div className="mood-form">
          <select onChange={(e) => handleMoodSubmit(e.target.value)} value={mood} className="mood-input">
            <option value="">Select your mood</option>
            {Object.entries(MOODS).map(([key, value]) => (
              <option key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}
      {moodAction && (
        <div className="mood-display">
          <h3>Mood: {mood}</h3>
          <p>{moodAction}</p>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;