// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Search from "./components/Search";
import Weather from "./components/Weather";
import "./App.css";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [background, setBackground] = useState("");
  const [localTime, setLocalTime] = useState(moment().format("LTS"));
  const [cityTime, setCityTime] = useState("");
  const [locationEnabled, setLocationEnabled] = useState(false);

  const weatherBackgrounds = {
    rain: "url(https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
    fog: "url(https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
    clear:
      "url(https://images.pexels.com/photos/547114/pexels-photo-547114.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
    storm:
      "url(https://images.pexels.com/photos/1123445/pexels-photo-1123445.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
    snowfall:
      "url(https://images.pexels.com/photos/1671359/pexels-photo-1671359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
    default: "linear-gradient(to right, #6a11cb, #2575fc)",
  };

  const weatherIcons = {
    rain: "🌧️",
    fog: "🌫️",
    clear: "☀️",
    storm: "⛈️",
    snowfall: "❄️",
    // Add more conditions as needed, - Will do
  };

  const fetchWeather = async (query) => {
    const API_KEY = "b8669da1b19d4716bda161750242705";
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}`
      );
      setWeatherData(response.data);
      updateBackground(response.data.current.condition.text);
      setCityTime(moment(response.data.location.localtime).format("LTS"));

      const forecastResponse = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=7`
      );
      setForecastData(forecastResponse.data.forecast.forecastday);
    } catch (error) {
      console.error("Error fetching the weather data", error);
    }
  };

  const fetchWeatherByCoords = async (latitude, longitude) => {
    const query = `${latitude},${longitude}`;
    await fetchWeather(query);
  };

  const updateBackground = (weatherCondition) => {
    const condition = weatherCondition.toLowerCase();
    if (condition.includes("rain")) {
      setBackground(weatherBackgrounds.rain);
    } else if (condition.includes("fog")) {
      setBackground(weatherBackgrounds.fog);
    } else if (condition.includes("clear")) {
      setBackground(weatherBackgrounds.clear);
    } else if (condition.includes("storm")) {
      setBackground(weatherBackgrounds.storm);
    } else if (condition.includes("snow")) {
      setBackground(weatherBackgrounds.snowfall);
    } else {
      setBackground(weatherBackgrounds.default);
    }
  };

  const handleSearch = (city) => {
    setLocationEnabled(false); // Reset locationEnabled state
    fetchWeather(city);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLocalTime(moment().format("LTS"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    document.body.style.backgroundImage = background;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center";
  }, [background]);

  useEffect(() => {
    if (locationEnabled) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
          },
          (error) => {
            console.error("Error fetching geolocation", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  }, [locationEnabled]);

  return (
    <div className="container-fluid p-0 text-white">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container d-flex justify-content-between">
          <Search onSearch={handleSearch} />
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            onClick={() => setLocationEnabled(true)}
          >
            Use My Location
          </button>
        </div>
      </nav>
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="card bg-dark mb-4">
              <div className="card-body">
                <h3>Current time at your place: {localTime}</h3>
              </div>
            </div>
          </div>
          {weatherData && (
            <>
              <div className="col-12 col-md-4">
                <div className="card bg-dark mb-4">
                  <div className="card-body">
                    <h1 className="display-4">
                      {Math.round(weatherData.current.temp_c)}°C{" "}
                      {weatherIcons[
                        weatherData.current.condition.text.toLowerCase()
                      ] || ""}
                    </h1>
                    <p className="lead">{weatherData.current.condition.text}</p>
                    <p>
                      Feels like: {Math.round(weatherData.current.feelslike_c)}
                      °C
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-8">
                <div className="card bg-dark mb-4">
                  <div className="card-body">
                    <h2>
                      {weatherData.location.name},{" "}
                      {weatherData.location.country}
                    </h2>
                    <p>Current time in this city: {cityTime}</p>
                    <Weather data={weatherData} />
                    {forecastData && (
                      <div className="forecast mt-4">
                        {forecastData.map((day) => (
                          <div key={day.date} className="forecast-day">
                            <h4>{moment(day.date).format("ddd")}</h4>
                            <p>{day.day.condition.text}</p>
                            <p>
                              {Math.round(day.day.maxtemp_c)}° /{" "}
                              {Math.round(day.day.mintemp_c)}°
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
