import { useState } from 'react';
import WeatherDashboard from './WeatherDashboard';
import SearchBar from './SearchBar';
import ForecastList from './ForecastList';
import { fetchWeatherData } from '../services/weatherService';

export default function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (city) => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data.weather);
      setForecastData(data.forecast || []);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err.message || 'Failed to fetch weather data');
      setWeatherData(null);
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      {/* Dashboard */}
      <WeatherDashboard />
      
      {/* Search functionality */}
      <div className="search-section">
        <SearchBar 
          onSearch={handleSearch}
          loading={loading}
          placeholder="Search for any city..."
        />
        
        {error && <div className="error-message">{error}</div>}
      </div>
      
      {/* Search results */}
      <div className="search-results">
        {loading ? (
          <div className="loading">🌀 Loading weather data...</div>
        ) : weatherData ? (
          <div className="forecast-section">
            <h2>🔍 Search Results for {weatherData.name}</h2>
            <ForecastList 
              weatherData={weatherData}
              forecastData={forecastData}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
