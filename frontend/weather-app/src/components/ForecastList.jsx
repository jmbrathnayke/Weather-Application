const ForecastList = ({ weatherData, forecastData }) => {
  // Handle cases where forecast data might be undefined
  if (!forecastData || !Array.isArray(forecastData) || forecastData.length === 0) {
    return <div className="forecast-list">Loading forecast data...</div>;
  }

  // Group forecast data by date (since API returns hourly data)
  const dailyForecasts = [];
  const groupedByDate = {};

  forecastData.forEach(item => {
    // OpenWeather API uses 'dt_txt' for datetime, fallback to 'datetime' for compatibility
    const datetime = item.dt_txt || item.datetime;
    if (!datetime) {
      console.warn('Forecast item missing datetime:', item);
      return; // Skip this item if no datetime found
    }
    
    const date = datetime.split(' ')[0]; // Get date part only
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(item);
  });

  // Create daily summaries (taking midday data as representative)
  Object.keys(groupedByDate).slice(0, 5).forEach(date => {
    const dayData = groupedByDate[date];
    // Find midday forecast or use first available
    const representativeData = dayData.find(item => {
      const datetime = item.dt_txt || item.datetime;
      return datetime && datetime.includes('12:00');
    }) || dayData[0];
    
    // Calculate min/max temps for the day
    const temps = dayData.map(item => item.main?.temp || item.temperature || 0);
    const tempMin = Math.min(...temps);
    const tempMax = Math.max(...temps);
    
    dailyForecasts.push({
      date: date,
      temperature: representativeData.main?.temp || representativeData.temperature || 0,
      tempMin: tempMin,
      tempMax: tempMax,
      description: representativeData.weather?.[0]?.description || representativeData.description || 'Unknown',
      icon: representativeData.weather?.[0]?.icon || representativeData.icon || '01d',
      humidity: representativeData.main?.humidity || representativeData.humidity || 0,
      windSpeed: representativeData.wind?.speed || representativeData.windSpeed || 0
    });
  });

  return (
    <div className="forecast-list">
      {/* Current Weather Card */}
      {weatherData && (
        <div className="current-weather-card">
          <h3>Current Weather - {weatherData.name}</h3>
          <div className="current-weather-content">
            <div className="current-weather-main">
              <img 
                src={`https://openweathermap.org/img/wn/${weatherData.weather?.[0]?.icon || weatherData.icon || '01d'}@4x.png`}
                alt={weatherData.weather?.[0]?.description || weatherData.description || 'Weather'}
                className="current-weather-icon"
              />
              <div className="current-weather-info">
                <div className="current-temp">{Math.round(weatherData.main?.temp || weatherData.temperature || 0)}°C</div>
                <div className="current-desc">{weatherData.weather?.[0]?.description || weatherData.description || 'Unknown'}</div>
              </div>
            </div>
            <div className="current-weather-details">
              <div className="detail-item">
                <span className="detail-label">Feels like</span>
                <span className="detail-value">{Math.round(weatherData.main?.feels_like || weatherData.feelsLike || weatherData.main?.temp || weatherData.temperature || 0)}°C</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weatherData.main?.humidity || weatherData.humidity || 0}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind</span>
                <span className="detail-value">{weatherData.wind?.speed || weatherData.windSpeed || 0} m/s</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{weatherData.main?.pressure || weatherData.pressure || 'N/A'} hPa</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <h3>5-Day Forecast</h3>
      <div className="forecast-container">
        {dailyForecasts.map((day, index) => {
          const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
          const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
          const isToday = index === 0;
          
          return (
            <div key={index} className={`forecast-item ${isToday ? 'today' : ''}`}>
              <div className="forecast-day">
                {isToday ? 'Today' : dayName}
              </div>
              
              <img 
                src={iconUrl} 
                alt={day.description}
                className="forecast-icon"
              />
              
              <div className="forecast-temps">
                <span className="temp-max">{day.tempMax}°</span>
                <span className="temp-min">{day.tempMin}°</span>
              </div>
              
              <div className="forecast-description">
                {day.description}
              </div>
              
              <div className="forecast-details">
                <small>💧 {day.humidity}%</small>
                <small>💨 {day.windSpeed} m/s</small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastList;
