import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

class WeatherCache {
  constructor() {
    this.cache = new Map();
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    this.CLEANUP_INTERVAL = 60 * 1000; // Clean up every 1 minute
    
    // Start automatic cleanup process
    this.startAutomaticCleanup();
  }

  set(key, data) {
    this.cache.set(key, { 
      data, 
      timestamp: Date.now() 
    });
    console.log(`🗄️ Backend cache: Stored ${key} for 5 minutes`);
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_DURATION) {
      this.cache.delete(key);
      console.log(`⏰ Backend cache: Auto-expired ${key} after 5 minutes`);
      return null;
    }
    
    const remainingTime = Math.round((this.CACHE_DURATION - age) / 1000);
    console.log(`📋 Backend cache: Serving ${key} from cache (${remainingTime}s remaining)`);
    return cached.data;
  }

  clear() {
    this.cache.clear();
    console.log('🧹 Backend cache cleared');
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
        console.log(`🗑️ Backend auto-cleanup: Removed expired entry: ${key}`);
      }
    }
    
    if (expiredCount > 0) {
      console.log(`🔄 Backend auto-cleanup: Removed ${expiredCount} expired entries`);
    }
  }

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

const weatherCache = new WeatherCache();

function loadCityCodes() {
  try {
    const citiesPath = path.join(__dirname, '..', 'cities.json');
    const citiesData = fs.readFileSync(citiesPath, 'utf8');
    const citiesJson = JSON.parse(citiesData);
    const cities = citiesJson.List || citiesJson;
    return Array.isArray(cities) ? cities : [];
  } catch (error) {
    console.error('Error loading cities.json:', error);
    return [];
  }
}

// MAIN DASHBOARD ENDPOINT - All Cities Weather
router.get('/dashboard', async (req, res) => {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const cities = loadCityCodes();
    if (cities.length === 0) {
      return res.status(500).json({ error: 'Failed to load city codes' });
    }

    const cacheKey = 'weather_dashboard';
    const cachedData = weatherCache.get(cacheKey);
    
    if (cachedData) {
      console.log('📊 Serving weather dashboard from cache');
      return res.json({ 
        dashboard: cachedData, 
        cached: true, 
        timestamp: new Date().toISOString(),
        totalCities: cachedData.length,
        mode: 'dashboard'
      });
    }

    // Fetch weather for all cities (limit to prevent API rate limits)
    console.log('🌍 Fetching fresh weather data for dashboard...');
    const weatherPromises = cities.slice(0, 8).map(async (city) => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.CityName}&units=metric&appid=${API_KEY}`);
        return {
          id: city.CityCode,
          name: response.data.name,
          country: response.data.sys.country,
          temperature: Math.round(response.data.main.temp),
          description: response.data.weather[0].description,
          icon: response.data.weather[0].icon,
          humidity: response.data.main.humidity,
          windSpeed: Math.round(response.data.wind.speed * 10) / 10,
          pressure: response.data.main.pressure,
          tempMin: Math.round(response.data.main.temp_min),
          tempMax: Math.round(response.data.main.temp_max),
          feelsLike: Math.round(response.data.main.feels_like),
          visibility: response.data.visibility ? Math.round(response.data.visibility / 1000) : null,
          timestamp: new Date().toISOString(),
          success: true
        };
      } catch (error) {
        console.error(`❌ Failed to fetch weather for ${city.CityName}:`, error.message);
        return {
          id: city.CityCode,
          name: city.CityName,
          error: 'Data unavailable',
          timestamp: new Date().toISOString(),
          success: false
        };
      }
    });

    const weatherData = await Promise.all(weatherPromises);
    const successfulData = weatherData.filter(item => item.success);

    weatherCache.set(cacheKey, successfulData);
    console.log(`✅ Dashboard weather data cached for 5 minutes (${successfulData.length}/${weatherData.length} cities successful)`);
    
    res.json({ 
      dashboard: successfulData, 
      cached: false, 
      totalCities: successfulData.length, 
      timestamp: new Date().toISOString(),
      mode: 'dashboard',
      failed: weatherData.length - successfulData.length
    });

  } catch (error) {
    console.error('🚨 Dashboard Weather API Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard weather data. Please try again later.',
      mode: 'dashboard'
    });
  }
});

// Cities configuration endpoint
router.get('/cities', (req, res) => {
  try {
    const cities = loadCityCodes();
    res.json({
      cities: cities.map(city => ({
        id: city.CityCode,
        name: city.CityName,
        country: city.CountryCode || 'Unknown'
      })),
      total: cities.length,
      mode: 'dashboard'
    });
  } catch (error) {
    console.error('Error loading cities:', error);
    res.status(500).json({ error: 'Failed to load cities list' });
  }
});

// Refresh dashboard endpoint
router.post('/dashboard/refresh', async (req, res) => {
  try {
    // Clear cache to force fresh data
    weatherCache.clear();
    console.log('🔄 Dashboard cache cleared, fetching fresh data...');
    
    // Redirect to dashboard endpoint
    req.url = '/dashboard';
    req.method = 'GET';
    return router.handle(req, res);
  } catch (error) {
    console.error('Error refreshing dashboard:', error);
    res.status(500).json({ error: 'Failed to refresh dashboard' });
  }
});

// Current weather for a specific city (for search functionality)
router.get('/current/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const cacheKey = `current_${city.toLowerCase()}`;
    const cachedData = weatherCache.get(cacheKey);
    if (cachedData) {
      console.log(`🎯 Serving current weather for ${city} from cache`);
      return res.json(cachedData);
    }

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
    const weatherData = {
      name: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      windSpeed: Math.round(response.data.wind.speed * 10) / 10,
      pressure: response.data.main.pressure,
      tempMin: Math.round(response.data.main.temp_min),
      tempMax: Math.round(response.data.main.temp_max),
      feelsLike: Math.round(response.data.main.feels_like),
      visibility: response.data.visibility ? Math.round(response.data.visibility / 1000) : null
    };

    weatherCache.set(cacheKey, weatherData);
    console.log(`✅ Current weather for ${city} cached for 5 minutes`);
    res.json(weatherData);
  } catch (error) {
    console.error('Weather API Error:', error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'City not found. Please check the city name and try again.' });
    }
    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'Invalid API key configuration' });
    }
    res.status(500).json({ 
      error: 'Failed to fetch weather data. Please try again later.' 
    });
  }
});

// 5-Day Forecast for a specific city
router.get('/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const cacheKey = `forecast_${city.toLowerCase()}`;
    const cachedData = weatherCache.get(cacheKey);
    if (cachedData) {
      console.log(`🎯 Serving 5-day forecast for ${city} from cache`);
      return res.json(cachedData);
    }

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
    const forecastData = response.data.list.map(item => ({
      datetime: item.dt_txt,
      temperature: Math.round(item.main.temp),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      windSpeed: Math.round(item.wind.speed * 10) / 10,
      pressure: item.main.pressure,
      tempMin: Math.round(item.main.temp_min),
      tempMax: Math.round(item.main.temp_max)
    }));

    weatherCache.set(cacheKey, forecastData);
    console.log(`✅ 5-day forecast for ${city} cached for 5 minutes`);
    res.json(forecastData);
  } catch (error) {
    console.error('Forecast API Error:', error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'City not found for forecast. Please check the city name and try again.' });
    }
    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'Invalid API key configuration' });
    }
    res.status(500).json({ 
      error: 'Failed to fetch forecast data. Please try again later.' 
    });
  }
});

export default router;
