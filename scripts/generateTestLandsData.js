// Script to generate test data for Mars land plots with coordinates
const fs = require('fs');
const path = require('path');

// Constants for test data - smaller set
const TOTAL_PLOTS = 500; // Reduced for testing
const SOLD_PLOTS = Math.round(TOTAL_PLOTS * 0.49); // ~49% sold as per real data
const LONGITUDE_RANGE = 360; // Total range from -180 to 180
const LATITUDE_RANGE = 180; // Total range from -90 to 90
const PLOT_SIZE = 1; // Size in degrees
const OUTPUT_DIR = path.join(__dirname, '../public/data');

// Helper functions
function generateRandomEthAddress() {
  let address = '0x';
  const characters = '0123456789abcdef';
  for (let i = 0; i < 40; i++) {
    address += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return address;
}

// Calculate coordinates systematically 
function calculateCoordinates(plotId) {
  // We need to ensure the first and last plots match the examples
  if (plotId === 1) {
    return {
      longitude: {
        min: -177.67,
        max: -176.67
      },
      latitude: {
        min: 79.27,
        max: 80.27
      }
    };
  }
  
  if (plotId === TOTAL_PLOTS) {
    return {
      longitude: {
        min: 178.21,
        max: 179.21
      },
      latitude: {
        min: -77.65,
        max: -76.65
      }
    };
  }
  
  // For other plots, distribute them systematically
  const plotsPerRow = Math.ceil(Math.sqrt(TOTAL_PLOTS));
  const totalRows = Math.ceil(TOTAL_PLOTS / plotsPerRow);
  
  const row = Math.floor((plotId - 1) / plotsPerRow);
  const col = (plotId - 1) % plotsPerRow;
  
  // Calculate longitude (around the planet)
  const longitudeStep = LONGITUDE_RANGE / plotsPerRow;
  const longMin = -180 + (col * longitudeStep);
  const longMax = longMin + PLOT_SIZE;
  
  // Calculate latitude (north to south)
  const latitudeStep = LATITUDE_RANGE / totalRows;
  const latMax = 90 - (row * latitudeStep);
  const latMin = latMax - PLOT_SIZE;
  
  return {
    longitude: {
      min: parseFloat(longMin.toFixed(2)),
      max: parseFloat(longMax.toFixed(2))
    },
    latitude: {
      min: parseFloat(latMin.toFixed(2)),
      max: parseFloat(latMax.toFixed(2))
    }
  };
}

// Generate the data
function generateLandsData() {
  console.log('Generating test lands data...');
  
  // Create array of all plot IDs
  const allIds = Array.from({ length: TOTAL_PLOTS }, (_, i) => i + 1);
  
  // Randomly select sold plots
  const soldIdsSet = new Set();
  while (soldIdsSet.size < SOLD_PLOTS) {
    const randomId = allIds[Math.floor(Math.random() * TOTAL_PLOTS)];
    soldIdsSet.add(randomId);
  }
  
  // Ensure first and last plots are occupied as per example
  soldIdsSet.add(1);
  soldIdsSet.add(TOTAL_PLOTS);
  
  // Generate the lands array
  const lands = allIds.map(id => {
    const isSold = soldIdsSet.has(id);
    return {
      id,
      isSold,
      owner: isSold ? generateRandomEthAddress() : undefined,
      coordinates: calculateCoordinates(id)
    };
  });
  
  return {
    totalLands: TOTAL_PLOTS,
    soldLands: soldIdsSet.size,
    lands
  };
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate and write data
const data = generateLandsData();
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'test_lands.json'),
  JSON.stringify(data, null, 2)
);

console.log(`Generated test data for ${TOTAL_PLOTS} land plots (${SOLD_PLOTS} sold)`);
console.log(`File saved to ${path.join(OUTPUT_DIR, 'test_lands.json')}`); 