# Auth0 Email MFA Setup Guide

## 🔐 Complete Email MFA Configuration

### Step 1: Enable Email MFA in Auth0 Dashboard

1. **Login to Auth0 Dashboard**: https://manage.auth0.com/
2. **Navigate to Security > Multi-Factor Auth**
3. **Configure Email MFA**:
   - Find "Email" in the MFA factors list
   - Toggle it to **"Enabled"**
   - Click "Settings" to configure email options
   - Set email template and sender if needed

### Step 2: Get Your Application Client ID

1. **Go to Applications > Applications**
2. **Find your Weather App application** 
3. **Copy the Client ID** (it looks like: `GeUrVqERtsiyrkeqUwuZIMLQbiMtvaqK`)
4. **Update the MFA Action code** with your actual Client ID

### Step 3: Create and Deploy MFA Action

1. **Go to Actions > Library**
2. **Click "Create Action"**:
   - Name: `Force Email MFA`
   - Trigger: `Login / Post Login`
   - Runtime: `Node 18`
3. **Replace the code** with the content from `auth0-force-mfa-action.js`
4. **Update Line 16** with your actual Client ID:
   ```javascript
   const weatherAppClientId = "YOUR_ACTUAL_CLIENT_ID_HERE";
   ```
5. **Click "Deploy"**

### Step 4: Add Action to Login Flow

1. **Go to Actions > Flows**
2. **Click on "Login"**
3. **Drag your "Force Email MFA" action** to the flow
4. **Place it in the "Post Login" section**
5. **Click "Apply"**

### Step 5: Configure MFA Policy (Optional but Recommended)

1. **Go to Security > Multi-Factor Auth**
2. **Click "Policies"**
3. **Create a new policy**:
   - Name: `Weather App Email MFA`
   - Condition: `Application is Weather App`
   - Require: `Email MFA`

### Step 6: Test MFA Flow

1. **Logout from your application completely**
2. **Clear browser cache/cookies**
3. **Login again with email/password**
4. **You should now see Email MFA challenge**

## 🚨 Troubleshooting

### If MFA Still Not Appearing:

1. **Check Action Logs**:
   - Go to Monitoring > Logs
   - Look for your action execution logs
   - Check for any errors

2. **Verify Client ID**:
   - Make sure the Client ID in the action matches your app
   - Check Applications > Applications for correct ID

3. **Clear Auth0 Session**:
   - Logout completely
   - Clear browser cookies for auth0.com
   - Try incognito/private mode

4. **Check MFA Settings**:
   - Ensure Email MFA is enabled
   - Verify email configuration works

### Common Issues:

- **Wrong Client ID**: Action won't trigger for your app
- **MFA Not Enabled**: Email option not available
- **Cached Session**: Old session bypasses MFA
- **Action Not Deployed**: Changes not active

## 🔍 Debug Steps

1. **Check Browser Console** for Auth0 logs
2. **Monitor Auth0 Logs** in dashboard
3. **Test with Different User** to eliminate cache issues
4. **Verify Action Deployment** is successful

## 📧 Email MFA Flow

After setup, the flow will be:
1. User enters email/password
2. Auth0 validates credentials
3. Action forces Email MFA challenge
4. User receives email with verification code
5. User enters code to complete login
6. Access granted to Weather Dashboard

## ⚠️ Important Notes

- Email MFA requires valid email addresses
- Check spam folder for MFA emails
- Email delivery may take 1-2 minutes
- Always test in incognito mode first
