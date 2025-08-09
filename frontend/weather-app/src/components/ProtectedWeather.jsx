import { useAuth0 } from "@auth0/auth0-react";
import Weather from "./Weather";

export default function ProtectedWeather() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  return <Weather />;
}
