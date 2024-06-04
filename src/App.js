// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Search from "./components/Search";
import Weather from "./components/Weather";
import "./App.css";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [background, setBackground] = useState("");
  const [time, setTime] = useState(moment().format("LTS"));
  const [locationEnabled, setLocationEnabled] = useState(false);

  const weatherBackgrounds = {
    rain: "url(https://static.vecteezy.com/system/resources/thumbnails/033/645/252/small_2x/drizzle-rainy-day-in-autumn-background-and-wallpaper-generative-ai-photo.jpg)",
    clear:
      "url(https://images.pexels.com/photos/1133505/pexels-photo-1133505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
    // Add more realistic backgrounds as needed
    default: "linear-gradient(to right, #6a11cb, #2575fc)",
  };

  const weatherIcons = {
    rain: "🌧️",
    clear: "☀️",
    // Add more conditions as needed
  };

  const fetchWeather = async (query) => {
    const API_KEY = "b8669da1b19d4716bda161750242705";
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}`
      );
      setWeatherData(response.data);
      updateBackground(response.data.current.condition.text);
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
    } else if (condition.includes("clear")) {
      setBackground(weatherBackgrounds.clear);
    } else {
      setBackground(weatherBackgrounds.default);
    }
  };

  const handleSearch = (city) => {
    fetchWeather(city);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(moment().format("LTS"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    document.body.style.backgroundImage = background;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
  }, [background]);

  useEffect(() => {
    if (locationEnabled) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  }, [locationEnabled]);

  return (
    <div className="container-fluid p-0 text-white main-container">
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
      {weatherData && (
        <div className="container mt-4">
          <div className="row">
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
                    Feels like: {Math.round(weatherData.current.feelslike_c)}°C
                  </p>
                  <p className="live-time">{time}</p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-8">
              <div className="card bg-dark mb-4">
                <div className="card-body">
                  <h2>{weatherData.location.name}</h2>
                  <p>
                    {moment(weatherData.location.localtime).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </p>
                  <Weather data={weatherData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
