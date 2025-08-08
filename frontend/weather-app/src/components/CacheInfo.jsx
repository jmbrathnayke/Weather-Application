import { useState, useEffect } from 'react';
import { getCacheInfo, clearWeatherCache } from '../services/weatherService';

const CacheInfo = ({ isVisible, onToggle }) => {
  const [cacheInfo, setCacheInfo] = useState({ size: 0, entries: [] });
  const [autoRefresh, setAutoRefresh] = useState(false);

  const refreshCacheInfo = () => {
    setCacheInfo(getCacheInfo());
  };

  const handleClearCache = () => {
    clearWeatherCache();
    refreshCacheInfo();
  };

  useEffect(() => {
    if (isVisible) {
      refreshCacheInfo();
    }
  }, [isVisible]);

  useEffect(() => {
    let interval;
    if (autoRefresh && isVisible) {
      interval = setInterval(refreshCacheInfo, 1000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, isVisible]);

  if (!isVisible) {
    return (
      <button 
        className="cache-info-toggle"
        onClick={onToggle}
        title="Show Cache Information"
      >
        📊 Cache ({cacheInfo.size})
      </button>
    );
  }

  return (
    <div className="cache-info-panel">
      <div className="cache-info-header">
        <h4>Cache Information</h4>
        <div className="cache-info-controls">
          <label className="auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh
          </label>
          <button onClick={refreshCacheInfo}>🔄 Refresh</button>
          <button onClick={handleClearCache} className="clear-cache">🧹 Clear Cache</button>
          <button onClick={onToggle} className="close-button">✕</button>
        </div>
      </div>

      <div className="cache-info-stats">
        <div className="cache-stat">
          <span className="cache-stat-label">Total Entries:</span>
          <span className="cache-stat-value">{cacheInfo.size}</span>
        </div>
        <div className="cache-stat">
          <span className="cache-stat-label">Cache Duration:</span>
          <span className="cache-stat-value">5 minutes</span>
        </div>
      </div>

      {cacheInfo.size > 0 && (
        <div className="cache-entries">
          <h5>Cached Data:</h5>
          <div className="cache-entries-list">
            {cacheInfo.entries.map((entry, index) => (
              <div key={index} className="cache-entry">
                <div className="cache-entry-key">{entry.key}</div>
                <div className="cache-entry-info">
                  <span className="cache-entry-age">Age: {entry.age}s</span>
                  <span className="cache-entry-remaining">
                    Expires in: {entry.remainingTime}s
                  </span>
                </div>
                <div className={`cache-entry-status ${entry.remainingTime > 60 ? 'fresh' : 'expiring'}`}>
                  {entry.remainingTime > 60 ? '🟢 Fresh' : '🟡 Expiring Soon'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cacheInfo.size === 0 && (
        <div className="cache-empty">
          <p>No data currently cached</p>
          <small>Search for weather data to see cache entries appear here</small>
        </div>
      )}
    </div>
  );
};

export default CacheInfo;
