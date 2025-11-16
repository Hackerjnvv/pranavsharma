
import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './Icons';

interface MotivationCardProps {
  message: string | null;
  isLoading: boolean;
  onDismiss: () => void;
}

const MotivationCard: React.FC<MotivationCardProps> = ({ message, isLoading, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Allow time for fade-out animation before dismissing
        setTimeout(onDismiss, 300); 
      }, 7000); // Display for 7 seconds

      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!isLoading && !isVisible) return null;

  return (
    <div className={`absolute top-0 left-1/2 -translate-x-1/2 mt-4 w-11/12 max-w-sm p-4 bg-gradient-to-br from-purple-600/50 to-cyan-500/50 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg transition-all duration-300 ease-in-out ${isVisible && !isLoading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className="flex items-start gap-3">
        <div className="text-yellow-300 mt-1">
          <SparklesIcon />
        </div>
        <div>
          <h4 className="font-bold text-white">Motivation Boost!</h4>
          <p className="text-sm text-gray-200 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default MotivationCard;
