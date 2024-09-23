import React, { useState, useEffect } from "react";
import ForecastCard from "./ForecastCard";
import "./FiveDayForecast.css"; // Add styles for layout

const FiveDayForecast = ({ city, unit }) => {
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");

  const apiKey = "e6fcfdc84ecdc8d7bde5356632936820"; // Replace with your OpenWeatherMap API key

  // Function to fetch 5-day forecast
  const getFiveDayForecast = async () => {
    setError("");
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch the weather data");
      }
      const data = await response.json();
      //if unit is not celsius, convert the temperature to celsius
      if (!unit) {
        data.list.forEach((entry) => {
          entry.main.temp_max = ((entry.main.temp_max - 32) * 5) / 9;
          entry.main.temp_min = ((entry.main.temp_min - 32) * 5) / 9;
        });
      }
      processForecastData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to process and group forecast data by day
  const processForecastData = (data) => {
    const dailyForecasts = {};

    data.list.forEach((entry) => {
      const date = new Date(entry.dt * 1000); // Convert timestamp to date
      const day = date.toLocaleDateString("en-US", { weekday: "long" }); // Get day of the week
      const tempHigh = entry.main.temp_max;
      const tempLow = entry.main.temp_min;
      const icon = entry.weather[0].icon;
      const description = entry.weather[0].description;

      // Only keep one entry per day (around noon)
      if (!dailyForecasts[day] || date.getHours() === 12) {
        dailyForecasts[day] = {
          day,
          highTemp: tempHigh,
          lowTemp: tempLow,
          icon,
          description,
        };
      }
    });

    // Convert the object to an array and keep only 5 days
    setForecast(Object.values(dailyForecasts).slice(0, 5));
  };

  useEffect(() => {
    getFiveDayForecast(); // Fetch forecast on component mount
  }, [city]);

  return (
    <div className="five-day-forecast">
      {error && <p className="error">{error}</p>}

      {forecast.length > 0 ? (
        <div className="forecast-container">
          {forecast.map((dayForecast, index) => (
            <ForecastCard
              key={index}
              day={dayForecast.day}
              highTemp={dayForecast.highTemp}
              lowTemp={dayForecast.lowTemp}
              icon={dayForecast.icon}
              description={dayForecast.description}
              unit={unit}
            />
          ))}
        </div>
      ) : (
        <p>Loading forecast...</p>
      )}
    </div>
  );
};

export default FiveDayForecast;
