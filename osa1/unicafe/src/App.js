import React, { useState } from "react";

const Statistics = ({ good, bad, neutral, all, average, positive }) => {
  if (all === 0)
    return (
      <div>
        <h1>Statistics</h1>
        No feedback given
      </div>
    );
  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} />
        </tbody>
      </table>
    </div>
  );
};
const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};
const Button = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  const handleClickGood = () => {
    setGood((val) => val + 1);
    setAll((val) => val + 1);
    setAverage((good + 1 - bad) / (all + 1));
    setPositive(((good + 1) / (all + 1)) * 100 + " %");
  };
  const handleClickNeutral = () => {
    setNeutral((val) => val + 1);
    setAll((val) => val + 1);
    setAverage((good - bad) / (all + 1));
    setPositive((good / (all + 1)) * 100 + " %");
  };
  const handleClickBad = () => {
    setBad((val) => val + 1);
    setAll((val) => val + 1);
    setAverage((good - (bad + 1)) / (all + 1));
    setPositive((good / (all + 1)) * 100 + " %");
  };

  return (
    <div>
      <h1>Give feedback</h1>
      <Button text="good" onClick={handleClickGood} />
      <Button text="neutral" onClick={handleClickNeutral} />
      <Button text="bad" onClick={handleClickBad} />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        all={all}
        average={average}
        positive={positive}
      />
    </div>
  );
};

export default App;
