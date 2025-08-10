import { useAuth0 } from '@auth0/auth0-react';
import AuthButtons from './components/AuthButtons';
import WeatherDashboard from './components/WeatherDashboard';
import SearchBar from './components/SearchBar';
import ForecastList from './components/ForecastList';
import {clearWeatherCache, fetchWeatherData, setAuthToken } from './services/weatherService.js';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const { isLoading, error, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Set up Auth0 token when user is authenticated
  useEffect(() => {
    const setupAuth = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          setAuthToken(token);
          console.log('✅ Auth0 token set for API calls');
        } catch (error) {
          console.error('Failed to get Auth0 token:', error);
        }
      } else {
        // Clear token when not authenticated
        setAuthToken(null);
      }
    };

    if (!isLoading) {
      setupAuth();
    }
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  // Search handler for city/town
  const handleSearch = async (city) => {
    if (!city.trim()) {
      setSearchError('Please enter a city name');
      return;
    }
    setLoading(true);
    setSearchError('');
    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data.weather);
      setForecastData(data.forecast || []);
    } catch (err) {
      setSearchError(err.message || 'Failed to fetch weather data');
      setWeatherData(null);
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>🌤️ Weather Application</h1>
          <div className="loading">Loading authentication...</div>
        </header>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>🌤️ Weather Application</h1>
          <div className="error">Auth Error: {error.message}</div>
          <AuthButtons />
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="single-card-container">
        <div className="unified-card">
          <div className="card-header">
            <h1>🌤️ Weather Application</h1>
            <AuthButtons />
          </div>

          <div className="card-content">
            {isAuthenticated ? (
              <>
                <div className="compact-header">
                  <div className="welcome-text">
                    <h2>Welcome to Weather App</h2>
                    <p>Discover weather information for any city around the world</p>
                  </div>
                  
                  <SearchBar 
                    onSearch={handleSearch}
                    loading={loading}
                    placeholder="Search for any city..."
                  />
                </div>
                
                {searchError && <div className="error-message">{searchError}</div>}
                
                <div className="weather-content-grid">
                  <WeatherDashboard />
                  
                  <div className="search-results">
                    {loading ? (
                      <div className="loading">🌀 Loading weather data...</div>
                    ) : weatherData ? (
                      <div className="forecast-section">
                        <h3>🔍 Search Results for {weatherData.name}</h3>
                        <ForecastList 
                          weatherData={weatherData}
                          forecastData={forecastData}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </>
            ) : (
              <div className="welcome-text">
                <h2>Welcome to Weather App</h2>
                <p>Please log in to access weather data and explore weather information for cities around the world</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
