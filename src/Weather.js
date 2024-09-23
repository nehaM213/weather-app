// src/Weather.js
import React, { useEffect, useState } from "react";
import CityDropdown from "./CityDropdown";
import FiveDayForecast from "./FiveDayForecast";

const Weather = () => {
  const [city, setCity] = useState("New York");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);
  const [temp, setTemp] = useState(0);

  const apiKey = "e6fcfdc84ecdc8d7bde5356632936820"; // Replace with your OpenWeatherMap API key

  const getWeather = async () => {
    setError(""); // Clear previous errors
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found!");
        } else {
          throw new Error("Something went wrong! Please try again later.");
        }
      }

      const data = await response.json();
      //if fahrenheit is true, convert the temperature to fahrenheit
      if (!isCelsius) {
        // convert the temperature to fahrenheit
        data.main.temp = (data.main.temp * 9) / 5 + 32;
      }
      setWeather(data);
      setTemp(data.main.temp);
    } catch (err) {
      setError("City not found!");
      setWeather(null);
    }
  };

  const handleCitySelect = (city) => {
    setCity(city);
    getWeather(city);
  };

  useEffect(() => {
    getWeather(city); // Fetch weather for New York on initial load
  }, []);

  useEffect(() => {
  //if isCelsius is true change the temprature to celsius else change to fahrenhiet
  if (isCelsius) {
    //convert the temperature to celsius
    let t=((temp - 32) * 5) / 9;
    // setTemp(((temp - 32) * 5) / 9);
    // set it to 2 decimal places
    setTemp(Math.round(t * 100) / 100);
  } else {
    setTemp((temp * 9) / 5 + 32);
  }
  }, [isCelsius]);

  return (
    <div className="weather-app">
      {weather && (
        <>
          <div className="header">
            <h1>{weather.name}</h1>
            <div>
              <CityDropdown onCitySelect={(city) => handleCitySelect(city)} />
              {error && <p className="error">{error}</p>}
              <div className="celsius-label-container">
                <label htmlFor="celsius" className="celsius-label">
                  Show in Fahrenheit
              </label>
              <input
                type="checkbox"
                id="celsius"
                checked={!isCelsius}
                onChange={() => setIsCelsius(!isCelsius)}
              />
              </div>
            </div>
          </div>
          <div className="weather-info-container">
            <div className="weather-info-container-left">
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="weather-icon"
              />
              <div>
                <p className="weather-temp">
                  {temp} {isCelsius ? "°C" : "°F"}
                </p>
                <p className="weather-condition">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>
            <div className="weather-info-container-right">
              <FiveDayForecast city={city} unit={isCelsius} />
            </div>
          </div>

          <div>
            <div>{/* <button onClick={getWeather}>Get Weather</button> */}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
