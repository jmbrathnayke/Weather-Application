import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchDashboardWeather, setAuthToken } from '../services/weatherService.js';
import WeatherCard from './WeatherCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import CacheInfo from './CacheInfo';

const WeatherDashboard = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showCacheInfo, setShowCacheInfo] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    if (!isAuthenticated) {
      setError('Please log in to view the weather dashboard');
      setLoading(false);
      return;
    }

    try {
      setError('');
      
      // Get Auth0 access token and set it in the weather service
      const token = await getAccessTokenSilently();
      setAuthToken(token);
      
      const data = await fetchDashboardWeather();
      setDashboardData(data.dashboard || []);
      setLastUpdated(data.timestamp);
      console.log(`📊 Dashboard loaded with ${data.totalCities} cities`);
      if (data.cached) {
        console.log('🎯 Dashboard data served from cache');
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      setError(error.message);
      setDashboardData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
  };

  useEffect(() => {
    // Only load dashboard if user is authenticated and Auth0 has finished loading
    if (!isLoading && isAuthenticated) {
      loadDashboard();
      
      // Auto-refresh every 5 minutes
      const interval = setInterval(loadDashboard, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    } else if (!isLoading && !isAuthenticated) {
      setLoading(false);
      setError('Please log in to view the weather dashboard');
    }
  }, [isAuthenticated, isLoading]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>🌍 Weather Dashboard</h1>
          <p>Loading weather data for all cities...</p>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>🌍 Weather Dashboard</h1>
          <button 
            className="refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Retry'}
          </button>
        </div>
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>🌍 Weather Dashboard</h1>
            <p>Real-time weather data for major cities worldwide</p>
            {lastUpdated && (
              <small className="last-updated">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </small>
            )}
          </div>
          
          <div className="dashboard-controls">
            <button 
              className="refresh-button"
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh weather data"
            >
              {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        {dashboardData.length === 0 ? (
          <div className="dashboard-empty">
            <h3>No weather data available</h3>
            <p>Unable to load weather information at this time.</p>
            <button onClick={handleRefresh} className="retry-button">
              Try Again
            </button>
          </div>
        ) : (
          <div className="dashboard-grid">
            {dashboardData.map((cityWeather, index) => (
              <div key={cityWeather.id || index} className="dashboard-card-wrapper">
                <WeatherCard 
                  weather={cityWeather} 
                  cacheInfo={{ frontendCached: false, timestamp: lastUpdated }}
                  compact={true}
                />
              </div>
            ))}
          </div>
        )}

        <div className="dashboard-footer">
          <p>
            Showing {dashboardData.length} cities • 
            Data refreshes automatically every 5 minutes • 
            <strong>Dashboard Mode</strong>
          </p>
        </div>
      </div>
      
      <CacheInfo 
        isVisible={showCacheInfo}
        onToggle={() => setShowCacheInfo(!showCacheInfo)}
      />
    </>
  );
};

export default WeatherDashboard;
