import React from "react";
import "./ForecastCard.css"; // Add your styles

const ForecastCard = ({ day, highTemp, lowTemp, icon, description, unit }) => {
  return (
    <div className="forecast-card">
      <h3>{day}</h3>
      <img
        src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description}
      />
      <p>{description}</p>
      <p>High: {unit ? highTemp : highTemp}°C</p>
      <p>Low: {lowTemp}°C</p>
    </div>
  );
};

export default ForecastCard;
