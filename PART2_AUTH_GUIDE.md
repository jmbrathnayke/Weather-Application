# Part 2: Authentication & Authorization Setup Guide

## Current Status ✅
- Auth0 domain: `dev-weather.us.auth0.com`
- Client ID: `GeUrVqERtsiyrkeqUwuZIMLQbiMtvaqK`
- Frontend: http://localhost:5173/
- Backend: http://localhost:5001/
- Auth0 React SDK: Installed and configured

## Step 1: Auth0 Dashboard Configuration

### 1.1 Login to Auth0 Dashboard
Visit: https://manage.auth0.com/
Login with your Auth0 account

### 1.2 Update Application Settings
1. Navigate to **Applications** → **Applications**
2. Find your application (Client ID: `GeUrVqERtsiyrkeqUwuZIMLQbiMtvaqK`)
3. Update the following fields:

**Allowed Callback URLs:**
```
http://localhost:5173/, http://localhost:5174/, http://localhost:3000/
```

**Allowed Logout URLs:**
```
http://localhost:5173/, http://localhost:5174/, http://localhost:3000/
```

**Allowed Web Origins:**
```
http://localhost:5173, http://localhost:5174, http://localhost:3000
```

## Step 2: Enable Multi-Factor Authentication (MFA)

### 2.1 Configure MFA via Email
1. In Auth0 Dashboard, go to **Security** → **Multi-Factor Auth**
2. Enable **Email** as MFA factor
3. Configure Email settings:
   - Go to **Branding** → **Email Templates**
   - Customize the MFA challenge email template
4. Set MFA policy:
   - Go to **Security** → **Multi-Factor Auth** → **Policies**
   - Create a new policy or edit existing one
   - Set to "Always require MFA" or "Require MFA for specific conditions"

### 2.2 Update Application to Support MFA
Your current Auth0Provider configuration already supports MFA with the scope "openid profile email".

## Step 3: Restrict Signups & Create Test Account

### 3.1 Disable Public Signups
1. In Auth0 Dashboard, go to **Settings** → **Tenant Settings**
2. Under **API Authorization Settings**, find **Default Audience**
3. Go to **Authentication** → **Database** → **Username-Password-Authentication**
4. Click on the connection name
5. Go to **Settings** tab
6. Toggle OFF **Disable Sign Ups**
7. Save changes

### 3.2 Create Test User Account
1. In Auth0 Dashboard, go to **User Management** → **Users**
2. Click **Create User**
3. Fill in the details:
   - **Email:** careers@fidenz.com
   - **Password:** Pass#fidenz
   - **Connection:** Username-Password-Authentication
4. Click **Create**

### 3.3 Alternative: Use Auth0 Management API to Create User
If you prefer programmatic approach, you can use the Management API.

## Step 4: Test the Implementation

### 4.1 Test Login/Logout Flow
1. Open http://localhost:5173/
2. Click "Login" button
3. Use credentials: careers@fidenz.com / Pass#fidenz
4. Verify MFA challenge (if enabled)
5. Test logout functionality

### 4.2 Test Protected Routes
1. Try accessing weather data without login (should redirect to login)
2. Login and verify access to weather features
3. Logout and verify access is restricted

## Step 5: Additional Security Configurations

### 5.1 Configure Session Management
Your current setup uses:
- `cacheLocation: "localstorage"`
- `useRefreshTokens: true`

### 5.2 JWT Token Configuration
1. In Auth0 Dashboard, go to **APIs**
2. Find your API (audience: https://weather-api.example.com)
3. Configure token settings:
   - Token Expiration: 24 hours (recommended)
   - Refresh Token Settings: Enabled

## Troubleshooting

### Common Issues:
1. **Callback URL Mismatch**: Ensure all localhost URLs are added to Auth0 settings
2. **CORS Issues**: Backend CORS is configured for localhost:5173, 5174, 3000
3. **MFA Not Working**: Check email configuration in Auth0 dashboard
4. **Login Redirect Loop**: Verify redirect_uri matches allowed callbacks

### Environment Variables Check:
```
VITE_AUTH0_DOMAIN=dev-weather.us.auth0.com
VITE_AUTH0_CLIENT_ID=GeUrVqERtsiyrkeqUwuZIMLQbiMtvaqK
VITE_AUTH0_AUDIENCE=https://weather-api.example.com
```

## Testing Credentials
- **Email:** careers@fidenz.com
- **Password:** Pass#fidenz

## Next Steps
After completing this setup:
1. Test all authentication flows
2. Verify MFA is working
3. Ensure only registered users can access the application
4. Test the complete user journey from login to accessing weather data

---

**Note:** The application is currently running and ready for testing. Make sure to complete the Auth0 dashboard configurations before testing.
