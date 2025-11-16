import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = (initialSeconds: number) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  // FIX: Changed NodeJS.Timeout to number, as setInterval in the browser returns a number.
  const timerRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (!isActive) {
      setTimeLeft(initialSeconds);
    }
    setIsActive(true);
    setIsRunning(true);
    setIsCompleted(false);
  }, [initialSeconds, isActive]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTimeLeft(initialSeconds);
    setIsActive(false);
    setIsRunning(false);
    setIsCompleted(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsCompleted(true);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if(!isActive) {
      setTimeLeft(initialSeconds);
    }
  }, [initialSeconds, isActive]);

  return { timeLeft, isActive, isRunning, isCompleted, start, pause, reset };
};