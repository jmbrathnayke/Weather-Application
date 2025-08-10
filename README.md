# WeatherLive - Modern Weather Application

A sophisticated full-stack weather application with real-time weather data, intelligent caching, Auth0 authentication, and cafe recommendations. Built with React (frontend) and Node.js/Express (backend) featuring a modern glass morphism UI design.

## ✨ Features

### 🌤️ Weather Intelligence
- **Real-time Weather Data**: Current weather conditions for cities worldwide
- **5-Day Forecasts**: Detailed weather predictions with hourly breakdowns  
- **Weather Dashboard**: Beautiful overview of multiple cities
- **Smart Caching**: Frontend + Backend caching for improved performance
- **Cache Analytics**: Real-time cache statistics and management

### 🔐 Authentication & Security
- **Auth0 Integration**: Secure user authentication with MFA support
- **JWT Token Management**: Automatic token handling and refresh
- **Protected Routes**: Authenticated access to weather features
- **Development Mode**: Bypass authentication for testing

### ☕ Location Intelligence
- **Cafe Recommendations**: Smart cafe suggestions when viewing cached city data
- **Weather-Based Suggestions**: Recommendations adapted to current weather conditions
- **Local Business Info**: Mock cafe data with ratings, distances, and specialties

### 🎨 Modern UI/UX
- **Glass Morphism Design**: Beautiful translucent interface with backdrop blur effects
- **Gradient Backgrounds**: Dynamic color schemes and modern typography
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Smooth animations and user feedback
- **Error Handling**: Comprehensive error messages and recovery options

## 🛠️ Tech Stack

### Frontend
- **React 18+** with hooks and modern patterns
- **Vite** - Lightning fast build tool
- **Auth0 React SDK** - Authentication management
- **Axios** - HTTP client with interceptors
- **Modern CSS** - Glass morphism, gradients, responsive design

### Backend  
- **Node.js & Express** - RESTful API server
- **Auth0 Management API** - User authentication & MFA
- **Redis-like Caching** - In-memory caching system
- **JWKS Verification** - JWT token validation
- **OpenWeatherMap API** - Weather data provider

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **OpenWeatherMap API Key** - [Get free API key](https://openweathermap.org/api)
- **Auth0 Account** - [Sign up for free](https://auth0.com/) (Optional for development)

## 🚀 Quick Start Guide

### 1️⃣ Clone and Setup
```bash
# Clone the repository
git clone https://github.com/jmbrathnayke/Weather-Application.git
cd Weather-Application

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend/weather-app
npm install
```

### 2️⃣ Environment Configuration

#### Backend Setup (`backend/.env`)
```bash
cd backend
cp .env.example .env
```

Configure your `.env` file:
```env
# Server Configuration
PORT=5002
NODE_ENV=development

# Weather API
OPENWEATHER_API_KEY=your_openweathermap_api_key_here

# Auth0 Configuration (Optional for development)
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_AUDIENCE=your-api-identifier
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret

# Development Mode (bypasses Auth0)
DEVELOPMENT_MODE=true
```

#### Frontend Setup (`frontend/weather-app/.env`)
```env
# Auth0 Configuration (Optional)
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=your-api-identifier
```

### 3️⃣ Start Development Servers

#### Terminal 1 - Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:5002
```

#### Terminal 2 - Frontend Application  
```bash
cd frontend/weather-app
npm run dev  
# App runs on http://localhost:5173
```

## 🧪 Testing the Application

### Development Mode Testing (Recommended)
1. Set `DEVELOPMENT_MODE=true` in backend `.env`
2. Start both servers as described above
3. Open `http://localhost:5173` in your browser
4. **No login required** - authentication is bypassed in development

### With Auth0 Authentication
1. Configure Auth0 environment variables
2. Set `DEVELOPMENT_MODE=false` in backend `.env`  
3. Users must authenticate via Auth0 login

### Core Features to Test

#### 🌍 Weather Dashboard
- **Access**: Available immediately on login/development mode
- **Features**: View weather for multiple pre-loaded cities
- **Cache**: Data cached for 5 minutes, check cache panel

#### 🔍 City Search  
- **Test Cities**: Try "London", "New York", "Tokyo", "Sydney"
- **Cache Behavior**: Search same city twice to see cache in action
- **Error Handling**: Try invalid city names like "XYZ123"

#### ☕ Cafe Recommendations
- **Trigger**: Search for a city, then search for the same city again
- **Location**: Cafe panel appears below search results when data is cached
- **Features**: Weather-based recommendations, ratings, distances

#### 📊 Cache Management
- **Access**: Click "📊 Cache" button in interface
- **Features**: View active cache entries, clear cache, auto-refresh stats
- **Testing**: Monitor cache expiration times (5-minute duration)

### 🔧 Advanced Testing

#### API Endpoints Testing
```bash
# Health Check
curl http://localhost:5002/api/health

# Weather Dashboard (requires auth token in production)
curl http://localhost:5002/api/weather/dashboard

# Search Weather
curl "http://localhost:5002/api/weather/search?city=London"
```

#### Cache Testing Scenarios
1. **Fresh Data**: Search new city → No cache indicator
2. **Cached Data**: Repeat search → "📂 Cached Data" label + Cafe panel  
3. **Cache Expiry**: Wait 5+ minutes → Fresh data again
4. **Cache Clear**: Use cache panel to manually clear

#### Error Scenarios to Test
- Invalid city names
- Network disconnection  
- API key issues (remove from .env temporarily)
- Authentication failures (in Auth0 mode)

## 🏗️ Project Architecture

### Directory Structure
```
Weather-Application/
├── 📁 backend/                          # Express.js API Server
│   ├── 📁 middleware/
│   │   ├── auth.js                      # Auth0 JWT verification
│   │   └── auth-simple.js               # Development auth bypass
│   ├── 📁 routes/
│   │   ├── weather.js                   # Weather API endpoints
│   │   ├── weather-dashboard.js         # Dashboard data endpoints
│   │   └── test.js                      # Health check endpoints
│   ├── cities.json                      # City data for dashboard
│   ├── server.js                        # Main server file
│   ├── auth0-force-mfa-action.js       # Auth0 MFA configuration
│   └── package.json
│
├── 📁 frontend/weather-app/             # React Application  
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── AuthButtons.jsx          # Auth0 login/logout
│   │   │   ├── WeatherDashboard.jsx     # Main dashboard view
│   │   │   ├── SearchBar.jsx            # City search input
│   │   │   ├── ForecastList.jsx         # Weather forecast display
│   │   │   ├── CafeInfo.jsx             # Cafe recommendations panel
│   │   │   ├── CacheInfo.jsx            # Cache management panel
│   │   │   └── LoadingSpinner.jsx       # Loading animations
│   │   ├── 📁 services/
│   │   │   └── weatherService.js        # API client & caching
│   │   ├── App.jsx                      # Main app component
│   │   ├── App.css                      # Modern styling (3000+ lines)
│   │   └── main.jsx                     # React entry point
│   └── package.json
│
└── README.md                            # This file
```

## 🌐 API Endpoints

### Authentication
- **Development**: `DEVELOPMENT_MODE=true` bypasses all auth
- **Production**: Requires valid Auth0 JWT token in Authorization header

### Core Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/health` | Server health check | ❌ |
| `GET` | `/api/weather/dashboard` | Multi-city weather dashboard | ✅ |
| `GET` | `/api/weather/search?city={name}` | Single city weather search | ✅ |
| `POST` | `/api/weather/cache/clear` | Clear backend cache | ✅ |

### Response Examples

**Dashboard Response:**
```json
 {"List":[{"CityCode":"1248991","CityName":"Colombo","Temp":"33.0","Status":"Clouds"},{"CityCode":"1850147","CityName":"Tokyo","Temp":"8.6","Status":"Clear"},{"CityCode":"2644210","CityName":"Liverpool","Temp":"16.5","Status":"Rain"},{"CityCode":"2988507","CityName":"Paris","Temp":"22.4","Status":"Clear"},{"CityCode":"2147714","CityName":"Sydney","Temp":"27.3","Status":"Rain"},{"CityCode":"4930956","CityName":"Boston","Temp":"4.2","Status":"Mist"},{"CityCode":"1796236","CityName":"Shanghai","Temp":"10.1","Status":"Clouds"},{"CityCode":"3143244","CityName":"Oslo","Temp":"-3.9","Status":"Clear"}]}
```

**Search Response:**
```json
{
  "success": true,
  "weather": {
    "name": "Tokyo",
    "main": { "temp": 28.5, "humidity": 70 },
    "weather": [{ "main": "Clear", "icon": "01d" }]
  },
  "forecast": [...],
  "cached": false,
  "timestamp": "2025-08-10T10:30:00Z"
}
```

## ⚙️ Configuration Guide

### OpenWeatherMap API Setup
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Create free account
3. Generate API key from dashboard
4. Add to backend `.env` file
5. **Note**: Free tier allows 1000 calls/day

### Auth0 Setup (Optional)
1. Create [Auth0 account](https://auth0.com/)
2. Create new Single Page Application
3. Configure callback URLs:
   - Allowed Callback URLs: `http://localhost:5173`
   - Allowed Logout URLs: `http://localhost:5173`  
   - Allowed Web Origins: `http://localhost:5173`
4. Create API identifier for backend
5. Add credentials to both frontend and backend `.env` files

### Caching Configuration
- **Frontend Cache**: 5 minutes with automatic cleanup
- **Backend Cache**: Configurable in `server.js`
- **Cache Analytics**: Real-time monitoring available in UI

## 🎨 UI Features & Design

### Modern Design Elements
- **Glass Morphism**: Translucent cards with backdrop blur
- **Gradient Backgrounds**: Dynamic color schemes  
- **Responsive Grid**: Flexible layouts for all screen sizes
- **Smooth Animations**: Loading states and hover effects
- **Typography**: Modern font hierarchy with gradient text effects

### Key UI Components
- **Hero Section**: Search interface with gradient backgrounds
- **Dashboard Cards**: Weather data in glass morphism containers  
- **Search Results**: Dynamic results with cache indicators
- **Cafe Panel**: Location intelligence with ratings and recommendations
- **Cache Management**: Real-time statistics and controls

### Mobile Responsiveness
- Breakpoints: 768px, 1024px, 1400px
- Touch-optimized buttons and inputs
- Collapsible navigation and panels
- Optimized typography scaling

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Backend Server Won't Start
```bash
# Check if port 5002 is already in use
netstat -ano | findstr :5002

# Kill process if needed (Windows)
taskkill /PID <process_id> /F

# Use different port
PORT=5003 npm start
```

#### API Authentication Errors
```bash
# Check environment variables
echo $OPENWEATHER_API_KEY

# Test API key manually
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY"

# Enable development mode
# Set DEVELOPMENT_MODE=true in backend/.env
```

#### Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be v18+
```

#### Cache Not Working
- Check browser console for errors
- Verify server restart after cache changes
- Clear browser cache/cookies
- Test in incognito/private mode

#### Cafe Panel Not Appearing
- Search for city twice (first search = fresh, second = cached)
- Check console logs for cache status
- Verify `isCachedData` state in React DevTools

## 📊 Performance & Monitoring

### Cache Performance
- **Frontend Cache**: 5-minute TTL with automatic cleanup
- **Backend Cache**: Reduces API calls by ~80%
- **Cache Hit Ratio**: Monitor via cache info panel

### API Rate Limits  
- **OpenWeatherMap Free**: 1000 calls/day
- **Cached Responses**: Don't count toward limit
- **Rate Limit Monitoring**: Check console logs

### Bundle Sizes
- **Frontend Build**: ~500KB gzipped  
- **Main Bundle**: ~200KB (React + components)
- **CSS Bundle**: ~50KB (Modern styling)

## 🧪 Development & Testing

### Available Scripts

#### Backend
```bash
npm start          # Start production server
npm run dev        # Start with nodemon
npm test           # Run test suite
```

#### Frontend  
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production  
npm run preview    # Preview production build
npm run lint       # Run ESLint
```



## 🚀 Deployment

### Environment Setup
- Set `NODE_ENV=production`
- Set `DEVELOPMENT_MODE=false`  
- Configure production Auth0 settings
- Use production API endpoints

### Build Commands
```bash
# Build frontend
cd frontend/weather-app
npm run build

# The dist/ folder contains production build
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (use checklist above)
5. Commit changes (`git commit -am 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open Pull Request





## 🙏 Acknowledgments

- **Weather Data**: [OpenWeatherMap API](https://openweathermap.org/)
- **Authentication**: [Auth0](https://auth0.com/)
- **Icons & Design**: [React Icons](https://react-icons.github.io/react-icons/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Frameworks**: [React](https://reactjs.org/) & [Express](https://expressjs.com/)





**Happy Weather Tracking! 🌤️**