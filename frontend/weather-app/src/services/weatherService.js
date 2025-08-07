import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/weather';

// Create axios instance with default config
const weatherAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
});

export const fetchWeatherData = async (city) => {
  try {
    // Fetch current weather and forecast in parallel
    const [weatherResponse, forecastResponse] = await Promise.all([
      weatherAPI.get(`/current/${encodeURIComponent(city)}`),
      weatherAPI.get(`/forecast/${encodeURIComponent(city)}`)
    ]);

    return {
      weather: weatherResponse.data,
      forecast: forecastResponse.data
    };
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
