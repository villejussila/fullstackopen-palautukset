import React, { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather?q=";

const Country = ({ country }) => {
  const [weatherInfo, setWeatherInfo] = useState();
  useEffect(() => {
    if (!country) return;
    axios
      .get(
        `${WEATHER_BASE_URL}${country.capital}&appid=${API_KEY}&units=metric`
      )
      .then((res) => {
        setWeatherInfo(res.data);
      });
  }, [country]);
  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>
        {country.languages.map((language) => (
          <li key={language.name}>{language.name}</li>
        ))}
      </ul>
      <img src={country.flag} alt="flag" />
      <h3>Weather in {country.capital}</h3>
      <div>
        <p>
          <strong>temperature:</strong>{" "}
          {weatherInfo ? weatherInfo.main.temp : null} Celsius
        </p>
        <p>{weatherInfo ? weatherInfo.weather[0].description : null}</p>
        <p>
          <strong>wind:</strong> {weatherInfo ? weatherInfo.wind.speed : null}{" "}
          m/s
        </p>
      </div>
    </div>
  );
};

export default Country;
