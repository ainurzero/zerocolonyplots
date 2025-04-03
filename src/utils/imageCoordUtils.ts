import axios from 'axios';

// Интерфейс для данных координации
interface CoordinationData {
  coord: {
    long: {
      min: string;
      max: string;
    };
    lat: {
      min: string;
      max: string;
    };
  };
  img_url: string;
}

// Кэш для координат и изображений
let coordinationCache: CoordinationData[] = [];

/**
 * Загружает данные координат и изображений из файла coordination.json
 */
export const loadCoordinationData = async (): Promise<void> => {
  try {
    // Используем локальный файл в папке data с учетом базового пути
    const response = await axios.get<CoordinationData[]>(process.env.PUBLIC_URL + '/data/coordination.json');
    // Закомментированный оригинальный URL (если был бы другим)
    // const response = await axios.get<CoordinationData[]>('/data/coordination.json');
    
    coordinationCache = response.data;
    console.log('Coordination data loaded successfully');
  } catch (error) {
    console.error('Failed to load coordination data:', error);
    throw error;
  }
};

/**
 * Возвращает URL изображения для указанного ID участка
 */
export const getLandImageUrl = (landId: number): string => {
  // ID в файле coordination.json начинаются с 0, поэтому нам нужно вычесть 1
  const index = landId - 1;
  
  if (coordinationCache.length === 0) {
    console.warn('Coordination data not loaded yet');
    // Возвращаем пустое изображение или заглушку
    return 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%22 y=%2250%22 font-family=%22Arial%22 font-size=%2215%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3ELoading...%3C/text%3E%3C/svg%3E';
  }
  
  if (index < 0 || index >= coordinationCache.length) {
    console.warn(`Land ID ${landId} is out of range`);
    // Возвращаем пустое изображение или заглушку
    return 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%22 y=%2250%22 font-family=%22Arial%22 font-size=%2215%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E';
  }
  
  return coordinationCache[index].img_url;
};

/**
 * Возвращает координаты для указанного ID участка
 */
export const getLandCoordinates = (landId: number): { 
  longitude: { min: number; max: number }, 
  latitude: { min: number; max: number } 
} => {
  // ID в файле coordination.json начинаются с 0, поэтому нам нужно вычесть 1
  const index = landId - 1;
  
  if (coordinationCache.length === 0 || index < 0 || index >= coordinationCache.length) {
    console.warn(`Cannot get coordinates for land ID ${landId}`);
    // Возвращаем пустые координаты
    return {
      longitude: { min: 0, max: 0 },
      latitude: { min: 0, max: 0 }
    };
  }
  
  const coordData = coordinationCache[index].coord;
  
  return {
    longitude: {
      min: parseFloat(coordData.long.min),
      max: parseFloat(coordData.long.max)
    },
    latitude: {
      min: parseFloat(coordData.lat.min),
      max: parseFloat(coordData.lat.max)
    }
  };
}; 