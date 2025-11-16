
import React, { useState, useEffect } from 'react';
import { EXAM_DATE } from '../constants';
import { CalendarIcon } from './Icons';

const Header: React.FC = () => {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const calculateDaysLeft = () => {
      const today = new Date();
      const differenceInTime = EXAM_DATE.getTime() - today.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      setDaysLeft(differenceInDays);
    };

    calculateDaysLeft();
    const interval = setInterval(calculateDaysLeft, 1000 * 60 * 60 * 24); // Update once a day
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full text-center">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
        StudyTime
      </h1>
      <p className="text-gray-400 mt-2">CBSE Class 10 Exam Preparation</p>
      <div className="mt-4 inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-sm">
        <CalendarIcon />
        <span>{daysLeft} days until your exam on {EXAM_DATE.toLocaleDateString('en-GB')}</span>
      </div>
    </header>
  );
};

export default Header;
