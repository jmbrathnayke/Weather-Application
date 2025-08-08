import { WiThermometer, WiHumidity, WiBarometer, WiStrongWind } from 'react-icons/wi';
import { FaEye } from 'react-icons/fa';

const WeatherCard = ({ weather, cacheInfo, compact = false }) => {
  // Handle cases where weather data might be undefined or incomplete
  if (!weather) {
    return <div className="weather-card">Loading weather data...</div>;
  }

  const {
    name: city,
    country,
    temperature,
    description,
    icon,
    humidity,
    windSpeed,
    tempMin,
    tempMax,
    pressure,
    feelsLike,
    visibility
  } = weather;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className={`weather-card ${compact ? 'compact' : ''}`}>
      {cacheInfo?.frontendCached && !compact && (
        <div className="cache-indicator">
          🎯 Served from cache ({cacheInfo.timestamp ? new Date(cacheInfo.timestamp).toLocaleTimeString() : 'unknown time'})
        </div>
      )}
      
      <div className="weather-main">
        <div className="location">
          <h2>{city}, {country}</h2>
          {!compact && <p className="timestamp">{new Date().toLocaleDateString()}</p>}
        </div>
        
        <div className="temperature-section">
          <img 
            src={iconUrl} 
            alt={description}
            className="weather-icon"
          />
          <div className="temperature">
            <span className="temp-current">{temperature}°C</span>
            <p className="weather-description">{description}</p>
            {!compact && feelsLike && (
              <p className="feels-like">Feels like {feelsLike}°C</p>
            )}
          </div>
        </div>
      </div>

      <div className="temperature-range">
        <span>Min: {tempMin}°C</span>
        <span>Max: {tempMax}°C</span>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <WiHumidity className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{humidity}%</span>
          </div>
        </div>

        <div className="detail-item">
          <WiStrongWind className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">{windSpeed} m/s</span>
          </div>
        </div>

        {!compact && pressure && (
          <div className="detail-item">
            <WiBarometer className="detail-icon" />
            <div className="detail-info">
              <span className="detail-label">Pressure</span>
              <span className="detail-value">{pressure} hPa</span>
            </div>
          </div>
        )}

        {!compact && visibility && (
          <div className="detail-item">
            <FaEye className="detail-icon" />
            <div className="detail-info">
              <span className="detail-label">Visibility</span>
              <span className="detail-value">{visibility} km</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
