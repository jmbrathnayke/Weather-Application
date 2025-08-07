import { WiThermometer, WiHumidity, WiBarometer, WiStrongWind } from 'react-icons/wi';
import { FaEye } from 'react-icons/fa';

const WeatherCard = ({ weather }) => {
  const {
    city,
    country,
    temperature,
    weather: weatherInfo,
    details
  } = weather;

  const iconUrl = `https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`;

  return (
    <div className="weather-card">
      <div className="weather-main">
        <div className="location">
          <h2>{city}, {country}</h2>
          <p className="timestamp">{new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="temperature-section">
          <img 
            src={iconUrl} 
            alt={weatherInfo.description}
            className="weather-icon"
          />
          <div className="temperature">
            <span className="temp-current">{temperature.current}°C</span>
            <p className="weather-description">{weatherInfo.description}</p>
            <p className="feels-like">Feels like {temperature.feels_like}°C</p>
          </div>
        </div>
      </div>

      <div className="temperature-range">
        <span>Min: {temperature.min}°C</span>
        <span>Max: {temperature.max}°C</span>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <WiHumidity className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{details.humidity}%</span>
          </div>
        </div>

        <div className="detail-item">
          <WiBarometer className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{details.pressure} hPa</span>
          </div>
        </div>

        <div className="detail-item">
          <WiStrongWind className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">{details.wind.speed} m/s</span>
          </div>
        </div>

        <div className="detail-item">
          <FaEye className="detail-icon" />
          <div className="detail-info">
            <span className="detail-label">Visibility</span>
            <span className="detail-value">{details.visibility} km</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
