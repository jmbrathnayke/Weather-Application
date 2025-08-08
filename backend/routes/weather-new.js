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
  }

  set(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  clear() {
    this.cache.clear();
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

// Part 1 Compliance: Group API endpoint for multiple cities weather data
router.get('/cities-weather', async (req, res) => {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const cities = loadCityCodes();
    if (cities.length === 0) {
      return res.status(500).json({ error: 'Failed to load city codes' });
    }

    const cityIds = cities.map(city => city.CityCode).join(',');
    const cacheKey = `cities_weather_${cityIds}`;
    const cachedData = weatherCache.get(cacheKey);
    
    if (cachedData) {
      console.log('Serving cities weather from cache');
      return res.json({ data: cachedData, cached: true, timestamp: new Date().toISOString() });
    }

    const groupResponse = await axios.get(`https://api.openweathermap.org/data/2.5/group?id=${cityIds}&units=metric&appid=${API_KEY}`);
    const weatherData = groupResponse.data.list.map(cityWeather => ({
      cityCode: cityWeather.id,
      name: cityWeather.name,
      description: cityWeather.weather[0].description,
      temperature: Math.round(cityWeather.main.temp),
      country: cityWeather.sys.country,
      humidity: cityWeather.main.humidity,
      windSpeed: cityWeather.wind.speed,
      icon: cityWeather.weather[0].icon,
      tempMin: Math.round(cityWeather.main.temp_min),
      tempMax: Math.round(cityWeather.main.temp_max),
      timestamp: new Date().toISOString()
    }));

    weatherCache.set(cacheKey, weatherData);
    console.log('Cities weather data cached for 5 minutes');
    res.json({ 
      data: weatherData, 
      cached: false, 
      totalCities: weatherData.length, 
      timestamp: new Date().toISOString() 
    });

  } catch (error) {
    console.error('Group Weather API Error:', error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'One or more cities not found in the API response.' });
    }
    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'Invalid API key configuration' });
    }
    res.status(500).json({ 
      error: 'Failed to fetch weather data for cities. Please try again later.' 
    });
  }
});

// Cities list endpoint
router.get('/cities', (req, res) => {
  try {
    const cities = loadCityCodes();
    res.json({
      cities: cities.map(city => ({
        cityCode: city.CityCode,
        name: city.CityName,
        country: city.CountryCode || 'Unknown'
      })),
      total: cities.length
    });
  } catch (error) {
    console.error('Error loading cities:', error);
    res.status(500).json({ error: 'Failed to load cities list' });
  }
});

// Current weather for a specific city
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
      console.log(`Serving current weather for ${city} from cache`);
      return res.json(cachedData);
    }

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
    const weatherData = {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      tempMin: Math.round(response.data.main.temp_min),
      tempMax: Math.round(response.data.main.temp_max)
    };

    weatherCache.set(cacheKey, weatherData);
    console.log(`Current weather for ${city} cached for 5 minutes`);
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

// Forecast for a specific city
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
      console.log(`Serving forecast for ${city} from cache`);
      return res.json(cachedData);
    }

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
    const forecastData = response.data.list.map(item => ({
      datetime: item.dt_txt,
      temperature: Math.round(item.main.temp),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed
    }));

    weatherCache.set(cacheKey, forecastData);
    console.log(`Forecast for ${city} cached for 5 minutes`);
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
