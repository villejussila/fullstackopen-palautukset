import React from "react";

const Persons = ({ persons, filterByValue, onClick }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.name}>
          {filterByValue ? (
            person.name.toLowerCase().includes(filterByValue.toLowerCase()) ? (
              <>
                {person.name} {person.number}
                <button onClick={() => onClick(person.id)}>delete</button>
              </>
            ) : null
          ) : (
            <>
              {person.name} {person.number}
              <button onClick={() => onClick(person.id)}>delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Persons;
