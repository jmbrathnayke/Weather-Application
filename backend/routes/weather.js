import express from 'express';
import axios from 'axios';

const router = express.Router();

// Get current weather for a city
router.get('/current/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ 
        error: 'Weather API key not configured' 
      });
    }

    if (!city) {
      return res.status(400).json({ 
        error: 'City name is required' 
      });
    }

    // Call OpenWeatherMap API
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const weatherData = weatherResponse.data;

    // Format the response
    const formattedWeather = {
      city: weatherData.name,
      country: weatherData.sys.country,
      temperature: {
        current: Math.round(weatherData.main.temp),
        feels_like: Math.round(weatherData.main.feels_like),
        min: Math.round(weatherData.main.temp_min),
        max: Math.round(weatherData.main.temp_max)
      },
      weather: {
        main: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon
      },
      details: {
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        visibility: weatherData.visibility / 1000, // Convert to km
        wind: {
          speed: weatherData.wind.speed,
          direction: weatherData.wind.deg
        }
      },
      timestamp: new Date().toISOString()
    };

    res.json(formattedWeather);

  } catch (error) {
    console.error('Weather API Error:', error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({ 
        error: 'City not found. Please check the city name and try again.' 
      });
    }
    
    if (error.response?.status === 401) {
      return res.status(500).json({ 
        error: 'Invalid API key configuration' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to fetch weather data. Please try again later.' 
    });
  }
});

// Get 5-day weather forecast
router.get('/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ 
        error: 'Weather API key not configured' 
      });
    }

    if (!city) {
      return res.status(400).json({ 
        error: 'City name is required' 
      });
    }

    // Call OpenWeatherMap 5-day forecast API
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    const forecastData = forecastResponse.data;

    // Format the forecast data (group by day)
    const dailyForecasts = {};
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date: date,
          temperature: {
            min: item.main.temp_min,
            max: item.main.temp_max
          },
          weather: {
            main: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon
          },
          details: {
            humidity: item.main.humidity,
            wind: item.wind.speed
          }
        };
      } else {
        // Update min/max temperatures
        dailyForecasts[date].temperature.min = Math.min(
          dailyForecasts[date].temperature.min, 
          item.main.temp_min
        );
        dailyForecasts[date].temperature.max = Math.max(
          dailyForecasts[date].temperature.max, 
          item.main.temp_max
        );
      }
    });

    // Convert to array and round temperatures
    const formattedForecast = Object.values(dailyForecasts).slice(0, 5).map(day => ({
      ...day,
      temperature: {
        min: Math.round(day.temperature.min),
        max: Math.round(day.temperature.max)
      }
    }));

    res.json({
      city: forecastData.city.name,
      country: forecastData.city.country,
      forecast: formattedForecast
    });

  } catch (error) {
    console.error('Forecast API Error:', error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({ 
        error: 'City not found. Please check the city name and try again.' 
      });
    }
    
    if (error.response?.status === 401) {
      return res.status(500).json({ 
        error: 'Invalid API key configuration' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to fetch forecast data. Please try again later.' 
    });
  }
});

export default router;
