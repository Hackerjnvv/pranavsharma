
import React from 'react';
import Header from './components/Header';
import Timer from './components/Timer';
import MusicPlayer from './components/MusicPlayer';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-800 text-gray-100 flex flex-col items-center p-4 selection:bg-cyan-300 selection:text-cyan-900">
      <div className="w-full max-w-2xl mx-auto">
        <Header />
        <main className="mt-8 flex flex-col items-center gap-8">
          <Timer />
          <MusicPlayer />
        </main>
      </div>
      <Chatbot />
    </div>
  );
};

export default App;
