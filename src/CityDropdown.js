import React, { useState } from "react";
import "./CityDropdown.css"; // Add some styles (defined earlier)
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
  // You can add more cities here
];

const CityDropdown = ({ onCitySelect }) => {
  const [searchTerm, setSearchTerm] = useState(""); // User search input
  const [filteredCities, setFilteredCities] = useState(cities); // Filtered city list
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Modal visibility
  const [selectedCity, setSelectedCity] = useState(null); // Currently selected city

  // Filter the cities based on user search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedCity(null); // Clear the selected city when typing starts
    setIsDropdownOpen(true); // Open dropdown when typing

    if (value === "") {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  };

  // When a city is selected
  const handleCitySelect = (city) => {
    setSelectedCity(city); // Set selected city
    setSearchTerm(""); // Clear search input
    setIsDropdownOpen(false); // Close dropdown
    onCitySelect(city); // Notify parent about the selection
  };

  return (
    <div className="city-dropdown">
      <div className="input-container">
        <input
          type="text"
          value={selectedCity || searchTerm} // Show selected city or search term
          onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
          onChange={handleSearch} // Update search term
          placeholder="Search for a city..."
          className="city-input"
        />
        <LuSearch className="search-icon"/>
      </div>

      {isDropdownOpen && (
        <div className="dropdown">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search cities..."
            className="search-input"
          />

          <ul className="city-list">
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <li
                  key={index}
                  onClick={() => handleCitySelect(city)}
                  className="city-item"
                >
                  {city}
                </li>
              ))
            ) : (
              <li className="no-city">No cities found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CityDropdown;
