
/**
* Handler that will be called during the execution of a PostLogin flow.
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  console.log("Post-login action triggered for client:", event.client.client_id);
  
  // Check if this is for your weather app (update this with your actual client ID)
  const weatherAppClientId = "GeUrVqERtsiyrkeqUwuZIMLQbiMtvaqK"; // Your actual Client ID
  
  if (event.client.client_id === weatherAppClientId) {
    console.log("Weather App login detected - enforcing Email MFA");
    
    // Check if user has completed MFA in this session
    const completedMfa = event.authentication?.methods?.find(
      (method) => method.name === 'mfa'
    );
    
    if (!completedMfa) {
      console.log("MFA not completed - forcing MFA challenge");
      
      // Force MFA challenge - Auth0 will use available MFA methods (including email)
      api.multifactor.enable('any', {
        allowRememberBrowser: false // Always require MFA
      });
      
      return; // Stop here, user will be challenged
    } else {
      console.log("MFA completed successfully:", completedMfa);
    }
    
    // Add custom claims to tokens for successful MFA
    const mfaCompleted = !!completedMfa;
    api.idToken.setCustomClaim('https://weather-app-api/mfa_completed', mfaCompleted);
    api.accessToken.setCustomClaim('https://weather-app-api/mfa_completed', mfaCompleted);
    api.idToken.setCustomClaim('https://weather-app-api/mfa_timestamp', Date.now());
    
    console.log("Custom claims added to tokens");
  } else {
    console.log("Different application, skipping Weather App MFA enforcement");
  }
};
