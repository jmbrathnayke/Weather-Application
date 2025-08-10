import axios from 'axios';

console.log('✅ weatherService.js loaded - ' + new Date().toISOString());

const API_BASE_URL = 'http://localhost:5002/api';

// Create axios instance with default config
const weatherAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set authorization header
export const setAuthToken = (token) => {
  if (token) {
    weatherAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Auth token set in weatherService');
  } else {
    delete weatherAPI.defaults.headers.common['Authorization'];
    console.log('🔑 Auth token removed from weatherService');
  }
};

// Frontend Cache Implementation - 5-minute caching with automatic cleanup
class WeatherCache {
  constructor() {
    this.cache = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
    this.CLEANUP_INTERVAL = 60 * 1000; // Clean up every 1 minute
    
    // Start automatic cleanup process
    this.startAutomaticCleanup();
  }

  generateKey(endpoint, params = {}) {
    const sortedParams = Object.keys(params).sort().reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {});
    return `${endpoint}_${JSON.stringify(sortedParams)}`;
  }

  set(key, data) {
    this.cache.set(key, { 
      data, 
      timestamp: Date.now() 
    });
    console.log(`🗄️ Frontend cache: Stored ${key} for 5 minutes`);
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_DURATION) {
      this.cache.delete(key);
      console.log(`⏰ Frontend cache: Auto-expired ${key} after 5 minutes`);
      return null;
    }
    
    const remainingTime = Math.round((this.CACHE_DURATION - age) / 1000);
    console.log(` Frontend cache: Serving ${key} from cache (${remainingTime}s remaining)`);
    return cached.data;
  }

  clear() {
    this.cache.clear();
    console.log(' Frontend cache cleared');
  }

  has(key) {
    return this.cache.has(key);
  }

  keys() {
    return Array.from(this.cache.keys());
  }

  size() {
    return this.cache.size;
  }

  startAutomaticCleanup() {
    setInterval(() => {
      let cleanedCount = 0;
      for (const [key, cached] of this.cache.entries()) {
        const age = Date.now() - cached.timestamp;
        if (age > this.CACHE_DURATION) {
          this.cache.delete(key);
          cleanedCount++;
        }
      }
      if (cleanedCount > 0) {
        console.log(`🧹 Frontend cache: Auto-cleaned ${cleanedCount} expired entries`);
      }
    }, this.CLEANUP_INTERVAL);
  }
}

const weatherCache = new WeatherCache();

// Cache Statistics Function
export const getCacheStats = () => {
  const stats = {
    size: weatherCache.size(),
    keys: weatherCache.keys(),
    lastUpdated: new Date().toISOString()
  };
  console.log('📊 Frontend cache stats:', stats);
  return stats;
};

// Cache Info Function
export const getCacheInfo = () => {
  const stats = getCacheStats();
  const entries = [];
  
  // Convert cache entries to a format the component expects
  for (const [key, cached] of weatherCache.cache.entries()) {
    const age = Date.now() - cached.timestamp;
    const remainingTime = Math.max(0, weatherCache.CACHE_DURATION - age);
    
    entries.push({
      key: key,
      timestamp: cached.timestamp,
      age: Math.round(age / 1000),
      remainingTime: Math.round(remainingTime / 1000),
      data: cached.data
    });
  }
  
  return {
    frontendCacheEnabled: true,
    frontendCacheSize: stats.size,
    frontendCacheKeys: stats.keys,
    entries: entries,
    cacheDurationMinutes: 5,
    lastChecked: stats.lastUpdated
  };
};

// Clear Cache Function
export const clearWeatherCache = () => {
  weatherCache.clear();
  return { 
    success: true, 
    message: 'Frontend cache cleared successfully',
    timestamp: new Date().toISOString()
  };
};

// Main Weather Dashboard Fetch Function
export const fetchDashboardWeather = async () => {
  console.log('🌍 Fetching dashboard weather data...');
  
  const cacheKey = weatherCache.generateKey('/weather/dashboard');
  
  // Check frontend cache first
  const cachedData = weatherCache.get(cacheKey);
  if (cachedData) {
    console.log('📋 Serving dashboard from frontend cache');
    return {
      ...cachedData,
      frontendCached: true
    };
  }

  try {
    console.log('🌐 Making API request to dashboard endpoint...');
    const response = await weatherAPI.get('/weather/dashboard');
    console.log('✅ Dashboard API response received:', response.status);
    
    const data = {
      dashboard: response.data.dashboard,
      cached: response.data.cached || false,
      totalCities: response.data.totalCities,
      timestamp: response.data.timestamp,
      mode: 'dashboard',
      frontendCached: false
    };

    // Cache the response in frontend
    weatherCache.set(cacheKey, data);
    console.log(`📊 Dashboard loaded with ${data.totalCities} cities`);
    
    return data;
  } catch (error) {
    console.error('❌ Dashboard API error:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      console.error(`❌ API Error ${status}:`, data);
      
      if (status === 404) {
        throw new Error(data.error || 'Dashboard data not found.');
      }
      
      if (status === 500) {
        throw new Error(data.error || 'Server error occurred while fetching dashboard.');
      }
      
      if (status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      
      throw new Error(data.error || `API error occurred (${status}).`);
    }
    
    if (error.request) {
      console.error('❌ Network error - no response received');
      throw new Error('Unable to connect to weather service. Please check your connection.');
    }
    
    console.error('❌ Request setup error:', error.message);
    throw new Error(`Request failed: ${error.message}`);
  }
};

// Single City Weather Function (for individual weather requests)
export const fetchWeatherData = async (city) => {
  console.log(`🌤️ Fetching weather for ${city}...`);
  
  // Remove frontend caching to see backend cache in action
  // const cacheKey = weatherCache.generateKey('/weather/search', { city });
  // const cachedData = weatherCache.get(cacheKey);
  // if (cachedData) {
  //   console.log(`📋 Serving ${city} weather from frontend cache`);
  //   return {
  //     ...cachedData,
  //     frontendCached: true
  //   };
  // }

  try {
    const response = await weatherAPI.get(`/weather/search?city=${encodeURIComponent(city)}`);
    console.log(`🔍 Backend response for ${city}:`, response.data.cached ? 'CACHED' : 'FRESH');
    
    const data = {
      ...response.data,
      frontendCached: false,
      backendCached: response.data.cached || false
    };

    // Don't cache on frontend to see backend cache working
    // weatherCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error(`❌ Weather fetch error for ${city}:`, error);
    
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 404) {
        throw new Error(data.error || `City "${city}" not found.`);
      }
      
      if (status === 500) {
        throw new Error(data.error || 'Server error occurred while fetching weather.');
      }
      
      if (status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      
      throw new Error(data.error || `API error occurred (${status}).`);
    }
    
    if (error.request) {
      throw new Error('Unable to connect to weather service. Please check your connection.');
    }
    
    throw new Error(`Request failed: ${error.message}`);
  }
};
