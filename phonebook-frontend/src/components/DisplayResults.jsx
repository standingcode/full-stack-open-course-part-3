const DisplayResults = ({ persons, deleteCallback }) => {
  return persons.map((person) => (
    <DisplaySingleResult
      person={person}
      key={person.id}
      deleteCallback={deleteCallback}
    />
  ));
};

const DisplaySingleResult = ({ person, deleteCallback }) => {
  return (
    <div key={person.name}>
      {person.name} {person.number}{" "}
      <button onClick={() => deleteCallback(person.id)}>DELETE</button>
    </div>
  );
};

export default DisplayResults;
