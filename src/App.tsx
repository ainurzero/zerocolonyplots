import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import DonationBanner from 'components/DonationBanner';
import Footer from 'components/Footer';
import { Land } from 'types';
import 'styles/index.css';
import { loadCoordinationData, getLandCoordinates } from './utils/imageCoordUtils';
import PlotFinderPage from './pages/PlotFinderPage';
import OwnersPage from './pages/OwnersPage';

// Компонент для навигации
const Navigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="flex space-x-6">
      <Link
        to="/"
        className={`text-lg font-medium transition-colors ${
          location.pathname === '/' || location.pathname === ''
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#f85266] to-[#b243a7]'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'
        }`}
      >
        Plot Finder
      </Link>
      <Link
        to="/owners"
        className={`text-lg font-medium transition-colors ${
          location.pathname === '/owners'
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#f85266] to-[#b243a7]'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white'
        }`}
      >
        Owners
      </Link>
    </div>
  );
};

const App: React.FC = () => {
  const [lands, setLands] = useState<Land[]>([]);
  const [filteredLands, setFilteredLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true); // Dark mode by default
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [coordsLoaded, setCoordsLoaded] = useState<boolean>(false);

  // Статистика по участкам
  const stats = useMemo(() => {
    if (lands.length === 0) return { total: 0, sold: 0, available: 0, soldPercentage: 0 };
    
    const soldLands = lands.filter(land => land.isSold).length;
    const total = lands.length;
    const available = total - soldLands;
    const soldPercentage = Math.round((soldLands / total) * 100);
    
    return { total, sold: soldLands, available, soldPercentage };
  }, [lands]);

  // Toggle dark/light theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Загрузка данных координат и изображений
  useEffect(() => {
    const loadCoords = async () => {
      try {
        await loadCoordinationData();
        setCoordsLoaded(true);
      } catch (error) {
        console.error("Error loading coordination data:", error);
        setError(true);
      }
    };
    
    loadCoords();
  }, []);

  // Загрузка данных о землях
  useEffect(() => {
    async function fetchData() {
      try {
        // Ожидаем загрузку координат, чтобы использовать их
        if (!coordsLoaded) return;
        
        // Используем локальный файл вместо удаленного URL
        // const response = await axios.get(`/data/lands.json`);
        // Закомментированный оригинальный код загрузки данных с сервера
        const response = await axios.get(`https://zero.cryptosbp.ru:8443/lands.json`);
        
        // Преобразуем формат данных из JSON в формат, который ожидает наше приложение
        const formattedLands = response.data.lands.map((land: any) => {
          // Получаем координаты из закешированных данных
          const coordinates = getLandCoordinates(parseInt(land.id));
          
          return {
            id: parseInt(land.id),
            isSold: land.isSold === "True",
            owner: land.owner === "None" ? undefined : land.owner,
            coordinates: coordinates
          };
        });
        
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
  }, [coordsLoaded]);

  // Memoized search function
  const handleSearch = useCallback((results: Land[]) => {
    setFilteredLands(results);
  }, []);

  return (
    <HashRouter>
      <div className={`min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white transition-colors duration-200`}>
        
        <div className="w-full">
          <DonationBanner />
        </div>
        
        <header className="bg-white/90 dark:bg-slate-800/90 shadow-md py-4 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 max-w-[1600px]">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f85266] to-[#b243a7] font-azonix">
                  ZERO COLONY EXPLORER
                </h1>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="md:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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
              
              <div className="flex-1 flex flex-col md:flex-row md:justify-between items-center">
                <div className="flex-grow flex justify-center">
                  <Navigation />
                </div>
                <div className="flex items-center space-x-4 mt-2 md:mt-0">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Updated at {lastUpdated}
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="hidden md:block p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
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
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-[1600px]">
          <Routes>
            <Route path="/" element={
              <PlotFinderPage 
                lands={lands}
                filteredLands={filteredLands}
                loading={loading}
                onSearchResults={handleSearch}
                stats={stats}
              />
            } />
            <Route path="/owners" element={
              <OwnersPage 
                lands={lands}
                loading={loading}
              />
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
};

export default App; 