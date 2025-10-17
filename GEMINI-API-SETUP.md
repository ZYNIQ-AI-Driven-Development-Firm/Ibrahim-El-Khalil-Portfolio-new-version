# Gemini API Setup Guide

## Issue
The AI Chat assistant was showing the error: "Sorry, I'm having trouble connecting to the AI service. Please try again later."

## Root Cause
React environment variables need to be available at **build time**, not runtime. Since the frontend runs in a Docker container, the `REACT_APP_GEMINI_API_KEY` needs to be baked into the JavaScript bundle during the `npm run build` step.

## Solution

### 1. Environment Variable Configuration
The Gemini API key is stored in two `.env` files:

**Root `.env`** (for docker-compose):
```properties
GEMINI_API_KEY=your_api_key_here
```

**frontend/.env`** (for local development):
```properties
GEMINI_API_KEY=your_api_key_here
```

### 2. Docker Configuration

**docker-compose.yml**:
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
    args:
      GEMINI_API_KEY: ${GEMINI_API_KEY}  # Passes to build
  environment:
    REACT_APP_GEMINI_API_KEY: ${GEMINI_API_KEY}  # Runtime (not used by React)
```

**frontend/Dockerfile**:
```dockerfile
# Copy .env file if it exists (for local builds)
COPY .env* ./

# Copy source code
COPY . .

# Accept build argument for Gemini API key
ARG GEMINI_API_KEY
# Use build arg if provided, otherwise use .env file
ENV REACT_APP_GEMINI_API_KEY=${GEMINI_API_KEY:-}

# Build the app (bakes env vars into bundle)
RUN npm run build
```

### 3. How It Works
1. Docker Compose reads `GEMINI_API_KEY` from root `.env`
2. Passes it as build argument to Dockerfile
3. Dockerfile copies `frontend/.env` as fallback
4. Sets `GEMINI_API_KEY` which React reads during build
5. `npm run build` bakes the API key into the JavaScript bundle
6. The built app can now use the API key client-side

### 4. Rebuild Process
After updating the API key, you must rebuild the frontend:

```powershell
cd "path\to\Ibrahim-El-Khalil-Portfolio-new-version"

# Stop and remove existing container
docker-compose stop frontend
docker-compose rm -f frontend

# Rebuild with no cache (important!)
docker-compose build --no-cache frontend

# Start the container
docker-compose up -d frontend
```

### 5. Verify the Fix
1. Go to http://localhost:3000/portfolio
2. Click the "CHAT" button on the right side
3. Type a message like "Tell me about Ibrahim"
4. The AI should respond without errors

### 6. Security Note
⚠️ **Important**: The API key is baked into the client-side JavaScript bundle, which means it's visible to anyone who inspects the page source. For production:

- Use API key restrictions in Google Cloud Console
- Restrict to your domain (e.g., `smartportal-2.preview.emergentagent.com`)
- Set up rate limiting
- Consider using a backend proxy instead of direct client-side calls

### 7. Troubleshooting

**Check if API key is in the bundle**:
```powershell
docker exec portfolio_frontend sh -c "cat /usr/share/nginx/html/static/js/main.*.js | grep AIzaSy"
```

If you see the actual API key (starts with `AIzaSy`), it's working!
If you see `GEMINI_API_KEY` instead, rebuild with `--no-cache`.

**Check Docker build logs**:
```powershell
docker-compose build frontend 2>&1 | Select-String "REACT_APP"
```

**Check if .env exists in container during build**:
```powershell
docker-compose build frontend 2>&1 | Select-String "\.env"
```

### 8. Alternative: Local Development
For local development without Docker:

```powershell
cd frontend
npm install
npm start
```

The app will automatically read from `frontend/.env` file.

## Files Modified
- ✅ `frontend/Dockerfile` - Added .env copy and proper ARG handling
- ✅ `docker-compose.yml` - Already configured correctly
- ✅ `frontend/.env` - API key present
- ✅ Root `.env` - API key present

## Next Steps
1. Wait for current build to complete
2. Start the frontend container
3. Test the AI chat functionality
4. Verify no errors in browser console
