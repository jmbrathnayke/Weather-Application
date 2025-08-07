# Weather Application

A full-stack weather application built with React (frontend) and Node.js/Express (backend) that provides current weather information and 5-day forecasts for any city worldwide.

## Features

- **Current Weather**: Get real-time weather data for any city
- **5-Day Forecast**: View detailed weather forecasts for the next 5 days
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

## API Endpoints

### Backend API Routes

- `GET /api/health` - Health check endpoint
- `GET /api/weather/current/:city` - Get current weather for a city
- `GET /api/weather/forecast/:city` - Get 5-day forecast for a city

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
│   │   └── weather.js
│   ├── package.json
│   ├── server.js
│   └── .env.example
├── frontend/
│   └── weather-app/
│       ├── src/
│       │   ├── components/
│       │   │   ├── WeatherApp.jsx
│       │   │   ├── SearchBar.jsx
│       │   │   ├── WeatherCard.jsx
│       │   │   ├── ForecastList.jsx
│       │   │   ├── ErrorMessage.jsx
│       │   │   └── LoadingSpinner.jsx
│       │   ├── services/
│       │   │   └── weatherService.js
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
└── README.md
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `OPENWEATHER_API_KEY` - Your OpenWeatherMap API key

## Getting OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API keys section
4. Generate a new API key
5. Copy the key to your `.env` file

## Features in Detail

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