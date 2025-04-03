import React from 'react';
import { StatsPanelProps } from '../types';

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white/90 dark:bg-slate-800/90 rounded-lg shadow-sm p-3 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="animate-pulse h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="animate-pulse h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 rounded-lg shadow-sm p-3 backdrop-blur-sm">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Total Plots:
          </div>
          <div className="text-sm font-bold text-slate-800 dark:text-white">
            {stats.total.toLocaleString()}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Sold:</span>
            <span className="ml-1 text-sm font-bold text-slate-800 dark:text-white">{stats.sold.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Available:</span>
            <span className="ml-1 text-sm font-bold text-slate-800 dark:text-white">{stats.available.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#f85266] to-[#b243a7]" 
                style={{ width: `${stats.soldPercentage}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              {stats.soldPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel; 