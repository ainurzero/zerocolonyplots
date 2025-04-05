import React, { useState, useEffect, useMemo } from 'react';
import { Land } from '../types';
import OwnersChart from '../components/OwnersChart';

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
  const [expandedOwner, setExpandedOwner] = useState<string | null>(null);
  
  // Map для быстрого доступа к землям по владельцу
  const ownerLandsMap = useMemo(() => {
    const map = new Map<string, Land[]>();
    
    lands.forEach(land => {
      if (land.owner) {
        const ownerLands = map.get(land.owner) || [];
        ownerLands.push(land);
        map.set(land.owner, ownerLands);
      }
    });
    
    return map;
  }, [lands]);

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
  
  // Обработчик клика по владельцу
  const handleOwnerClick = (address: string) => {
    if (expandedOwner === address) {
      setExpandedOwner(null); // Закрываем, если уже открыт
    } else {
      setExpandedOwner(address); // Открываем новый
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

  // Функция для форматирования адреса
  const formatAddress = (address: string) => {
    if (address === 'Others') return 'Others';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

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
      
      {/* График распределения владельцев */}
      <OwnersChart owners={owners} loading={loading} />
      
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
              className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-all duration-300"
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => handleOwnerClick(owner.address)}
              >
                <div className="flex justify-between flex-wrap gap-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-800 dark:text-white font-mono">
                        {formatAddress(owner.address)}
                      </h3>
                      <button className="text-blue-500 hover:text-blue-700 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          {expandedOwner === owner.address ? (
                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          )}
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 break-all">{owner.address}</p>
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
              
              {/* Раскрывающийся список земель */}
              {expandedOwner === owner.address && (
                <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3 animate-fade-in">
                  <h4 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Land Plots ({owner.landsCount})</h4>
                  
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                    <div className="max-h-80 overflow-y-auto">
                      <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                          <tr>
                            <th scope="col" className="py-2 px-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              ID
                            </th>
                            <th scope="col" className="py-2 px-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Longitude
                            </th>
                            <th scope="col" className="py-2 px-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                              Latitude
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                          {ownerLandsMap.get(owner.address)?.map((land) => (
                            <tr key={land.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/60">
                              <td className="py-2 px-3 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-white">
                                #{land.id}
                              </td>
                              <td className="py-2 px-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-mono">
                                {land.coordinates.longitude.min.toFixed(2)}° - {land.coordinates.longitude.max.toFixed(2)}°
                              </td>
                              <td className="py-2 px-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-mono">
                                {land.coordinates.latitude.min.toFixed(2)}° - {land.coordinates.latitude.max.toFixed(2)}°
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OwnersPage; 