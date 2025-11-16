import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTimer } from '../hooks/useTimer';
import ProgressBar from './ProgressBar';
import MotivationCard from './MotivationCard';
import { PlayIcon, PauseIcon, ResetIcon } from './Icons';
import { getMotivationMessage } from '../services/geminiService';
import { MOTIVATION_INTERVAL_MINUTES } from '../constants';

const sessionOptions = [25, 45, 60];

const Timer: React.FC = () => {
  const [sessionLength, setSessionLength] = useState(25);
  const [customLength, setCustomLength] = useState('30');
  const [goal, setGoal] = useState('');
  
  const initialSeconds = useMemo(() => {
    const duration = sessionLength > 0 ? sessionLength : parseInt(customLength) || 0;
    return duration * 60;
  }, [sessionLength, customLength]);

  const { timeLeft, isActive, isRunning, isCompleted, start, pause, reset } = useTimer(initialSeconds);
  const [motivation, setMotivation] = useState<string | null>(null);
  const [isLoadingMotivation, setIsLoadingMotivation] = useState(false);

  const handleReset = useCallback(() => {
    reset();
    setGoal('');
  }, [reset]);
  
  const fetchMotivation = useCallback(async () => {
    setIsLoadingMotivation(true);
    try {
      const message = await getMotivationMessage();
      setMotivation(message);
    } catch (error) {
      console.error("Failed to fetch motivation:", error);
      setMotivation("Keep pushing forward! You've got this.");
    } finally {
      setIsLoadingMotivation(false);
    }
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0 && timeLeft < initialSeconds && timeLeft % (MOTIVATION_INTERVAL_MINUTES * 60) === 0) {
      fetchMotivation();
    }
  }, [timeLeft, isRunning, initialSeconds, fetchMotivation]);
  
  const progress = initialSeconds > 0 ? (timeLeft / initialSeconds) * 100 : 0;
  const isStartDisabled = !goal || (sessionLength === 0 && (!customLength || parseInt(customLength) <= 0));

  return (
    <div className="w-full max-w-md p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/20">
      {!isActive ? (
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-sm text-gray-400">Set study session (minutes)</label>
            <div className="grid grid-cols-4 gap-3 mt-2">
              {sessionOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSessionLength(opt)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 text-sm ${sessionLength === opt ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {opt}
                </button>
              ))}
               <button
                  onClick={() => setSessionLength(0)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 text-sm ${sessionLength === 0 ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  Custom
                </button>
            </div>
             {sessionLength === 0 && (
                <div className="mt-3">
                    <input
                        type="number"
                        value={customLength}
                        onChange={(e) => setCustomLength(e.target.value)}
                        placeholder="Mins"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                    />
                </div>
             )}
          </div>
          <div>
            <label className="text-sm text-gray-400">What's your goal for this session?</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., 'Revise Chapter 3 in Maths'"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>
          <button
            onClick={() => start()}
            disabled={isStartDisabled}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <PlayIcon /> Start Studying
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className={`relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center ${isCompleted ? 'session-complete-animation' : ''}`}>
            <ProgressBar progress={progress} />
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-bold tracking-tighter">
                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:
                {(timeLeft % 60).toString().padStart(2, '0')}
              </span>
              {isCompleted ? (
                 <p className="font-bold text-lg text-cyan-400 mt-2">Session Complete!</p>
              ) : (
                <p className="text-gray-400 mt-2 text-center max-w-[200px] break-words">{goal || 'Study Session'}</p>
              )}
            </div>
          </div>

          {isCompleted ? (
             <button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity duration-300 flex items-center justify-center gap-2"
            >
              <ResetIcon /> Start New Session
            </button>
          ) : (
            <div className="flex gap-4">
                <button
                onClick={isRunning ? pause : start}
                className="w-32 bg-cyan-500/80 text-white font-bold py-3 rounded-xl hover:bg-cyan-500 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                {isRunning ? <PauseIcon /> : <PlayIcon />}
                {isRunning ? 'Pause' : 'Resume'}
                </button>
                <button
                onClick={handleReset}
                className="w-32 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                <ResetIcon /> Reset
                </button>
            </div>
          )}
        </div>
      )}
      <MotivationCard message={motivation} isLoading={isLoadingMotivation} onDismiss={() => setMotivation(null)} />
    </div>
  );
};

export default Timer;