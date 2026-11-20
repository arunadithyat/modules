import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { Shell } from "./components/Shell";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Quotes } from "./pages/Quotes";
import { Leads } from "./pages/Leads";
import { ComingSoon } from "./pages/ComingSoon";

export default function App() {
  const { boot, loading } = useAuth();
  if (loading) return <div className="boot-loading">Loading your workspace…</div>;
  if (!boot) return <Login />;

  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Home />} />
        <Route path="sales/quotes" element={<Quotes />} />
        <Route path="crm/leads" element={<Leads />} />
        <Route path="accounts" element={<ComingSoon title="Invoices & payments" />} />
        <Route path="inventory" element={<ComingSoon title="Stock" />} />
        <Route path="manufacturing" element={<ComingSoon title="Production" />} />
        <Route path="people" element={<ComingSoon title="Team & leave" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
