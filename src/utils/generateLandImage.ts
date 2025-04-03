/**
 * Функция для генерации уникального пиксельного изображения для участка на основе его ID
 * Изображения будут симметричны относительно вертикального центра
 */

// Цвета для использования в пиксельных изображениях (точные цвета из Zero Colony)
const COLOR_PALETTE = {
  PRIMARY: '#f85266',   // красный/розовый
  SECONDARY: '#b243a7', // фиолетовый
  TERTIARY: '#3f4057'   // темно-серый/синий
};

// Размер сетки для изображения
const GRID_SIZE = 10;

// Генерация числа от min до max (включительно)
const getRandomInt = (min: number, max: number, seed: number): number => {
  const x = Math.sin(seed) * 10000;
  const rand = x - Math.floor(x);
  return Math.floor(rand * (max - min + 1)) + min;
};

/**
 * Генерирует матрицу с цветами для пикселей на основе ID участка
 */
const generateColorMatrix = (landId: number): string[][] => {
  const matrix: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
  const seedValue = landId;
  
  // Pseudo-random function seeded with land ID
  const seededRandom = (min: number, max: number, seed: number): number => {
    const x = Math.sin(seed) * 10000;
    const result = (x - Math.floor(x)) * (max - min) + min;
    return result;
  };
  
  // Fill the left half of the matrix with random colors
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE / 2; x++) {
      // Generate a value between 0 and 1 based on the position and landId
      const seed = seedValue + (y * 100) + x;
      const randomValue = seededRandom(0, 1, seed);
      
      // Assign colors based on probabilistic distribution
      // 60% primary, 30% secondary, 10% tertiary
      let color;
      if (randomValue < 0.6) {
        color = COLOR_PALETTE.PRIMARY;
      } else if (randomValue < 0.9) {
        color = COLOR_PALETTE.SECONDARY;
      } else {
        color = COLOR_PALETTE.TERTIARY;
      }
      
      matrix[y][x] = color;
    }
  }
  
  // Mirror to create symmetry (right half mirrors left half)
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE / 2; x++) {
      matrix[y][GRID_SIZE - 1 - x] = matrix[y][x];
    }
  }
  
  return matrix;
};

/**
 * Генерирует SVG изображение для участка
 */
const generateLandImage = (landId: number): string => {
  const colorMatrix = generateColorMatrix(landId);
  const pixelSize = 10; // Size of each pixel in the SVG
  const width = GRID_SIZE * pixelSize;
  const height = GRID_SIZE * pixelSize;
  
  // Create the SVG string
  let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Add each pixel as a rect element
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const color = colorMatrix[y][x];
      svgContent += `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}" />`;
    }
  }
  
  svgContent += '</svg>';
  
  // Convert SVG to data URL
  const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
  return dataUrl;
};

export default generateLandImage; 