import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { fetchWeatherData } from '../services/weatherService';
import './SearchBar.css';

const SearchBar = ({ onWeatherData, onLoading, onError }) => {
  const [city, setCity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!city.trim()) {
      onError('Please enter a city name');
      return;
    }

    onLoading(true);
    
    try {
      const data = await fetchWeatherData(city.trim());
      onWeatherData(data);
    } catch (error) {
      onError(error.message);
    } finally {
      onLoading(false);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
