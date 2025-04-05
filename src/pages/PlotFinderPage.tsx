import React from 'react';
import LandGrid from '../components/LandGrid';
import SearchPanel from '../components/SearchPanel';
import StatsPanel from '../components/StatsPanel';
import { Land } from '../types';

interface PlotFinderPageProps {
  lands: Land[];
  filteredLands: Land[];
  loading: boolean;
  onSearchResults: (results: Land[]) => void;
  stats: {
    total: number;
    sold: number;
    available: number;
    soldPercentage: number;
  };
}

const PlotFinderPage: React.FC<PlotFinderPageProps> = ({ 
  lands, 
  filteredLands, 
  loading, 
  onSearchResults, 
  stats 
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Plot Finder</h1>
      
      {/* Статистика по участкам */}
      <div className="mb-6">
        <StatsPanel stats={stats} isLoading={loading} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <SearchPanel lands={lands} onSearchResults={onSearchResults} />
        </div>
        <div className="lg:col-span-3">
          <LandGrid lands={filteredLands} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default PlotFinderPage; 