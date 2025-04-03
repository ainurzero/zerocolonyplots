import React, { useMemo, useState } from 'react';
import { LandCardProps } from '../types';
import generateLandImage from '../utils/generateLandImage';
import LandModal from '../components/LandModal';

const LandCard: React.FC<LandCardProps> = ({ land, onClick }) => {
  // Generate image based on plot ID
  const imageUrl = useMemo(() => generateLandImage(land.id), [land.id]);
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-2 sm:p-4 h-full overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow cursor-pointer"
        onClick={handleClick}
      >
        <div className="mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
            #{land.id}
          </h3>
        </div>
        
        <div className="aspect-square overflow-hidden rounded-lg mb-2 sm:mb-3">
          <img 
            src={imageUrl} 
            alt={`Plot #${land.id}`} 
            className="w-full h-full object-cover" 
          />
        </div>
        
        {/* Coordinates */}
        <div className="mb-2 sm:mb-3 bg-slate-100 dark:bg-slate-700 p-1 sm:p-2 rounded-md text-2xs sm:text-xs">
          <div className="grid grid-cols-2 gap-1 mb-1">
            <span className="text-slate-500 dark:text-slate-400">Longitude:</span>
            <div className="font-mono text-slate-800 dark:text-slate-200 text-right whitespace-nowrap overflow-hidden text-ellipsis">
              {land.coordinates.longitude.min.toFixed(2)}° .. {land.coordinates.longitude.max.toFixed(2)}°
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <span className="text-slate-500 dark:text-slate-400">Latitude:</span>
            <div className="font-mono text-slate-800 dark:text-slate-200 text-right whitespace-nowrap overflow-hidden text-ellipsis">
              {land.coordinates.latitude.min.toFixed(2)}° .. {land.coordinates.latitude.max.toFixed(2)}°
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`px-1 py-0.5 sm:px-2 sm:py-1 rounded-md text-2xs sm:text-xs font-medium ${land.isSold ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
            {land.isSold ? 'SOLD' : 'AVAILABLE'}
          </span>
          {land.owner && (
            <span className="text-2xs sm:text-xs text-slate-500 dark:text-slate-400 truncate font-mono" title={land.owner}>
              {land.owner.slice(0, 6)}...{land.owner.slice(-4)}
            </span>
          )}
        </div>
      </div>

      {/* Модальное окно отображается только если не передан обработчик onClick */}
      {showModal && !onClick && (
        <LandModal
          land={land}
          imageUrl={imageUrl}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default LandCard; 