
import React, { useState, useRef } from 'react';
import { MusicIcon, PlayIcon, PauseIcon } from './Icons';

const MusicPlayer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(file);
        audioRef.current.play().then(() => setIsPlaying(true));
      }
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <div className="w-full max-w-md p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex items-center justify-between">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="p-2 bg-purple-500/20 rounded-full">
            <MusicIcon />
        </div>
        <p className="truncate text-sm text-gray-300">
          {selectedFile ? selectedFile.name : 'Play local music'}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
         {selectedFile && (
            <button onClick={togglePlayPause} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
         )}
        <input
            type="file"
            accept="audio/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
        />
        <button onClick={handleSelectFileClick} className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            Select
        </button>
      </div>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
};

export default MusicPlayer;
