import React, { useState, useEffect, useCallback } from 'react';
import { SearchPanelProps } from '../types';

const SearchPanel: React.FC<SearchPanelProps> = ({ lands, onSearchResults }) => {
  const [searchType, setSearchType] = useState<string>('all');
  const [customPattern, setCustomPattern] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('id-asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Check for special number types
  const isSpecialNumber = useCallback((id: number, type: string): boolean => {
    const str = id.toString();
    
    switch (type) {
      case 'palindrome':
        // Palindrome: 12321, 1221
        return str === str.split('').reverse().join('');
      
      case 'repeating':
        // Repeating digits: 111, 2222
        return new Set(str.split('')).size === 1;
      
      case 'round':
        // Round numbers: 100, 5000, 20000
        return /^[1-9]\d*0{2,}$/.test(str);
      
      case 'mirror':
        // Mirror patterns: 12321, 456654
        const half = Math.floor(str.length / 2);
        const firstHalf = str.slice(0, half);
        const secondHalf = str.slice(str.length % 2 === 0 ? half : half + 1).split('').reverse().join('');
        return firstHalf === secondHalf;
      
      case 'combination':
        // Combinations: 1212, 123123
        if (str.length % 2 === 0) {
          const half = str.length / 2;
          return str.slice(0, half) === str.slice(half);
        }
        return false;
      
      case 'custom':
        // Custom pattern, e.g., 1*1*1
        if (!customPattern) return false;
        
        const regex = new RegExp('^' + customPattern.replace(/\*/g, '\\d') + '$');
        return regex.test(str);
      
      default:
        return true;
    }
  }, [customPattern]);

  // Apply filters
  const applyFilters = useCallback(() => {
    setIsSearching(true);
    
    // Use setTimeout to free up the UI thread
    setTimeout(() => {
      let filtered = [...lands];
      
      // Apply number type filter
      if (searchType !== 'all') {
        filtered = filtered.filter(land => isSpecialNumber(land.id, searchType));
      }
      
      // Apply status filter
      if (statusFilter === 'available') {
        filtered = filtered.filter(land => !land.isSold);
      } else if (statusFilter === 'sold') {
        filtered = filtered.filter(land => land.isSold);
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        if (sortBy === 'id-asc') return a.id - b.id;
        if (sortBy === 'id-desc') return b.id - a.id;
        return 0;
      });
      
      onSearchResults(filtered);
      setIsSearching(false);
    }, 0);
  }, [searchType, customPattern, sortBy, statusFilter, lands, isSpecialNumber, onSearchResults]);
  
  // Apply filters when data is loaded
  useEffect(() => {
    if (lands.length > 0) {
      applyFilters();
    }
  }, [lands, applyFilters]); // Include applyFilters in the dependency array

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Plot Finder
        </h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div className={`space-y-4 ${isExpanded ? '' : 'hidden md:block'}`}>
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Number Type
          </label>
          <select
            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-no-repeat bg-right pr-8"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="all">All Numbers</option>
            <option value="palindrome">Palindromes (12321)</option>
            <option value="repeating">Repeating (111, 2222)</option>
            <option value="round">Round (100, 5000)</option>
            <option value="mirror">Mirror (12321, 456654)</option>
            <option value="combination">Combinations (1212, 123123)</option>
            <option value="custom">Custom Pattern</option>
          </select>
        </div>
        
        {searchType === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              Pattern (use * for any digit)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Example: 1*1*1"
              value={customPattern}
              onChange={(e) => setCustomPattern(e.target.value)}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Example: 1*1*1 will find 10101, 12121, etc.
            </p>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Status
          </label>
          <select
            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-no-repeat bg-right pr-8"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
            Sort By
          </label>
          <select
            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-no-repeat bg-right pr-8"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="id-asc">ID (Ascending)</option>
            <option value="id-desc">ID (Descending)</option>
          </select>
        </div>

        <div className="pt-2">
          <button 
            onClick={() => applyFilters()}
            disabled={isSearching}
            className={`w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors ${isSearching ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isSearching ? 'Searching...' : 'Search Plots'}
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-xs text-slate-600 dark:text-slate-400">
          <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">How to use:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Choose number type to find special combinations</li>
            <li>Use status filter to show only available or sold plots</li>
            <li>Create custom patterns using * for any digit</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel; 