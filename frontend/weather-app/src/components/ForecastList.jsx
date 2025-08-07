const ForecastList = ({ forecast }) => {
  const { city, country, forecast: dailyForecasts } = forecast;

  return (
    <div className="forecast-list">
      <h3>5-Day Forecast for {city}, {country}</h3>
      <div className="forecast-container">
        {dailyForecasts.map((day, index) => {
          const iconUrl = `https://openweathermap.org/img/wn/${day.weather.icon}@2x.png`;
          const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
          const isToday = index === 0;
          
          return (
            <div key={index} className={`forecast-item ${isToday ? 'today' : ''}`}>
              <div className="forecast-day">
                {isToday ? 'Today' : dayName}
              </div>
              
              <img 
                src={iconUrl} 
                alt={day.weather.description}
                className="forecast-icon"
              />
              
              <div className="forecast-temps">
                <span className="temp-max">{day.temperature.max}°</span>
                <span className="temp-min">{day.temperature.min}°</span>
              </div>
              
              <div className="forecast-description">
                {day.weather.description}
              </div>
              
              <div className="forecast-details">
                <small>Humidity: {day.details.humidity}%</small>
                <small>Wind: {day.details.wind} m/s</small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastList;
