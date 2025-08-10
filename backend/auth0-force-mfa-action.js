/**
 * Auth0 Action: Force MFA for Weather App
 * 
 * Instructions to add this to Auth0:
 * 1. Go to Auth0 Dashboard > Actions > Library
 * 2. Create a new Action called "Force MFA"
 * 3. Copy and paste this code
 * 4. Deploy and add to your Login Flow
 */

/**
* Handler that will be called during the execution of a PostLogin flow.
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  // Check if this is for your weather app
  const weatherAppClientId = "GeUrVqERtsiyrkeqUwuZIMLQbiMtvaqK"; // Your client ID
  
  if (event.client.client_id === weatherAppClientId) {
    console.log("Weather App login detected - checking MFA status");
    
    // Check if user has completed MFA
    const completedMfa = event.authentication?.methods?.find(
      (method) => method.name === 'mfa'
    );
    
    if (!completedMfa) {
      console.log("MFA not completed - challenging user");
      // Force MFA challenge
      api.multifactor.enable('any', {
        allowRememberBrowser: false // Always ask for MFA
      });
    } else {
      console.log("MFA completed successfully");
    }
    
    // Add custom claims to token
    api.idToken.setCustomClaim('https://weather-app-api/mfa_completed', !!completedMfa);
    api.accessToken.setCustomClaim('https://weather-app-api/mfa_completed', !!completedMfa);
  }
};
