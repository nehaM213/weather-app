import React, { useEffect, useState, useCallback, useMemo } from "react";
import CityDropdown from "./CityDropdown";
import FiveDayForecast from "./FiveDayForecast";
import { FiRefreshCw } from "react-icons/fi";
import "./App.css";
import debounce from 'lodash.debounce';

const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

const Weather = () => {
  const [city, setCity] = useState("New York");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  const weatherCache = useMemo(() => new Map(), []);

  const fetchData = useCallback(
    async (url, cacheKey, forceRefresh = false) => {
      const cachedData = weatherCache.get(cacheKey);
      const now = Date.now();

    if (
      !forceRefresh &&
      cachedData &&
      now - cachedData.timestamp < CACHE_DURATION
    ) {
      return cachedData.data;
    }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "City not found!"
            : "Something went wrong! Please try again later."
        );
      }
      const data = await response.json();
      weatherCache.set(cacheKey, { data, timestamp: now });
      return data;
    },
    [weatherCache]
  );

  const getWeatherAndForecast = useCallback(async (selectedCity, forceRefresh = false) => {
    setError("");
    setIsRefreshing(true);
    const units = isCelsius ? "metric" : "imperial";
    const weatherCacheKey = `weather-${selectedCity}-${units}`;
    const forecastCacheKey = `forecast-${selectedCity}-${units}`;

    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchData(
          `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=${units}`,
          weatherCacheKey,
          forceRefresh
        ),
        fetchData(
          `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&appid=${apiKey}&units=${units}`,
          forecastCacheKey,
          forceRefresh
        ),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, [apiKey, isCelsius, fetchData]);

  const debouncedGetWeatherAndForecast = useMemo(
    () => debounce(getWeatherAndForecast, 300),
    [getWeatherAndForecast]
  );

  useEffect(() => {
    debouncedGetWeatherAndForecast(city);
    return () => debouncedGetWeatherAndForecast.cancel();
  }, [debouncedGetWeatherAndForecast, city]);

  const handleCitySelect = useCallback((selectedCity) => {
    setCity(selectedCity);
  }, []);

  const handleRefresh = useCallback(() => {
    // console.log("Refreshing weather data...");  
    setIsRefreshing(true);
    getWeatherAndForecast(city, true);
  }, [city, getWeatherAndForecast]);

  const toggleUnit = useCallback(() => {
    setIsCelsius((prev) => !prev);
  }, []);

  const getTemperature = useCallback(() => {
    if (!weather?.main) return "";
    return `${weather.main.temp.toFixed(2)} ${isCelsius ? "°C" : "°F"}`;
  }, [weather, isCelsius]);

  if (!weather || !forecast) return <div>Loading...</div>;

  return (
    <div className="weather-app">
      <div className="refresh-container">
        <button
          onClick={handleRefresh}
          className={`refresh-button ${isRefreshing ? "refreshing" : ""}`}
          disabled={isRefreshing}
        >
          <FiRefreshCw className={isRefreshing ? "spin" : ""} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
      <div className="header">
        <h1>{weather.name}</h1>
        <div>
          <CityDropdown onCitySelect={handleCitySelect} />
          {error && <p className="error">{error}</p>}
          <div className="celsius-label-container">
            <label htmlFor="celsius" className="celsius-label">
              Show in Fahrenheit
            </label>
            <input
              type="checkbox"
              id="celsius"
              checked={!isCelsius}
              onChange={toggleUnit}
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
            <p className="weather-temp">{getTemperature()}</p>
            <p className="weather-condition">
              {weather.weather[0].description}
            </p>
          </div>
        </div>
        <div className="weather-info-container-right">
          <FiveDayForecast forecast={forecast} isCelsius={isCelsius} />
        </div>
      </div>
    </div>
  );
};

export default Weather;