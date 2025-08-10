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
      {/* Modern Header */}
      <header className="modern-header">
        <div className="header-container">
          <div className="header-brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" className="weather-icon">
                <path fill="currentColor" d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
              </svg>
            </div>
            <div className="brand-text">
              <h1>WeatherLive</h1>
              <span className="brand-tagline">Real-time Weather Intelligence</span>
            </div>
          </div>
          
          <div className="header-actions">
            <AuthButtons />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          {isAuthenticated ? (
            <>
              {/* Hero Section */}
              <section className="hero-section">
                <div className="hero-content">
                  <h2 className="hero-title">
                    Discover Weather Insights
                    <span className="gradient-text">Worldwide</span>
                  </h2>
                  <p className="hero-description">
                    Get accurate, real-time weather data for any location around the globe
                  </p>
                  
                  <div className="search-container">
                    <SearchBar 
                      onSearch={handleSearch}
                      loading={loading}
                      placeholder="Search for any city or location..."
                    />
                  </div>
                </div>
              </section>
                
              {searchError && (
                <div className="error-banner">
                  <svg className="error-icon" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
                  </svg>
                  {searchError}
                </div>
              )}
                
              {/* Weather Content Grid */}
              <section className="weather-grid">
                <div className="dashboard-section">
                  <WeatherDashboard />
                </div>
                  
                <div className="search-results-section">
                  {loading ? (
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <span>Fetching weather data...</span>
                    </div>
                  ) : weatherData ? (
                    <div className="search-results-card">
                      <div className="results-header">
                        <h3>Weather for {weatherData.name}</h3>
                        <span className="location-type">Search Result</span>
                      </div>
                      <ForecastList 
                        weatherData={weatherData}
                        forecastData={forecastData}
                      />
                    </div>
                  ) : null}
                </div>
              </section>
            </>
          ) : (
            /* Login State */
            <section className="login-section">
              <div className="login-card">
                <div className="login-header">
                  <div className="login-icon">
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9C15.3 9 15.6 9.1 15.9 9.2L18 7.9V10.5C18 10.8 18.2 11 18.5 11S19 10.8 19 10.5V7.4L20.4 6.8C20.7 6.7 21 6.9 21 7.2V9H21ZM15 12.5C15.8 12.5 16.5 13.2 16.5 14S15.8 15.5 15 15.5 13.5 14.8 13.5 14 14.2 12.5 15 12.5M9 12.5C9.8 12.5 10.5 13.2 10.5 14S9.8 15.5 9 15.5 7.5 14.8 7.5 14 8.2 12.5 9 12.5Z"/>
                    </svg>
                  </div>
                  <h2>Welcome to WeatherLive</h2>
                  <p>Access real-time weather data and explore weather information for cities around the world</p>
                </div>
                
                <div className="login-features">
                  <div className="feature-item">
                    <div className="feature-icon">🌍</div>
                    <span>Global Weather Data</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">📊</div>
                    <span>Detailed Forecasts</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">⚡</div>
                    <span>Real-time Updates</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
