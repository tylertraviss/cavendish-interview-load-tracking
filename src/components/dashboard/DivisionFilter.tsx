interface DivisionFilterProps {
  divisions: string[];
  selected: string | null;
  onSelect: (division: string | null) => void;
}

const DivisionFilter = ({ divisions, selected, onSelect }: DivisionFilterProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className={`filter-chip ${selected === null ? "filter-chip-active" : "filter-chip-inactive"}`}
        onClick={() => onSelect(null)}
      >
        All Divisions
      </button>
      {divisions.map((div) => (
        <button
          key={div}
          className={`filter-chip ${selected === div ? "filter-chip-active" : "filter-chip-inactive"}`}
          onClick={() => onSelect(selected === div ? null : div)}
        >
          {div}
        </button>
      ))}
    </div>
  );
};

export default DivisionFilter;
