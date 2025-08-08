# Weather Application

A full-stack weather application built with React (frontend) and Node.js/Express (backend) that provides current weather information and 5-day forecasts for any city worldwide.

## Features

- **Current Weather**: Get real-time weather data for any city
- **5-Day Forecast**: View detailed weather forecasts for the next 5 days
- **Weather Dashboard**: View weather for multiple cities simultaneously
- **Group Weather API**: Get weather data for multiple predefined cities
- **Intelligent Caching**: 5-minute cache expiration with automatic cleanup
- **Cache Monitoring**: Real-time cache statistics and performance insights
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: User-friendly error messages for invalid cities or network issues
- **Loading States**: Visual feedback during API calls

## Tech Stack

### Frontend
- React 19.1.1
- Vite (build tool)
- Axios (HTTP client)
- React Icons
- CSS3 with modern styling

### Backend
- Node.js
- Express.js
- Axios (for external API calls)
- CORS middleware
- dotenv (environment variables)
- OpenWeatherMap API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key (free from [https://openweathermap.org/api](https://openweathermap.org/api))

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/jmbrathnayke/Weather-Application.git
cd Weather-Application
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

Edit the `.env` file and add your OpenWeatherMap API key:
```env
PORT=5000
OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 3. Frontend Setup
```bash
cd ../frontend/weather-app
npm install
```

## Running the Application

### Start the Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

### Start the Frontend Application
```bash
cd frontend/weather-app
npm run dev
```
The frontend application will start on `http://localhost:5173`

## Cache System & Performance

### Monitoring Cache Performance
- **Cache Info Component**: Real-time cache statistics display
- **Browser Console**: Detailed cache operation logs
- **Automatic Expiration**: Cache entries expire after 5 minutes
- **Background Cleanup**: Memory management every 60 seconds

### Cache Console Logs
Monitor cache operations in the browser console:
```
🗄️ Cached data for key: current_London (expires in 5 minutes)
⏰ Cache automatically expired for key: current_London after 5 minutes
🧹 Cleaned up 3 expired cache entries
```

### Performance Benefits
- Reduced API calls to OpenWeatherMap
- Faster response times for repeated requests
- Lower bandwidth usage
- Better user experience with instant cache hits

## API Endpoints

### Backend API Routes

**Health & System:**
- `GET /api/health` - Health check endpoint

**Individual City Weather:**
- `GET /api/weather/current/:city` - Get current weather for a city
- `GET /api/weather/forecast/:city` - Get 5-day forecast for a city

**Group Weather API:**
- `GET /api/weather/cities-weather` - Get current weather for all predefined cities
- `GET /api/weather/cities` - Get list of all available cities

**Dashboard Routes:**
- Multiple city weather display endpoints
- Bulk weather data processing

### Example API Response

**Current Weather:**
```json
{
  "city": "London",
  "country": "GB",
  "temperature": {
    "current": 15,
    "feels_like": 14,
    "min": 12,
    "max": 18
  },
  "weather": {
    "main": "Clouds",
    "description": "scattered clouds",
    "icon": "03d"
  },
  "details": {
    "humidity": 65,
    "pressure": 1013,
    "visibility": 10,
    "wind": {
      "speed": 3.5,
      "direction": 240
    }
  }
}
```

## Project Structure

```
Weather-Application/
├── backend/
│   ├── routes/
│   │   ├── weather-new.js         # Part 1 compliant endpoints
│   │   └── weather-dashboard.js   # Dashboard functionality
│   ├── cities.json                # Predefined cities data
│   ├── package.json
│   ├── server.js
│   ├── test-routes.js            # API testing utilities
│   └── .env                      # Environment variables
├── frontend/
│   └── weather-app/
│       ├── src/
│       │   ├── components/
│       │   │   ├── WeatherApp.jsx
│       │   │   ├── WeatherDashboard.jsx
│       │   │   ├── CitiesWeather.jsx
│       │   │   ├── CacheInfo.jsx        # Cache monitoring
│       │   │   ├── SearchBar.jsx
│       │   │   ├── WeatherCard.jsx
│       │   │   ├── ForecastList.jsx
│       │   │   ├── ErrorMessage.jsx
│       │   │   └── LoadingSpinner.jsx
│       │   ├── services/
│       │   │   └── weatherService.js    # Enhanced caching service
│       │   ├── App.jsx
│       │   ├── App-dashboard.jsx        # Dashboard app version
│       │   └── main.jsx
│       ├── public/
│       │   └── cities.json             # Frontend cities data
│       ├── package.json
│       └── vite.config.js
└── README.md
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `OPENWEATHER_API_KEY` - Your OpenWeatherMap API key
- `NODE_ENV` - Environment mode (development/production)

### Frontend Configuration
- API base URL configured in `weatherService.js`
- Cache settings (5-minute expiration, 60-second cleanup)
- Dashboard and monitoring endpoints

## Getting OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API keys section
4. Generate a new API key
5. Copy the key to your `.env` file

## Features in Detail

### Intelligent Caching System
- **5-minute cache expiration** for optimal performance
- **Automatic cleanup** every 60 seconds to free memory
- **Dual-layer caching** (frontend + backend)
- **Cache monitoring** with real-time statistics
- **Performance optimization** to reduce API calls

### Dashboard Functionality
- **Multi-city weather display** for predefined cities
- **Bulk weather processing** for efficient data loading
- **Group API endpoints** for simultaneous city updates
- **Cache performance insights** for monitoring system efficiency

### Search Functionality
- Search for weather by city name
- Auto-submit on Enter key
- Input validation and sanitization

### Weather Display
- Current temperature with feels-like temperature
- Weather conditions with icons
- Min/max temperatures for the day
- Detailed information (humidity, pressure, wind, visibility)

### 5-Day Forecast
- Daily weather predictions
- Temperature ranges
- Weather conditions and icons
- Additional details (humidity, wind speed)

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface
- Optimized for various screen sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Built with [React](https://reactjs.org/) and [Express](https://expressjs.com/)