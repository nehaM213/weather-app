import React from "react";
import "./ForecastCard.css";

const ForecastCard = React.memo(
  ({ day, highTemp, lowTemp, icon, description, isCelsius }) => {
    const temperatureUnit = isCelsius ? "°C" : "°F";

    return (
      <div className="forecast-card">
        <h3>{day}</h3>
        <img
          src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={description}
          loading="lazy"
        />
        <p>{description}</p>
        <p>
          High: {highTemp}
          {temperatureUnit}
        </p>
        <p>
          Low: {lowTemp}
          {temperatureUnit}
        </p>
      </div>
    );
  }
);

ForecastCard.displayName = "ForecastCard";

export default ForecastCard;
