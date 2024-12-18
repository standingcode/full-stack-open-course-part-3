const AddUserForm = ({
  newName,
  addNameInputFieldChanged,
  newNumber,
  addNumberInputFieldChanged,
  addNameInputFieldSubmitted,
}) => {
  return (
    <form onSubmit={addNameInputFieldSubmitted}>
      <div>
        name: <input value={newName} onChange={addNameInputFieldChanged} />
      </div>
      <div>
        number:{" "}
        <input value={newNumber} onChange={addNumberInputFieldChanged} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default AddUserForm;
