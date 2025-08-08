import { useState, useEffect } from 'react';
import WeatherDashboard from './components/WeatherDashboard';
import SearchBar from './components/SearchBar';
import ForecastList from './components/ForecastList';
import { fetchWeatherData } from './services/weatherService';
import './App.css';

function App() {
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
    <div className="App">
      <header className="App-header">
        <h1>🌤️ Weather Application</h1>
        
        {/* Search bar always visible */}
        <SearchBar 
          onSearch={handleSearch}
          loading={loading}
          placeholder="Search for any city..."
        />
        
        {error && <div className="error-message">{error}</div>}
      </header>

      <main className="App-main">
        {/* Dashboard always visible at top */}
        <WeatherDashboard />
        
        {/* Search results section */}
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
      </main>
    </div>
  );
}

export default App;
