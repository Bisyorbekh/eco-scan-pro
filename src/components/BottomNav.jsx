import { NavLink } from "react-router-dom";

function Item({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => "navItem" + (isActive ? " active" : "")}
    >
      <span className="navIcon">{icon}</span>
      <span className="navLabel">{label}</span>
    </NavLink>
  );
}

export default function BottomNav() {
  return (
    <nav className="bottomNav">
      <Item to="/scan" label="Scan" icon="⌁" />
      <Item to="/pay" label="Pay" icon="▦" />
      <Item to="/wallet" label="Wallet" icon="⟠" />
      <Item to="/bonus" label="Bonus" icon="✦" />
    </nav>
  );
}
