import { useState } from 'react';
import SearchBar from './SearchBar';
import WeatherCard from './WeatherCard';
import ForecastList from './ForecastList';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWeatherData = (data) => {
    setWeatherData(data.weather);
    setForecastData(data.forecast);
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

        {weatherData && !loading && (
          <div className="weather-content">
            <WeatherCard weather={weatherData} />
            {forecastData && <ForecastList forecast={forecastData} />}
          </div>
        )}

        {!weatherData && !loading && !error && (
          <div className="welcome-message">
            <h2>Welcome to Weather App</h2>
            <p>Enter a city name to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
