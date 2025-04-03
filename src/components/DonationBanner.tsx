import React, { useState } from 'react';

const DonationBanner: React.FC = () => {
  const ethAddress = '0xb907d4d3E256b855e7BDDe1b29419562E9D1A65c';
  const [copied, setCopied] = useState(false);
  
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(ethAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Уведомление исчезнет через 2 секунды
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white p-4 shadow-lg w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-sm md:text-base">Support the developer — every little donation helps bring more updates!</p>
        </div>
        
        <div className="flex items-center relative">
          <span className="hidden md:inline-block text-xs md:text-sm font-mono bg-black/30 px-2 py-1 rounded mr-2">{ethAddress}</span>
          <span className="md:hidden inline-block text-xs md:text-sm font-mono bg-black/30 px-2 py-1 rounded mr-2">{ethAddress.slice(0, 6)}...{ethAddress.slice(-4)}</span>
          
          <button 
            onClick={copyAddressToClipboard}
            className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded text-xs transition-colors flex items-center justify-center"
            title="Copy ETH Address"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      {copied && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 bg-green-800 text-white text-sm py-1.5 px-3 rounded shadow-lg z-50">
          Address copied!
        </div>
      )}
    </div>
  );
};

export default DonationBanner; 