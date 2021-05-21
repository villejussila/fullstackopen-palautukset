import React, { useState, useEffect } from "react";
import Country from "./Country";

const CountryList = ({ countries }) => {
  const [isShowInfo, setIsShowInfo] = useState(false);
  const [showCountryInfo, setShowCountryInfo] = useState();

  useEffect(() => {
    setIsShowInfo(false);
    if (countries.length === 1) {
      setIsShowInfo(true);
      setShowCountryInfo(countries[0]);
    }
  }, [countries]);

  const handleShowCountry = (country) => {
    setIsShowInfo(true);
    setShowCountryInfo(country);
  };
  if (countries.length > 10)
    return <p>Too many matches, specify another filter</p>;
  if (isShowInfo) {
    return <Country country={showCountryInfo} />;
  }
  if (countries.length < 10 && countries.length >= 1) {
    return (
      <div>
        {countries.map((country) => (
          <div key={country.name}>
            {country.name}
            <button onClick={() => handleShowCountry(country)}>show</button>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default CountryList;
