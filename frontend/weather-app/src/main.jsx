import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
      scope: "openid profile email"
    }}
    cacheLocation="localstorage"
    useRefreshTokens={true}
    onRedirectCallback={(appState) => {
      console.log('Auth0 redirect callback:', appState);
      // Redirect to returnTo URL or default to home
      window.history.replaceState({}, document.title, appState?.returnTo || window.location.pathname);
    }}
  >
    <App />
  </Auth0Provider>
)
