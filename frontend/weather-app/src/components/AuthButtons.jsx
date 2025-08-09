import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

// AuthButtons component to handle user authentication
const AuthButtons = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: 'Username-Password-Authentication',
        prompt: 'login'
      }
    });
  };

  return (
    <div className="auth-buttons">
      {!isAuthenticated ? (
        <button onClick={handleLogin} className="login-button">
          Login
        </button>
      ) : (
        <>
          <span className="user-info">Welcome, {user?.name || user?.email}!</span>
          <button onClick={() => logout({ returnTo: window.location.origin })} className="logout-button">
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default AuthButtons;