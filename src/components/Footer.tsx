import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/90 dark:bg-slate-800/90 shadow-md py-3 mt-8 backdrop-blur-sm">
      <div className="container mx-auto px-4 max-w-[1600px]">
        <div className="flex justify-center text-sm text-slate-600 dark:text-slate-400">
          Developed By <a 
            href="https://t.me/timwithteam" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="ml-1 font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#f85266] to-[#b243a7] hover:text-[#f85266] transition-colors"
          >
            @timwithteam
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 