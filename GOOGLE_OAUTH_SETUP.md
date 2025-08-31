# Google OAuth Setup Guide

## Prerequisites

- Google Cloud Console account
- A Google Cloud Project

## Steps to Set Up Google OAuth

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

### 2. Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Trilha Clara IA"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users if needed

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `http://localhost:4000` (for backend)
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:4000/auth/callback`
6. Copy the Client ID

### 4. Configure Environment Variables

#### Frontend (.env.local)

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
```

#### Backend (.env)

```bash
GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 5. Update Configuration Files

#### Frontend (config/google.ts)

```typescript
export const GOOGLE_CONFIG = {
  CLIENT_ID:
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id-here',
}
```

### 6. Test the Integration

1. Start the backend server: `cd backend && rails server -p 4000`
2. Start the frontend: `cd frontend && npm run dev`
3. Try signing up/signing in with Google

## Troubleshooting

### Common Issues:

1. **"Invalid Client ID"**: Make sure the client ID is correct and the domain is authorized
2. **"Redirect URI mismatch"**: Check that your redirect URIs match exactly
3. **"API not enabled"**: Ensure Google+ API and OAuth2 API are enabled

### Security Notes:

- Never commit your actual client ID to version control
- Use environment variables for sensitive configuration
- In production, use HTTPS URLs for redirects
- Consider implementing additional security measures like state parameter validation

## Production Deployment

When deploying to production:

1. Update authorized origins and redirect URIs to your production domain
2. Use HTTPS URLs
3. Set appropriate environment variables on your hosting platform
4. Consider implementing additional security measures
