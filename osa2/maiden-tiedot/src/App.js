import axios from "axios";
import { useState, useEffect } from "react";
import CountryList from "./components/CountryList";

const COUNTRIES_URL = "https://restcountries.eu/rest/v2/all";

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [searchCountry, setSearchCountry] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    axios.get(COUNTRIES_URL).then((res) => {
      setAllCountries(res.data);
    });
  }, []);

  useEffect(() => {
    const result = allCountries.reduce((matches, country) => {
      if (country.name.toLowerCase().includes(searchCountry.toLowerCase())) {
        matches.push(country);
      }
      return matches;
    }, []);
    setSearchResults(result);
  }, [searchCountry, allCountries]);

  const handleChangeSearchValue = (e) => {
    setSearchCountry(e.target.value);
  };

  return (
    <div className="App">
      <div>
        find countries{" "}
        <input value={searchCountry} onChange={handleChangeSearchValue} />
      </div>
      {searchCountry ? <CountryList countries={searchResults} /> : null}
    </div>
  );
}

export default App;
