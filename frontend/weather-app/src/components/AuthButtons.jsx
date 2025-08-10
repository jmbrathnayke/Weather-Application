import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

// AuthButtons component to handle user authentication
const AuthButtons = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'Username-Password-Authentication',
        prompt: 'login',
        // Force fresh authentication to trigger MFA
        max_age: 0,
        // Request specific scopes that may trigger MFA
        scope: 'openid profile email'
      }
    });
  };

  return (
    <div className="auth-buttons">
      {!isAuthenticated ? (
        <button onClick={handleLogin} className="login-button">
          <span></span> Login
        </button>
      ) : (
        <div className="user-section">
          <div className="user-info">
            <span className="user-avatar">👤</span>
            <span className="user-name">{user?.name || user?.email}</span>
          </div>
          <button onClick={() => logout({ returnTo: window.location.origin })} className="logout-button">
            <span></span> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;