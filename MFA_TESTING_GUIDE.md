# MFA Testing Guide for Weather Application

## Quick Test Steps

1. **Open the Application**: http://localhost:5174
2. **Click Login** - You should be redirected to Auth0
3. **Enter your credentials** 
4. **MFA Challenge Should Appear**:
   - Email verification code
   - SMS code (if configured)
   - Authenticator app (if configured)

## If MFA Still Doesn't Work

### Check 1: Auth0 Dashboard Settings
- Go to **Security > Multi-factor Auth**
- Ensure **Policy = "Always"** (not "Adaptive")
- Ensure at least one provider is enabled (Email, SMS, or OTP)

### Check 2: User Profile
- Go to **User Management > Users**
- Find your test user
- Check if MFA is enrolled for this user
- If not, delete the user and recreate

### Check 3: Connection Settings
- Go to **Authentication > Database**
- Select your connection (Username-Password-Authentication)
- Ensure **Requires Username** is disabled
- Ensure **Disable Sign Ups** is unchecked for testing

### Check 4: Application Settings
- Go to **Applications > Weather App**
- **Advanced Settings > Grant Types**
- Ensure **MFA** grant type is enabled

## Force MFA with Auth0 Action

1. **Copy the auth0-force-mfa-action.js file content**
2. **Go to Auth0 Dashboard > Actions > Library**
3. **Create New Action**: "Force MFA"
4. **Paste the code** from auth0-force-mfa-action.js
5. **Deploy the Action**
6. **Go to Actions > Flows > Login**
7. **Drag the "Force MFA" action** to the flow
8. **Apply changes**

## Test Different Scenarios

1. **New User**: Sign up with new email - MFA should be required
2. **Existing User**: Login with existing user - MFA should be required
3. **Browser Clear**: Clear browser data and login - MFA should be required

## Expected Behavior

✅ **Correct Flow**:
1. User clicks Login
2. Redirected to Auth0
3. Enter username/password
4. **MFA Challenge appears** (Email/SMS/App)
5. Complete MFA
6. Redirected back to weather app
7. User is authenticated

❌ **Problem Flow**:
1. User clicks Login
2. Enter username/password
3. **Immediately redirected back** (no MFA challenge)

If you're getting the problem flow, follow the Auth0 Dashboard configuration steps above.
