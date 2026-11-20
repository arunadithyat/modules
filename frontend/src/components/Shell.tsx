import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { isDemo } from "../lib/api";
import { GenieBar } from "./GenieBar";
import type { ModuleKey } from "../lib/types";

const links: Record<ModuleKey, { to: string; label: string }[]> = {
  sales: [{ to: "/sales/quotes", label: "Quotes" }],
  crm: [{ to: "/crm/leads", label: "Leads" }],
  accounts: [{ to: "/accounts", label: "Invoices & payments" }],
  inventory: [{ to: "/inventory", label: "Stock" }],
  manufacturing: [{ to: "/manufacturing", label: "Production" }],
  hrms: [{ to: "/people", label: "Team & leave" }],
};

export function Shell() {
  const { boot, signOut } = useAuth();
  if (!boot) return null;

  return (
    <div className="shell">
      <aside className="rail">
        <div className="brand">Automate<span>Genie</span></div>
        <nav aria-label="Modules">
          <NavLink to="/" end className="nav-link">Home</NavLink>
          {boot.modules.map((m) => (
            <div key={m.key} className="nav-group">
              <p className="nav-group-title">{m.label}</p>
              {links[m.key]?.map((l) => (
                <NavLink key={l.to} to={l.to} className="nav-link">{l.label}</NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="rail-foot">
          <p className="who">{boot.full_name}</p>
          <p className="muted small">{boot.company}</p>
          <button className="link-btn" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <GenieBar />
          {isDemo && <span className="demo-tag">Demo data</span>}
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  );
}
