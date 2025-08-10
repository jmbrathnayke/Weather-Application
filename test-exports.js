// Quick test to verify weatherService.js exports
import { getCacheInfo, getCacheStats, clearWeatherCache } from './frontend/weather-app/src/services/weatherService.js';

console.log('Testing weatherService exports...');
console.log('getCacheInfo type:', typeof getCacheInfo);
console.log('getCacheStats type:', typeof getCacheStats);
console.log('clearWeatherCache type:', typeof clearWeatherCache);

// Test the functions
try {
  const cacheInfo = getCacheInfo();
  console.log('Cache Info:', cacheInfo);
  
  const cacheStats = getCacheStats();
  console.log('Cache Stats:', cacheStats);
  
  console.log('All exports working correctly!');
} catch (error) {
  console.error('Error testing exports:', error);
}
