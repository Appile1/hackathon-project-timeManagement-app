'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, StopCircle } from 'lucide-react';
import './pomodoro.css';
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

  const [playSound] = useSound("/audio.mp3");
  const [playFocusedSound, { stop: stopFocusedSound }] = useSound("/Focused.mp3");
  const [playEnergeticSound, { stop: stopEnergeticSound }] = useSound("/Energetic.mp3");
  const [playBlockedSound, { stop: stopBlockedSound }] = useSound("/Blocked.mp3");
  const [playTiredSound, { stop: stopTiredSound }] = useSound("/Tired.mp3");
  const [playStressedSound, { stop: stopStressedSound }] = useSound("/Stressed.mp3");
  const [playRelaxedSound, { stop: stopRelaxedSound }] = useSound("/Relaxed.mp3");
  const [playMotivatedSound, { stop: stopMotivatedSound }] = useSound("/Motivated.mp3");
  const [playUnmotivatedSound, { stop: stopUnmotivatedSound }] = useSound("/Unmotivated.mp3");
  const [playCreativeSound, { stop: stopCreativeSound }] = useSound("/Creative.mp3");
  const [playDistractedSound, { stop: stopDistractedSound }] = useSound("/Distracted.mp3");

  const stopAllSounds = () => {
    // Stop all sounds
    stopFocusedSound();
    stopEnergeticSound();
    stopBlockedSound();
    stopTiredSound();
    stopStressedSound();
    stopRelaxedSound();
    stopMotivatedSound();
    stopUnmotivatedSound();
    stopCreativeSound();
    stopDistractedSound();
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timers[mode] > 0) {
      interval = setInterval(() => {
        setTimers(prevTimers => ({
          ...prevTimers,
          [mode]: prevTimers[mode] - 1,
        }));
      }, 1000);
    } else if (timers[mode] === 0) {
      setIsActive(false);
      playSound();
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
    setIsActive(prev => !prev);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimers(prevTimers => ({
      ...prevTimers,
      [mode]: durations[mode] * 60,
    }));
  };

  const switchMode = (newMode) => {
    if (mode !== newMode) {
      setMode(newMode);
      setIsActive(false);
      setTimers(prevTimers => ({
        ...prevTimers,
        [newMode]: durations[newMode] * 60,
      }));
    }
  };

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
        [timerKey]: value,
      }));
      setTimers(prevTimers => ({
        ...prevTimers,
        [timerKey]: value * 60,
      }));
    }
  };

  const handleMoodSubmit = (newMood) => {
    setMood(newMood);
    setShowMoodInput(false);
    handleMood(newMood);
    playAudio(newMood); // Play sound when mood is selected
  };

  const playAudio = (currentMood) => {
    stopAllSounds(); // Stop all sounds before playing a new one
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
    let action = '';
    let newBackgroundColor = backgroundColor;

    switch (currentMood) {
      case MOODS.FOCUSED:
        action = "Playing ambient sounds to maintain your focus. Timer settings optimized for deep work.";
        setDurations(prev => ({ ...prev, [TIMER_MODES.POMODORO]: 30, [TIMER_MODES.SHORT_BREAK]: 5 }));
        newBackgroundColor = '#e6f3ff';
        break;
      case MOODS.ENERGETIC:
        action = "Extended work sessions to capitalize on your energy. Upbeat background music enabled.";
        setDurations(prev => ({ ...prev, [TIMER_MODES.POMODORO]: 40, [TIMER_MODES.SHORT_BREAK]: 5 }));
        newBackgroundColor = '#e6ffe6';
        break;
      case MOODS.BLOCKED:
        action = "Taking a break to clear your mind. Consider a quick walk or meditation.";
        newBackgroundColor = '#ffdddd';
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
        {Object.values(TIMER_MODES).map((timerMode) => (
          <button
            key={timerMode}
            onClick={() => switchMode(timerMode)}
            className={`timer-button ${mode === timerMode ? 'active' : ''}`}
          >
            {timerMode.replace(/_/g, ' ').toUpperCase()}
          </button>
        ))}
      </div>
      <div className="button-container">
        <button onClick={toggleTimer} className="control-button">
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={resetTimer} className="control-button">
          <RotateCcw size={24} />
        </button>
        <button onClick={stopAllSounds} className="control-button">
          <StopCircle size={24} />
          Stop Music
        </button>
      </div>
      <button onClick={() => setShowDurationSettings(prev => !prev)} className="settings-button">
        <Settings size={24} className="mr-2" />
        Set Durations
      </button>
      {showDurationSettings && (
        <div className="duration-settings">
          {Object.entries(durations).map(([key, value]) => (
            <label key={key}>
              {key.replace(/_/g, ' ').toUpperCase()} Duration:
              <input
                type="number"
                value={value}
                onChange={(e) => handleDurationChange(e, key)}
              />
            </label>
          ))}
        </div>
      )}
      <div className="mood-selection">
        <button onClick={() => setShowMoodInput(prev => !prev)} className="mood-button">
          Select Mood
        </button>
        {showMoodInput && (
          <div className="mood-input">
            {Object.values(MOODS).map((moodOption) => (
              <button
                key={moodOption}
                onClick={() => handleMoodSubmit(moodOption)}
                className="mood-option"
              >
                {moodOption}
              </button>
            ))}
          </div>
        )}
        {mood && <div className="mood-action">{moodAction}</div>}
      </div>
    </div>
  );
};

export default PomodoroTimer;
