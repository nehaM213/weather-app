import React, { useState, useCallback, useMemo } from "react";
import "./CityDropdown.css";
import { LuSearch } from "react-icons/lu";

const cities = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Philadelphia",
  "Phoenix",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
];

const CityDropdown = React.memo(({ onCitySelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredCities = useMemo(() => {
    if (searchTerm === "") return cities;
    return cities.filter((city) =>
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setIsDropdownOpen(true);
  }, []);

  const handleCitySelect = useCallback(
    (city) => {
      setSearchTerm(city);
      setIsDropdownOpen(false);
      onCitySelect(city);
    },
    [onCitySelect]
  );

  const handleInputChange = useCallback(
    (e) => {
      handleSearch(e.target.value);
    },
    [handleSearch]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && searchTerm.trim() !== "") {
        e.preventDefault();
        handleCitySelect(searchTerm.trim());
      }
    },
    [searchTerm, handleCitySelect]
  );

  return (
    <div className="city-dropdown">
      <div className="input-container">
        <input
          type="text"
          value={searchTerm}
          onClick={() => setIsDropdownOpen(true)}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for a city..."
          className="city-input"
        />
        <LuSearch className="search-icon" />
      </div>

      {isDropdownOpen && (
        <div className="dropdown">
          <ul className="city-list">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <li
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className="city-item"
                >
                  {city}
                </li>
              ))
            ) : searchTerm.trim() !== "" ? (
              <li
                onClick={() => handleCitySelect(searchTerm.trim())}
                className="custom-city city-item"
              >
                Search for "{searchTerm.trim()}"
              </li>
            ) : (
              <li className="no-city">No cities found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
});

CityDropdown.displayName = "CityDropdown";

export default CityDropdown;
