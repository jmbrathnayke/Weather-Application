import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Auth0 Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h2>🚨 Authentication Error</h2>
          <p>There was an issue with Auth0 initialization:</p>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {this.state.error?.message || 'Unknown error'}
          </pre>
          <button onClick={() => window.location.reload()} style={{ 
            marginTop: '10px', 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Check if Auth0 environment variables are available
const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

console.log('🔐 Auth0 Config Check:', {
  domain: auth0Domain ? 'Set' : 'Missing',
  clientId: auth0ClientId ? 'Set' : 'Missing'
});

if (!auth0Domain || !auth0ClientId) {
  console.error('❌ Auth0 environment variables missing!');
  createRoot(document.getElementById('root')).render(
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>⚙️ Configuration Error</h2>
      <p>Auth0 environment variables are not properly configured:</p>
      <ul>
        <li>VITE_AUTH0_DOMAIN: {auth0Domain || '❌ Missing'}</li>
        <li>VITE_AUTH0_CLIENT_ID: {auth0ClientId ? '✅ Set' : '❌ Missing'}</li>
      </ul>
      <p>Please check your .env file in the frontend/weather-app directory.</p>
    </div>
  );
} else {
  createRoot(document.getElementById('root')).render(
    <ErrorBoundary>
      <Auth0Provider
        domain={auth0Domain}
        clientId={auth0ClientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          scope: "openid profile email"
        }}
        cacheLocation="localstorage"
        useRefreshTokens={true}
        onRedirectCallback={(appState) => {
          console.log('✅ Auth0 redirect callback:', appState);
          window.history.replaceState({}, document.title, appState?.returnTo || window.location.pathname);
        }}
      >
        <App />
      </Auth0Provider>
    </ErrorBoundary>
  );
}
