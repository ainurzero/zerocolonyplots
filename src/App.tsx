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
        const response = await axios.get(`https://zero.cryptosbp.ru:8443/lands.json`);
        // Преобразуем формат данных из JSON в формат, который ожидает наше приложение
        const formattedLands = response.data.lands.map((land: any) => ({
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
        
        // Set last updated time from the file
        if (response.data.updateTime) {
          const date = new Date(response.data.updateTime);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          setLastUpdated(`${hours}:${minutes} UTC`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SearchPanel lands={lands} onSearchResults={handleSearch} />
          </div>
          <div className="lg:col-span-3">
            <LandGrid lands={filteredLands} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App; 