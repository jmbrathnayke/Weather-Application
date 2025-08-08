import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch, loading, placeholder = "Enter city name..." }) => {
  const [city, setCity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!city.trim()) {
      return;
    }

    // Call the onSearch function passed from parent
    await onSearch(city.trim());
    
    // Clear the input after search
    setCity('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder={placeholder}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={loading || !city.trim()}
        >
          {loading ? (
            <div className="search-loading">⏳</div>
          ) : (
            <FaSearch />
          )}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
