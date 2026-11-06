export default function Tabs({ items, value, onChange }) {
  return (
    <div className="tabs">
      {items.map((item) => (
        <button
          key={item}
          className={`pill ${value === item ? "selected" : ""}`}
          onClick={() => onChange(item)}
          aria-pressed={value === item}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
