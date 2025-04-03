const fs = require('fs');
const path = require('path');

// Функция для генерации случайного числа в диапазоне
function getRandomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Функция для генерации случайного адреса кошелька
function generateRandomWallet() {
  return '0x' + Array(40).fill().map(() => Math.floor(Math.random() * 16).toString(16)).join('');
}

// Генерация данных
function generateLandsData() {
  const totalLands = 21000;
  const soldLands = 10500; // 50% проданных участков
  
  const lands = [];
  
  // Сгенерируем все ID от 1 до 21000
  let ids = Array.from({ length: totalLands }, (_, i) => i + 1);
  
  // Добавим немного "красивых" номеров для тестирования фильтров
  
  // Палиндромы
  const palindromes = [11, 22, 33, 44, 55, 66, 77, 88, 99, 101, 111, 121, 131, 141, 151, 
    202, 212, 222, 232, 242, 252, 303, 313, 323, 333, 343, 353, 404, 414, 424, 434, 444, 454, 
    505, 515, 525, 535, 545, 555, 606, 616, 626, 636, 646, 656, 666, 707, 717, 727, 737, 747, 
    757, 767, 777, 787, 797, 808, 818, 828, 838, 848, 858, 868, 878, 888, 898, 909, 919, 929, 
    939, 949, 959, 969, 979, 989, 999, 1001, 1111, 1221, 1331, 1441, 1551, 1661, 1771, 1881, 
    1991, 2002, 2112, 2222, 2332, 2442, 2552, 2662, 2772, 2882, 2992, 3003, 3113, 3223, 3333, 
    3443, 3553, 3663, 3773, 3883, 3993, 4004, 4114, 4224, 4334, 4444, 4554, 4664, 4774, 4884, 
    4994, 5005, 5115, 5225, 5335, 5445, 5555, 5665, 5775, 5885, 5995, 6006, 6116, 6226, 6336, 
    6446, 6556, 6666, 6776, 6886, 6996, 7007, 7117, 7227, 7337, 7447, 7557, 7667, 7777, 7887, 
    7997, 8008, 8118, 8228, 8338, 8448, 8558, 8668, 8778, 8888, 8998, 9009, 9119, 9229, 9339, 
    9449, 9559, 9669, 9779, 9889, 9999, 10001, 10101, 10201, 11011, 11111, 11211, 12021, 12121, 
    12221, 12321, 13331, 14441, 15551, 16661, 17771, 18881, 19991, 20002, 20102];
    
  // Повторяющиеся числа
  const repeating = [111, 222, 333, 444, 555, 666, 777, 888, 999, 1111, 2222, 3333, 4444, 
    5555, 6666, 7777, 8888, 9999, 11111, 22222, 33333, 44444, 55555, 66666, 77777, 88888, 
    99999, 111111, 222222, 333333, 444444, 555555, 666666, 777777, 888888, 999999];
    
  // Круглые числа
  const round = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 
    5000, 6000, 7000, 8000, 9000, 10000, 20000];
    
  // Комбинации
  const combinations = [1212, 2323, 3434, 4545, 5656, 6767, 7878, 8989, 9090, 1234, 2345, 
    3456, 4567, 5678, 6789, 9876, 8765, 7654, 6543, 5432, 4321, 123123, 234234, 345345, 
    456456, 567567, 678678, 789789, 890890, 901901];
  
  // Создаем маску проданных участков (каждый второй)
  const soldMask = Array(totalLands).fill().map((_, i) => i % 2 === 0);
  
  // Генерируем участки
  for (let i = 0; i < totalLands; i++) {
    const id = i + 1;
    const isSold = soldMask[i];
    
    // Минимальное и максимальное значения для координат
    const minLong = getRandomInRange(-180, 180);
    const maxLong = minLong + getRandomInRange(0.5, 2);
    const minLat = getRandomInRange(-90, 90);
    const maxLat = minLat + getRandomInRange(0.5, 2);
    
    const land = {
      id,
      isSold,
      coordinates: {
        longitude: {
          min: parseFloat(minLong.toFixed(2)),
          max: parseFloat(maxLong.toFixed(2))
        },
        latitude: {
          min: parseFloat(minLat.toFixed(2)),
          max: parseFloat(maxLat.toFixed(2))
        }
      }
    };
    
    // Добавляем владельца для проданных участков
    if (isSold) {
      land.owner = generateRandomWallet();
    }
    
    lands.push(land);
  }
  
  // Заменяем некоторые ID на "красивые" номера
  for (const palindrome of palindromes) {
    if (palindrome <= totalLands) {
      const index = lands.findIndex(land => land.id === palindrome);
      if (index !== -1) {
        lands[index].id = palindrome;
      }
    }
  }
  
  for (const rep of repeating) {
    if (rep <= totalLands) {
      const index = lands.findIndex(land => land.id === rep);
      if (index !== -1) {
        lands[index].id = rep;
      }
    }
  }
  
  for (const r of round) {
    if (r <= totalLands) {
      const index = lands.findIndex(land => land.id === r);
      if (index !== -1) {
        lands[index].id = r;
      }
    }
  }
  
  for (const comb of combinations) {
    if (comb <= totalLands) {
      const index = lands.findIndex(land => land.id === comb);
      if (index !== -1) {
        lands[index].id = comb;
      }
    }
  }
  
  return {
    totalLands,
    soldLands,
    lands
  };
}

// Создаем данные
const landsData = generateLandsData();

// Записываем в файл
fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'data', 'test_lands.json'),
  JSON.stringify(landsData, null, 2)
);

console.log('Test data has been generated successfully!'); 