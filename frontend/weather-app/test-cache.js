// Test minimal cache exports
class WeatherCache {
  constructor() {
    this.cache = new Map();
  }
  
  getCacheInfo() {
    return { size: this.cache.size, entries: [] };
  }
  
  getCacheStats() {
    return { total: 0, valid: 0, expired: 0 };
  }
  
  clear() {
    this.cache.clear();
  }
}

const weatherCache = new WeatherCache();

export const getCacheInfo = () => weatherCache.getCacheInfo();
export const getCacheStats = () => weatherCache.getCacheStats();  
export const clearWeatherCache = () => weatherCache.clear();
