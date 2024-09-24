import React, { useMemo } from "react";
import ForecastCard from "./ForecastCard";
import "./FiveDayForecast.css";

const FiveDayForecast = ({ forecast, isCelsius }) => {
  const processedForecast = useMemo(() => {
    if (!forecast || !forecast.list) return [];

    const dailyForecasts = {};

    forecast.list.forEach((entry) => {
      const date = new Date(entry.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "long" });
      const tempHigh = Number(entry.main.temp_max.toFixed(2));
      const tempLow = Number(entry.main.temp_min.toFixed(2));

      if (!dailyForecasts[day] || date.getHours() === 12) {
        dailyForecasts[day] = {
          day,
          highTemp: tempHigh,
          lowTemp: tempLow,
          icon: entry.weather[0].icon,
          description: entry.weather[0].description,
        };
      }
    });

    return Object.values(dailyForecasts).slice(0, 5);
  }, [forecast]);

  if (!forecast) return <p>Loading forecast...</p>;

  return (
    <div className="five-day-forecast">
      <div className="forecast-container">
        {processedForecast.map((dayForecast, index) => (
          <ForecastCard
            key={index}
            day={dayForecast.day}
            highTemp={dayForecast.highTemp}
            lowTemp={dayForecast.lowTemp}
            icon={dayForecast.icon}
            description={dayForecast.description}
            isCelsius={isCelsius}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(FiveDayForecast);