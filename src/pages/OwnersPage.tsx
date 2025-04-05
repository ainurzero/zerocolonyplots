import React, { useState, useEffect, useMemo } from 'react';
import { Land } from '../types';

interface Owner {
  address: string;
  landsCount: number;
  percentage: number;
}

interface OwnersPageProps {
  lands: Land[];
  loading: boolean;
}

const OwnersPage: React.FC<OwnersPageProps> = ({ lands, loading }) => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'landsCount' | 'percentage'>('landsCount');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Расчет данных о владельцах
  useEffect(() => {
    if (lands.length === 0) return;

    const ownersMap = new Map<string, number>();
    
    // Подсчет земель для каждого владельца
    lands.forEach(land => {
      if (land.owner) {
        const count = ownersMap.get(land.owner) || 0;
        ownersMap.set(land.owner, count + 1);
      }
    });
    
    // Преобразование Map в массив объектов
    const totalLands = lands.length;
    const ownersArray = Array.from(ownersMap.entries()).map(([address, landsCount]) => ({
      address,
      landsCount,
      percentage: parseFloat(((landsCount / totalLands) * 100).toFixed(2))
    }));
    
    setOwners(ownersArray);
  }, [lands]);

  // Фильтрация и сортировка
  const filteredAndSortedOwners = useMemo(() => {
    // Фильтрация по поисковому запросу
    const filtered = searchTerm 
      ? owners.filter(owner => owner.address.toLowerCase().includes(searchTerm.toLowerCase()))
      : owners;
    
    // Сортировка
    return [...filtered].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      
      if (sortOrder === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  }, [owners, searchTerm, sortBy, sortOrder]);

  // Обработчики для сортировки
  const handleSortChange = (value: 'landsCount' | 'percentage') => {
    if (sortBy === value) {
      // Если уже сортируем по этому полю, меняем порядок
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Если выбрано новое поле, устанавливаем его и сбрасываем порядок на desc
      setSortBy(value);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-1/3 mb-6"></div>
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-md w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Land Owners</h1>
      
      {/* Фильтры и поиск */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              Search by address
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search address..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
              Sort by
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleSortChange('landsCount')}
                className={`px-4 py-2 rounded-md ${
                  sortBy === 'landsCount' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
                }`}
              >
                Number of Lands {sortBy === 'landsCount' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSortChange('percentage')}
                className={`px-4 py-2 rounded-md ${
                  sortBy === 'percentage' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
                }`}
              >
                Percentage {sortBy === 'percentage' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Сводная статистика */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <div className="text-sm text-blue-700 dark:text-blue-300">Total Owners</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{owners.length}</div>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
            <div className="text-sm text-green-700 dark:text-green-300">Total Owned Lands</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">
              {owners.reduce((sum, owner) => sum + owner.landsCount, 0)}
            </div>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
            <div className="text-sm text-purple-700 dark:text-purple-300">Average Lands per Owner</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">
              {owners.length > 0 
                ? (owners.reduce((sum, owner) => sum + owner.landsCount, 0) / owners.length).toFixed(1) 
                : '0'
              }
            </div>
          </div>
        </div>
      </div>
      
      {/* Список владельцев */}
      <div className="space-y-4">
        {filteredAndSortedOwners.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">No owners found</p>
          </div>
        ) : (
          filteredAndSortedOwners.map((owner) => (
            <div 
              key={owner.address} 
              className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between flex-wrap gap-2">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 dark:text-white break-all font-mono">
                    {owner.address}
                  </h3>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="text-right">
                    <div className="text-sm text-slate-600 dark:text-slate-400">Lands</div>
                    <div className="font-bold text-slate-800 dark:text-white">{owner.landsCount}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-600 dark:text-slate-400">Percentage</div>
                    <div className="font-bold text-slate-800 dark:text-white">{owner.percentage}%</div>
                  </div>
                </div>
              </div>
              <div className="mt-3 w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#f85266] to-[#b243a7]" 
                  style={{ width: `${owner.percentage}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OwnersPage; 