import React, { useEffect, useRef } from 'react';
import { LandModalProps } from '../types';

const LandModal: React.FC<LandModalProps> = ({ land, imageUrl, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Закрываем модальное окно при нажатии Escape и скроллим к модальному окну
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);

    // Блокируем прокрутку страницы
    document.body.style.overflow = 'hidden';
    
    // Скроллим к началу модального окна
    if (modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // Перенаправление на официальный сайт Zero Colony
  const handleBuy = () => {
    if (land.isSold) return;
    window.open('https://zerocolony.fun/', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/75 transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="flex items-start justify-center min-h-screen p-4 pt-16 sm:pt-0 sm:items-center">
        <div 
          ref={modalRef}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 px-6 py-4 bg-white dark:bg-slate-800 z-20">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f85266] to-[#b243a7]">
              Plot #{land.id}
            </h3>
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image */}
              <div>
                <div className="aspect-square overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                  <img 
                    src={imageUrl} 
                    alt={`Plot #${land.id}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
              
              {/* Details */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <h4 className="text-lg font-bold mb-3 text-slate-800 dark:text-white">Coordinates</h4>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-slate-500 dark:text-slate-400">Longitude Min:</span>
                      <span className="font-mono text-right">{land.coordinates.longitude.min.toFixed(6)}°</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-slate-500 dark:text-slate-400">Longitude Max:</span>
                      <span className="font-mono text-right">{land.coordinates.longitude.max.toFixed(6)}°</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-slate-500 dark:text-slate-400">Latitude Min:</span>
                      <span className="font-mono text-right">{land.coordinates.latitude.min.toFixed(6)}°</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-slate-500 dark:text-slate-400">Latitude Max:</span>
                      <span className="font-mono text-right">{land.coordinates.latitude.max.toFixed(6)}°</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                  <h4 className="text-lg font-bold mb-3 text-slate-800 dark:text-white">Status</h4>
                  
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-md font-medium ${land.isSold ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                      {land.isSold ? 'SOLD' : 'AVAILABLE'}
                    </span>
                    
                    {land.owner && (
                      <div className="ml-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">Owner:</div>
                        <div className="font-mono text-slate-800 dark:text-slate-200 break-all">
                          {land.owner}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Buy section */}
            {!land.isSold && (
              <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="col-span-2">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">Purchase this plot</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      Price: <span className="font-bold text-green-600 dark:text-green-400">0.009 ETH</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Visit the official website to mint your NFT
                    </p>
                  </div>
                  <div className="text-right">
                    <a
                      href="https://zerocolony.fun/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2 font-bold text-white rounded-lg bg-gradient-to-r from-[#f85266] to-[#b243a7] hover:from-[#f9667a] hover:to-[#bf57b0] transition-colors"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandModal; 