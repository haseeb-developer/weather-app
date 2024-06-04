// src/components/Weather.js
import React from "react";

const Weather = ({ data }) => {
  const {
    current: { wind_kph, wind_dir, pressure_mb, humidity, vis_km, uv },
  } = data;

  return (
    <div>
      <p>
        Wind: {wind_kph} kph {wind_dir}
      </p>
      <p>Pressure: {pressure_mb} mb</p>
      <p>Humidity: {humidity}%</p>
      <p>Visibility: {vis_km} km</p>
      <p>UV Index: {uv}</p>
    </div>
  );
};

export default Weather;
