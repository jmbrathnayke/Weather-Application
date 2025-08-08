import { useState } from 'react';
import SearchBar from './SearchBar';
import WeatherCard from './WeatherCard';
import ForecastList from './ForecastList';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import CacheInfo from './CacheInfo';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCacheInfo, setShowCacheInfo] = useState(false);
  const [cacheInfo, setCacheInfo] = useState(null);

  const handleWeatherData = (data) => {
    setWeatherData(data.weather);
    setForecastData(data.forecast);
    setCacheInfo(data); // Store cache info including frontendCached flag
    setError('');
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setWeatherData(null);
    setForecastData(null);
  };

  return (
    <>
      <div className="weather-app">
        <div className="container">
          <header className="header">
            <h1>Weather App</h1>
            <p>Get current weather and 5-day forecast for any city</p>
          </header>

          <SearchBar
            onWeatherData={handleWeatherData}
            onLoading={handleLoading}
            onError={handleError}
          />

          {loading && <LoadingSpinner />}
          
          {error && <ErrorMessage message={error} />}

          {!weatherData && !loading && !error && (
            <div className="welcome-message">
              <h2>Welcome to Weather App</h2>
              <p>Enter a city name to get started!</p>
            </div>
          )}

          {weatherData && !loading && (
            <div className="weather-content">
              <WeatherCard weather={weatherData} cacheInfo={cacheInfo} />
              {forecastData && (
                <div className="forecast-container-wrapper">
                  <ForecastList forecast={forecastData} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <CacheInfo 
        isVisible={showCacheInfo}
        onToggle={() => setShowCacheInfo(!showCacheInfo)}
      />
    </>
  );
};

export default WeatherApp;
