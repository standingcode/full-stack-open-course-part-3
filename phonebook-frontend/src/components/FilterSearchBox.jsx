const FilterSearchBox = ({ filter, filterFieldChanged }) => {
  return (
    <div>
      Filter results
      <input value={filter} onChange={filterFieldChanged} />
    </div>
  );
};

export default FilterSearchBox;
