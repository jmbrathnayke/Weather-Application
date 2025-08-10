# Auth0 MFA Setup - Authenticator App Method

## Step-by-Step: Enable Authenticator App MFA

### 1. Enable OTP Factor
1. Go to Auth0 Dashboard: https://manage.auth0.com/
2. Navigate to **Security** → **Multi-Factor Auth**
3. Under **Factors**, find **"One-time Password"** 
4. Toggle it **ON** (this should work without issues)

### 2. Create MFA Policy
1. Click the **"Policies"** tab
2. Click **"+ Create Policy"**
3. Name it: "Weather App MFA Policy"
4. Set conditions:
   - **When**: Always
   - **Then**: Require MFA
5. Save the policy

### 3. Test with Test User
1. Login with careers@fidenz.com / Pass#fidenz
2. You'll be prompted to set up an authenticator app
3. Use Google Authenticator, Microsoft Authenticator, or Authy
4. Scan the QR code
5. Enter the 6-digit code from your app

## Alternative: Development Mode (No MFA)

If you want to skip MFA for development:

### 1. Create Development Policy
1. Go to **Security** → **Multi-Factor Auth** → **Policies**
2. Create policy: "Development - No MFA"
3. Set condition: **Never require MFA**
4. This allows testing login/logout without MFA

### 2. Enable MFA Later
Once your app is working, you can:
- Configure email provider properly
- Enable email MFA
- Update policy to require MFA

## Current Status
- ✅ Frontend: http://localhost:5173/
- ✅ Backend: http://localhost:5001/
- ✅ Auth0 configured for login/logout
- 🔧 MFA: Use Authenticator App OR skip for development

Choose the approach that works best for your current testing needs!
