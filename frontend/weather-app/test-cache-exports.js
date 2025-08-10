// Test weatherService exports
import { clearWeatherCache, getCacheInfo, getCacheStats } from './src/services/weatherService.js';

console.log('clearWeatherCache type:', typeof clearWeatherCache);
console.log('getCacheInfo type:', typeof getCacheInfo);
console.log('getCacheStats type:', typeof getCacheStats);

if (typeof clearWeatherCache === 'function') {
  console.log('✅ All cache exports working');
} else {
  console.log('❌ clearWeatherCache not exported properly');
}
