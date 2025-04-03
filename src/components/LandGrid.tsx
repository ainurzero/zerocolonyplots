import React, { useState, useEffect, useRef } from 'react';
import LandCard from '../components/LandCard';
import LandModal from '../components/LandModal';
import { LandGridProps } from '../types';
import generateLandImage from '../utils/generateLandImage';

const LandGrid: React.FC<LandGridProps> = ({ lands, loading }) => {
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [displayedLands, setDisplayedLands] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quickFilter, setQuickFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [highlight, setHighlight] = useState<boolean>(false);
  const [selectedLand, setSelectedLand] = useState<any>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Calculate total pages
  const totalPages = Math.ceil(lands.length / itemsPerPage);
  
  // Apply quick filter
  const filteredLands = React.useMemo(() => {
    if (quickFilter === 'all') return lands;
    if (quickFilter === 'available') return lands.filter(land => !land.isSold);
    if (quickFilter === 'sold') return lands.filter(land => land.isSold);
    return lands;
  }, [lands, quickFilter]);
  
  // Update displayed lands when page, itemsPerPage or filtered lands changes
  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedLands(filteredLands.slice(startIndex, endIndex));
    // Reset to page 1 if we switch filters and current page would be out of bounds
    if (page > Math.ceil(filteredLands.length / itemsPerPage)) {
      setPage(1);
    }
  }, [page, itemsPerPage, filteredLands]);
  
  // Handle page change
  const goToPage = (newPage: number) => {
    setPage(newPage);
    
    // Добавляем мягкое визуальное выделение при смене страницы
    setHighlight(true);
    setTimeout(() => {
      setHighlight(false);
    }, 500);
  };
  
  // Handle next and previous
  const goToNextPage = () => {
    if (page < totalPages) {
      goToPage(page + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (page > 1) {
      goToPage(page - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Панель с фильтрами и управлением отображением
  const controlPanel = (
    <>
      {/* Top control panel with quick filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow mb-6 p-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}
              title="Grid"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}
              title="List"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Status:</span>
            <button
              onClick={() => setQuickFilter('all')}
              className={`px-3 py-1 text-sm rounded-full ${quickFilter === 'all' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}
            >
              All
            </button>
            <button
              onClick={() => setQuickFilter('available')}
              className={`px-3 py-1 text-sm rounded-full ${quickFilter === 'available' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}
            >
              Available
            </button>
            <button
              onClick={() => setQuickFilter('sold')}
              className={`px-3 py-1 text-sm rounded-full ${quickFilter === 'sold' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}
            >
              Sold
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-no-repeat bg-right pr-8"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold text-xl text-slate-800 dark:text-white">
          {filteredLands.length} plots found
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {filteredLands.length > 0 ? `Page ${page} of ${Math.ceil(filteredLands.length / itemsPerPage)}` : ''}
        </div>
      </div>
    </>
  );

  if (filteredLands.length === 0) {
    return (
      <div>
        {controlPanel}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">No land plots found. Try changing your search filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {controlPanel}

      {viewMode === 'grid' ? (
        <div 
          ref={gridRef}
          className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 transition-all duration-300 ${highlight ? 'opacity-80 scale-[0.99]' : 'opacity-100 scale-100'}`}
        >
          {displayedLands.map((land) => (
            <LandCard 
              key={land.id} 
              land={land} 
              onClick={() => setSelectedLand(land)}
            />
          ))}
        </div>
      ) : (
        <div 
          ref={gridRef}
          className={`space-y-3 transition-all duration-300 ${highlight ? 'opacity-80 scale-[0.99]' : 'opacity-100 scale-100'}`}
        >
          {displayedLands.map((land) => {
            const imageUrl = generateLandImage(land.id);
            return (
              <div 
                key={land.id} 
                className="bg-white dark:bg-slate-800 rounded-lg shadow p-3 flex items-center gap-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedLand(land)}
              >
                <div className="w-16 h-16 overflow-hidden rounded flex-shrink-0">
                  <img src={imageUrl} alt={`Plot #${land.id}`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">#{land.id}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Long: {land.coordinates.longitude.min.toFixed(2)}° - {land.coordinates.longitude.max.toFixed(2)}°
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Lat: {land.coordinates.latitude.min.toFixed(2)}° - {land.coordinates.latitude.max.toFixed(2)}°
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${land.isSold ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                    {land.isSold ? 'SOLD' : 'AVAILABLE'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredLands.length > itemsPerPage && (
        <div className="mt-6 flex justify-center items-center space-x-4">
          <button 
            onClick={goToPrevPage} 
            disabled={page === 1}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Previous
          </button>
          
          <div className="text-slate-600 dark:text-slate-400 flex items-center">
            {Math.ceil(filteredLands.length / itemsPerPage) > 100 ? (
              <div className="flex items-center space-x-2">
                <select 
                  value={page}
                  onChange={(e) => goToPage(Number(e.target.value))}
                  className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-no-repeat bg-right pr-8"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
                >
                  {/* Первая и последняя страницы всегда доступны */}
                  <option value={1}>1</option>
                  
                  {/* Если текущая страница > 50, добавляем разделитель */}
                  {page > 50 && <option disabled>...</option>}
                  
                  {/* Показываем окно из ~100 страниц вокруг текущей страницы */}
                  {Array.from(
                    { length: Math.min(100, Math.ceil(filteredLands.length / itemsPerPage) - 2) }, 
                    (_, i) => {
                      // Вычисляем начальную страницу для окна
                      const totalPages = Math.ceil(filteredLands.length / itemsPerPage);
                      const halfWindow = 50; // Половина размера окна
                      let startPage;
                      
                      if (page <= halfWindow + 1) {
                        // Если мы ближе к началу списка
                        startPage = 2;
                      } else if (page >= totalPages - halfWindow) {
                        // Если мы ближе к концу списка
                        startPage = totalPages - 99;
                      } else {
                        // Центрируем окно вокруг текущей страницы
                        startPage = Math.max(2, page - halfWindow);
                      }
                      
                      return startPage + i;
                    }
                  ).map(pageNum => (
                    <option key={pageNum} value={pageNum}>
                      {pageNum}
                    </option>
                  ))}
                  
                  {/* Если последняя страница не входит в окно, добавляем разделитель */}
                  {page < Math.ceil(filteredLands.length / itemsPerPage) - 50 && <option disabled>...</option>}
                  
                  {/* Добавляем последнюю страницу, если в списке больше 1 страницы */}
                  {Math.ceil(filteredLands.length / itemsPerPage) > 1 && (
                    <option value={Math.ceil(filteredLands.length / itemsPerPage)}>
                      {Math.ceil(filteredLands.length / itemsPerPage)}
                    </option>
                  )}
                </select>
                
                <span>of {Math.ceil(filteredLands.length / itemsPerPage)}</span>
                
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min={1}
                    max={Math.ceil(filteredLands.length / itemsPerPage)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const pageNumber = parseInt(input.value);
                        if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredLands.length / itemsPerPage)) {
                          goToPage(pageNumber);
                        }
                      }
                    }}
                    onChange={(e) => {
                      // Предотвращаем ввод слишком больших или отрицательных значений
                      const value = parseInt(e.target.value);
                      if (isNaN(value) || value < 1) {
                        e.target.value = '1';
                      } else if (value > Math.ceil(filteredLands.length / itemsPerPage)) {
                        e.target.value = Math.ceil(filteredLands.length / itemsPerPage).toString();
                      }
                    }}
                    className="w-16 px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`1-${Math.ceil(filteredLands.length / itemsPerPage)}`}
                  />
                  <button
                    onClick={(e) => {
                      const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                      const pageNumber = parseInt(input.value);
                      if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredLands.length / itemsPerPage)) {
                        goToPage(pageNumber);
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                  >
                    Go
                  </button>
                </div>
              </div>
            ) : (
              <select 
                value={page}
                onChange={(e) => goToPage(Number(e.target.value))}
                className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-no-repeat bg-right pr-8"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
              >
                {Array.from({ length: Math.ceil(filteredLands.length / itemsPerPage) }, (_, i) => i + 1).map(pageNum => (
                  <option key={pageNum} value={pageNum}>
                    {pageNum}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <button 
            onClick={goToNextPage} 
            disabled={page === Math.ceil(filteredLands.length / itemsPerPage)}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors ${page === Math.ceil(filteredLands.length / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next
          </button>
        </div>
      )}

      {/* Модальное окно для режима списка */}
      {selectedLand && (
        <LandModal
          land={selectedLand}
          imageUrl={generateLandImage(selectedLand.id)}
          onClose={() => setSelectedLand(null)}
        />
      )}
    </div>
  );
};

export default LandGrid; 