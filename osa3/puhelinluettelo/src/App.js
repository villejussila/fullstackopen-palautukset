import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import phoneBookService from "./services/phoneBookService";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterByValue, setFilterByValue] = useState("");
  const [notification, setNotification] = useState(null);
  const [isError, setIsError] = useState(false);
  const [refreshPersons, setRefreshPersons] = useState(false);

  useEffect(() => {
    phoneBookService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  useEffect(() => {
    if (!refreshPersons) return;
    phoneBookService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
    return () => setRefreshPersons(false);
  }, [refreshPersons]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (doesPersonNameAlreadyExist(persons, newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const id = getPersonId(persons, newName);
        updatePhoneBookPersonById(id);
      }
      return;
    }
    createNewPhoneBookPerson();
  };

  const doesPersonNameAlreadyExist = (persons, personName) => {
    const namesLowerCase = persons.map((person) => person.name.toLowerCase());
    let newNameCopy = personName;
    return namesLowerCase.includes(newNameCopy.toLowerCase());
  };
  const getPersonId = (persons, personName) => {
    const personsLowerCase = persons.map((person) => {
      return { ...person, name: person.name.toLowerCase() };
    });
    let newNameCopy = personName;
    const { id } = personsLowerCase.find(
      (person) => person.name === newNameCopy.toLowerCase()
    );
    return id;
  };
  const updatePhoneBookPersonById = (id) => {
    setIsError(false);
    phoneBookService
      .update(id, { name: newName, number: newNumber })
      .then((returnedPerson) => {
        if (!returnedPerson) setIsError(true);
        setPersons(
          persons.map((person) => (person.id !== id ? person : returnedPerson))
        );
      })
      .then(() => {
        setNewName("");
        setNewNumber("");
        setNotification(`Updated ${newName}`);
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      })
      .catch((error) => {
        setIsError(true);
        setNewName("");
        setNewNumber("");
        setRefreshPersons(true);
        setNotification(
          `Information of ${newName} has already been removed from server`
        );
        setTimeout(() => {
          setNotification(null);
          setIsError(false);
        }, 5000);
        return;
      });
  };
  const createNewPhoneBookPerson = () => {
    phoneBookService
      .create({ name: newName, number: newNumber })
      .then((returnedPerson) => {
        setPersons((persons) => [...persons, returnedPerson]);
        setIsError(false);
        setNewName("");
        setNewNumber("");
        setNotification(`Added ${newName}`);
      })
      .catch((error) => {
        setNotification(error.response.data.error);
        setIsError(true);
      });
    setTimeout(() => {
      setNotification(null);
      setIsError(false);
    }, 5000);
  };
  const handleFilterShown = (e) => {
    setFilterByValue(e.target.value);
  };
  const handleAddNumber = (e) => {
    setNewNumber(e.target.value);
  };
  const handleAddName = (e) => {
    setNewName(e.target.value);
  };
  const handleDeletePerson = (id) => {
    const { name } = persons.find((person) => person.id === id);
    if (name && window.confirm(`Delete ${name}?`))
      phoneBookService
        .deletePersonById(id)
        .then(setPersons(persons.filter((person) => person.id !== id)));
    setNotification(`Deleted ${name}`);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} isError={isError} />
      <Filter value={filterByValue} onChange={handleFilterShown} />
      <h3>Add new</h3>
      <PersonForm
        onSubmit={handleSubmit}
        newName={newName}
        newNumber={newNumber}
        onChangeNewName={handleAddName}
        onChangeNewNumber={handleAddNumber}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        filterByValue={filterByValue}
        onClick={handleDeletePerson}
      />
    </div>
  );
};

export default App;
