import { Link } from "react-router-dom";

export default function SectionTitle({ children, to, action = "Ver todo →", onClick }) {
  return (
    <div className="section-title">
      <h2>{children}</h2>
      {to ? (
        <Link to={to}>{action}</Link>
      ) : onClick ? (
        <button className="text-button" onClick={onClick}>
          {action}
        </button>
      ) : null}
    </div>
  );
}
