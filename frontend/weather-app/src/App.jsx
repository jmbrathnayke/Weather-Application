import { useAuth0 } from '@auth0/auth0-react';
import AuthButtons from './components/AuthButtons';
import WeatherDashboard from './components/WeatherDashboard';
import './App.css';

function App() {
  const { isLoading, error, isAuthenticated } = useAuth0();

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
      <header className="App-header">
        <div className="header-top">
          <h1>🌤️ Weather Application</h1>
          <AuthButtons />
        </div>
      </header>

      <main className="App-main">
        {isAuthenticated ? (
          <WeatherDashboard />
        ) : (
          <div className="welcome-message">
            <h2>Welcome to Weather App</h2>
            <p>Please log in to access weather data</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
