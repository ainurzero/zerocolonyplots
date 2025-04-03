import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import LandGrid from 'components/LandGrid';
import SearchPanel from 'components/SearchPanel';
import DonationBanner from 'components/DonationBanner';
import { Land } from 'types';
import 'styles/index.css';

const App: React.FC = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [filteredLands, setFilteredLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true); // Dark mode by default
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  // Toggle dark/light theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${process.env.PUBLIC_URL}/data/lands.json`);
        // Преобразуем формат данных из JSON в формат, который ожидает наше приложение
        const formattedLands = response.data.map((land: any) => ({
          id: land.id,
          isSold: land.isSold === "True",
          owner: land.owner === "None" ? undefined : land.owner,
          coordinates: {
            longitude: {
              min: parseFloat(land.coord.long.min),
              max: parseFloat(land.coord.long.max)
            },
            latitude: {
              min: parseFloat(land.coord.lat.min),
              max: parseFloat(land.coord.lat.max)
            }
          }
        }));
        
        setLands(formattedLands);
        setFilteredLands(formattedLands);
        setLoading(false);
        
        // Set last updated time
        updateLastUpdatedTime();
        
        // Set interval to update every 5 minutes
        const intervalId = setInterval(() => {
          updateLastUpdatedTime();
        }, 5 * 60 * 1000);
        
        return () => clearInterval(intervalId);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  // Update the last updated time
  const updateLastUpdatedTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setLastUpdated(`${hours}:${minutes}`);
  };

  // Memoized search function
  const handleSearch = useCallback((results: Land[]) => {
    setFilteredLands(results);
  }, []);

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white transition-colors duration-200`}>
      
      <div className="w-full">
        <DonationBanner />
      </div>
      
      <header className="bg-white/90 dark:bg-slate-800/90 shadow-md py-4 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-[1600px]">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f85266] to-[#b243a7] font-azonix">
              ZERO COLONY EXPLORER
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Updated at {lastUpdated}
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-1">
            <SearchPanel lands={lands} onSearchResults={handleSearch} />
          </div>
          <div className="lg:col-span-4">
            <LandGrid lands={filteredLands} loading={loading} />
          </div>
        </div>

        <div className="mt-10 mb-10 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Mars colonization project. All land plots are unique NFTs on the blockchain.</p>
          <p className="mt-1">Data updated every 5 minutes.</p>
        </div>
      </div>
      
      <div className="w-full">
        <DonationBanner />
      </div>
    </div>
  );
};

export default App; 