// Test import to verify exports
import { getCacheInfo, clearWeatherCache, getCacheStats, setAuthToken, fetchDashboardWeather, fetchWeatherData } from '../services/weatherService.js';

console.log('Import test:', {
  getCacheInfo: typeof getCacheInfo,
  clearWeatherCache: typeof clearWeatherCache, 
  getCacheStats: typeof getCacheStats,
  setAuthToken: typeof setAuthToken,
  fetchDashboardWeather: typeof fetchDashboardWeather,
  fetchWeatherData: typeof fetchWeatherData
});

export default function ImportTest() {
  return <div>Import test complete - check console</div>;
}
