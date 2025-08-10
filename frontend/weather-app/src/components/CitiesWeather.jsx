import React, { useState, useEffect } from 'react';
import { fetchDashboardWeather } from '../services/weatherService.js';

const CitiesWeather = () => {
  const [citiesWeather, setCitiesWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [cached, setCached] = useState(false);

  const loadCitiesWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchDashboardWeather();
      setCitiesWeather(result.data);
      setLastUpdated(result.timestamp);
      setCached(result.cached);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitiesWeather();
    
    // Auto-refresh every 5 minutes to get fresh data
    const interval = setInterval(loadCitiesWeather, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getWeatherIconUrl = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  if (loading) {
    return (
      <div className="cities-weather-loading">
        <div className="loading-spinner"></div>
        <p>Loading weather data for all cities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cities-weather-error">
        <div className="error-content">
          <h3>Error Loading Cities Weather</h3>
          <p>{error}</p>
          <button onClick={loadCitiesWeather} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cities-weather-container">
      <div className="cities-weather-header">
        <h2>Weather Dashboard - All Cities</h2>
        <div className="update-info">
          <p>
            Last updated: {formatTimestamp(lastUpdated)}
            {cached && <span className="cached-badge">Cached</span>}
          </p>
          <button onClick={loadCitiesWeather} className="refresh-button">
            Refresh Data
          </button>
        </div>
      </div>

      <div className="cities-weather-grid">
        {citiesWeather.map((cityData) => (
          <div key={cityData.cityCode} className="city-weather-card">
            <div className="city-header">
              <h3>{cityData.name}</h3>
              <span className="country-badge">{cityData.country}</span>
            </div>
            
            <div className="weather-main">
              <img 
                src={getWeatherIconUrl(cityData.icon)} 
                alt={cityData.description}
                className="weather-icon"
              />
              <div className="temperature-section">
                <span className="main-temp">{cityData.temperature}°C</span>
                <span className="temp-range">
                  {cityData.tempMin}° / {cityData.tempMax}°
                </span>
              </div>
            </div>
            
            <div className="weather-details">
              <p className="description">{cityData.description}</p>
              <div className="weather-stats">
                <div className="stat">
                  <span className="stat-label">Humidity:</span>
                  <span className="stat-value">{cityData.humidity}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Wind:</span>
                  <span className="stat-value">{cityData.windSpeed} m/s</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cities-weather-footer">
        <p>Showing weather for {citiesWeather.length} cities</p>
        <p>Data refreshes automatically every 5 minutes</p>
      </div>
    </div>
  );
};

export default CitiesWeather;
