// Script to generate mock data for Mars land plots with coordinates
const fs = require('fs');
const path = require('path');

// Constants
const TOTAL_PLOTS = 21000;
const SOLD_PLOTS = 10270; // As per requirements
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

// Calculate coordinates systematically to cover Mars surface
function calculateCoordinates(plotId) {
  // We need to distribute 21000 plots across the surface
  // Starting from the north pole and moving down
  
  // Starting coordinates (first plot at the north pole area)
  const firstPlotLongMin = -177.67;
  const firstPlotLatMax = 80.27;
  
  // Ending coordinates (last plot near the south pole area)
  const lastPlotLongMax = 179.21;
  const lastPlotLatMin = -76.65;
  
  // Create a grid of plots that transitions from first to last
  const plotsPerRow = Math.ceil(Math.sqrt(TOTAL_PLOTS));
  const totalRows = Math.ceil(TOTAL_PLOTS / plotsPerRow);
  
  const row = Math.floor((plotId - 1) / plotsPerRow);
  const col = (plotId - 1) % plotsPerRow;
  
  // Calculate longitude distribution
  const longitudeStep = LONGITUDE_RANGE / plotsPerRow;
  const longMin = -180 + (col * longitudeStep);
  const longMax = longMin + PLOT_SIZE;
  
  // Calculate latitude distribution
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
  console.log('Generating lands data...');
  
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
  soldIdsSet.add(21000);
  
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
  path.join(OUTPUT_DIR, 'lands.json'),
  JSON.stringify(data, null, 2)
);

console.log(`Generated data for ${TOTAL_PLOTS} land plots (${SOLD_PLOTS} sold)`);
console.log(`File saved to ${path.join(OUTPUT_DIR, 'lands.json')}`); 