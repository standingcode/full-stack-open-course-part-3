import { skipMiddlewareFunction } from "mongoose";
import DisplayResults from "./DisplayResults.jsx";

const FilteredResults = ({ persons, filter, deleteCallback }) => {
  if (filter === undefined) {
    filter = "";
  }

  if (persons === undefined) {
    persons = [];
  }

  const filteredPersons =
    filter === ""
      ? persons
      : persons.filter((person) => {
          if (person.name) {
            person.name.toLowerCase().includes(filter.toLowerCase());
          }
        });

  return (
    <DisplayResults
      key={"persons"}
      persons={filteredPersons}
      deleteCallback={deleteCallback}
    />
  );
};

export default FilteredResults;
