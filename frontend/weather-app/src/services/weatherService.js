import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/weather';

// Create axios instance with default config
const weatherAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

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
      timestamp: Date.now(),
      cached: true
    });
    console.log(`🗄️ Cached data for key: ${key} (expires in 5 minutes)`);
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    // Check if cache is expired
    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_DURATION) {
      this.cache.delete(key);
      console.log(`⏰ Cache automatically expired for key: ${key} after 5 minutes`);
      return null;
    }
    
    const remainingTime = Math.round((this.CACHE_DURATION - age) / 1000);
    console.log(`📋 Serving from cache: ${key} (${remainingTime}s remaining)`);
    return cached.data;
  }

  clear() {
    this.cache.clear();
    console.log('🧹 Cache manually cleared');
  }

  // Automatic cleanup of expired entries
  startAutomaticCleanup() {
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, this.CLEANUP_INTERVAL);
  }

  cleanupExpiredEntries() {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.CACHE_DURATION) {
        this.cache.delete(key);
        expiredCount++;
        console.log(`🗑️ Auto-cleanup: Removed expired cache entry: ${key}`);
      }
    }
    
    if (expiredCount > 0) {
      console.log(`🔄 Auto-cleanup completed: Removed ${expiredCount} expired entries`);
    }
  }

  getCacheInfo() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, value]) => {
      const age = now - value.timestamp;
      const remainingTime = Math.max(0, Math.round((this.CACHE_DURATION - age) / 1000));
      
      return {
        key,
        age: Math.round(age / 1000),
        remainingTime,
        isExpired: age > this.CACHE_DURATION
      };
    }).filter(entry => !entry.isExpired); // Only show non-expired entries
    
    return {
      size: entries.length,
      totalSize: this.cache.size,
      entries
    };
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let expiredEntries = 0;
    let validEntries = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.CACHE_DURATION) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }
    
    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries,
      cacheDurationMinutes: this.CACHE_DURATION / (60 * 1000)
    };
  }
}

// Global cache instance
const weatherCache = new WeatherCache();

// NEW: Dashboard weather function - Fetch all cities for dashboard
export const fetchDashboardWeather = async () => {
  const cacheKey = weatherCache.generateKey('dashboard');
  
  // Check frontend cache first
  const cachedData = weatherCache.get(cacheKey);
  if (cachedData) {
    return {
      ...cachedData,
      frontendCached: true
    };
  }

  try {
    const response = await weatherAPI.get('/dashboard');
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
    
    return data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 404) {
        throw new Error(data.error || 'Dashboard data not found.');
      }
      
      if (status === 500) {
        throw new Error(data.error || 'Server error occurred while fetching dashboard.');
      }
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (error.request) {
      throw new Error('Unable to connect to weather service. Please check your internet connection.');
    }
    
    throw new Error('An unexpected error occurred while fetching dashboard data.');
  }
};

// NEW: Get available cities list
export const fetchAvailableCities = async () => {
  const cacheKey = weatherCache.generateKey('cities');
  
  // Check frontend cache first
  const cachedData = weatherCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await weatherAPI.get('/cities');
    const data = response.data.cities;

    // Cache the response in frontend
    weatherCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(data.error || 'Failed to load cities list');
    }
    
    if (error.request) {
      throw new Error('Unable to connect to weather service.');
    }
    
    throw new Error('An unexpected error occurred while fetching cities list.');
  }
};

// EXISTING FUNCTION - Fetch single city weather (for SearchBar)
export const fetchWeatherData = async (city) => {
  const cityKey = city.toLowerCase().trim();
  const cacheKey = weatherCache.generateKey('weather-data', { city: cityKey });
  
  // Check frontend cache first
  const cachedData = weatherCache.get(cacheKey);
  if (cachedData) {
    return {
      ...cachedData,
      frontendCached: true
    };
  }

  try {
    // Fetch current weather and forecast in parallel
    const [weatherResponse, forecastResponse] = await Promise.all([
      weatherAPI.get(`/current/${encodeURIComponent(city)}`),
      weatherAPI.get(`/forecast/${encodeURIComponent(city)}`)
    ]);

    const data = {
      weather: weatherResponse.data,
      forecast: forecastResponse.data,
      timestamp: new Date().toISOString(),
      frontendCached: false
    };

    // Cache the combined response in frontend
    weatherCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 404) {
        throw new Error(data.error || 'City not found. Please check the city name and try again.');
      } else if (status === 500) {
        throw new Error(data.error || 'Server error. Please try again later.');
      } else if (status >= 400) {
        throw new Error(data.error || 'Failed to fetch weather data.');
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to connect to weather service. Please check your internet connection and try again.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

export const checkServerHealth = async () => {
  try {
    const response = await weatherAPI.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Weather service is unavailable');
  }
};

// Cache Management Functions
export const clearWeatherCache = () => {
  weatherCache.clear();
};

export const getCacheInfo = () => {
  return weatherCache.getCacheInfo();
};

export const getCacheStats = () => {
  return weatherCache.getStats();
};

export const getCachedData = (endpoint, params = {}) => {
  const key = weatherCache.generateKey(endpoint, params);
  return weatherCache.get(key);
};

// Individual cache functions for specific data types
export const fetchCurrentWeather = async (city) => {
  const cityKey = city.toLowerCase().trim();
  const cacheKey = weatherCache.generateKey('current-weather', { city: cityKey });
  
  const cachedData = weatherCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await weatherAPI.get(`/current/${encodeURIComponent(city)}`);
    const data = {
      ...response.data,
      timestamp: new Date().toISOString(),
      frontendCached: false
    };

    weatherCache.set(cacheKey, data);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('City not found. Please check the city name and try again.');
    }
    throw new Error('Failed to fetch current weather data.');
  }
};

export const fetchForecastData = async (city) => {
  const cityKey = city.toLowerCase().trim();
  const cacheKey = weatherCache.generateKey('forecast', { city: cityKey });
  
  const cachedData = weatherCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await weatherAPI.get(`/forecast/${encodeURIComponent(city)}`);
    const data = {
      forecast: response.data,
      timestamp: new Date().toISOString(),
      frontendCached: false
    };

    weatherCache.set(cacheKey, data);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('City not found for forecast. Please check the city name and try again.');
    }
    throw new Error('Failed to fetch forecast data.');
  }
};
