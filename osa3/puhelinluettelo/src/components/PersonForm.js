const PersonForm = ({
  onSubmit,
  onChangeNewName,
  onChangeNewNumber,
  newName,
  newNumber,
}) => {
  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          name: <input value={newName} onChange={onChangeNewName} />
        </div>
        <div>
          number: <input value={newNumber} onChange={onChangeNewNumber} />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </>
  );
};

export default PersonForm;
