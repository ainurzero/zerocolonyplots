import React, { useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

// Типы для компонента
interface Owner {
  address: string;
  landsCount: number;
  percentage: number;
}

interface ChartDataItem extends Owner {
  displayName: string;
}

interface OwnersChartProps {
  owners: Owner[];
  loading: boolean;
}

// Цвета для графика
const COLORS = [
  '#f85266', '#b243a7', '#4F46E5', '#0EA5E9', '#10B981', 
  '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444', '#6366F1',
  '#14B8A6', '#FB923C', '#A855F7', '#F43F5E', '#3B82F6'
];

// Компонент активного сектора для Pie Chart
const renderActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <text x={cx} y={cy-15} dy={8} textAnchor="middle" fill={fill} className="text-md font-semibold">
        {payload.displayName}
      </text>
      <text x={cx} y={cy+5} textAnchor="middle" fill="#999" className="text-sm">
        {`${value} lands (${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

// Форматирование подписей для адресов
const formatTooltipAddress = (address: string) => {
  if (!address) return '';
  // Сокращаем адрес, показывая только начало и конец
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const OwnersChart: React.FC<OwnersChartProps> = ({ owners, loading }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  // Подготавливаем данные для графика
  const chartData = useMemo(() => {
    // Берем топ 10 владельцев, остальных группируем в "Others"
    if (owners.length === 0) return [] as ChartDataItem[];
    
    // Сортируем по количеству земель
    const sortedOwners = [...owners].sort((a, b) => b.landsCount - a.landsCount);
    
    const topOwners = sortedOwners.slice(0, 10).map(owner => ({
      ...owner,
      displayName: formatTooltipAddress(owner.address)
    }));
    
    // Если есть больше 10 владельцев, добавляем категорию "Others"
    if (sortedOwners.length > 10) {
      const othersCount = sortedOwners.slice(10).reduce((sum, owner) => sum + owner.landsCount, 0);
      const othersPercentage = sortedOwners.slice(10).reduce((sum, owner) => sum + owner.percentage, 0);
      
      topOwners.push({
        address: 'Others',
        displayName: 'Others',
        landsCount: othersCount,
        percentage: othersPercentage
      });
    }
    
    return topOwners;
  }, [owners]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // Если данные загружаются, показываем плейсхолдер
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-1/3 mb-6"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
      </div>
    );
  }

  // Если нет данных, показываем сообщение
  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-3">Land Distribution</h2>
        <div className="h-64 flex items-center justify-center">
          <p className="text-slate-600 dark:text-slate-400">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Land Distribution</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('pie')}
            className={`px-3 py-1 rounded-md text-sm ${
              chartType === 'pie' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
            }`}
          >
            Pie Chart
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 rounded-md text-sm ${
              chartType === 'bar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white'
            }`}
          >
            Bar Chart
          </button>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                fill="#8884d8"
                dataKey="landsCount"
                onMouseEnter={onPieEnter}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`${value} lands`, 'Amount']}
                labelFormatter={(label: any) => {
                  const item = chartData.find(d => d.displayName === label);
                  return item ? item.address : label;
                }}
              />
              <Legend 
                layout="horizontal" 
                formatter={(value: string) => {
                  const item = chartData.find(d => d.displayName === value);
                  return item?.displayName || value;
                }}
              />
            </PieChart>
          ) : (
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="displayName" width={60} />
              <Tooltip 
                formatter={(value: any) => [`${value} lands`, 'Amount']}
                labelFormatter={(label: any) => {
                  const item = chartData.find(d => d.displayName === label);
                  return item ? item.address : label;
                }}
              />
              <Legend />
              <Bar 
                dataKey="landsCount" 
                name="Land Count"
                barSize={20}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OwnersChart; 