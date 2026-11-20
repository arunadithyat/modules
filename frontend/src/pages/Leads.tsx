import { useState, type FormEvent } from "react";
import { call } from "../lib/api";
import { shortDate } from "../lib/format";
import type { Lead } from "../lib/types";
import { useAsync } from "../components/useAsync";

const blank = { first_name: "", company_name: "", email: "", phone: "" };

export function Leads() {
  const { data, error, loading, reload } = useAsync(() => call<Lead[]>("crm.list_leads", { limit: 50 }));
  const [form, setForm] = useState(blank);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof blank) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [k]: e.target.value }); setFormError("");
  };

  const add = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.first_name.trim()) { setFormError("Add the contact's first name."); return; }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) { setFormError("That email address looks incomplete."); return; }
    setSaving(true);
    try { await call("crm.create_lead", form, true); setForm(blank); reload(); }
    catch (err) { setFormError(err instanceof Error ? err.message : "Couldn't add the lead."); }
    finally { setSaving(false); }
  };

  return (
    <div className="page">
      <h1 className="page-title">Leads</h1>
      <form className="inline-form" onSubmit={add} noValidate>
        <input placeholder="First name" value={form.first_name} onChange={set("first_name")} aria-label="First name" />
        <input placeholder="Company" value={form.company_name} onChange={set("company_name")} aria-label="Company" />
        <input placeholder="Email" type="email" value={form.email} onChange={set("email")} aria-label="Email" />
        <input placeholder="Phone" value={form.phone} onChange={set("phone")} aria-label="Phone" />
        <button className="btn primary" disabled={saving}>{saving ? "Adding…" : "Add lead"}</button>
        {formError && <p className="error full" role="alert">{formError}</p>}
      </form>
      {error && <p className="error">{error}</p>}
      <div className="table-wrap" aria-busy={loading}>
        <table>
          <thead><tr><th>Name</th><th>Company</th><th>Contact</th><th>Status</th><th>Added</th></tr></thead>
          <tbody>
            {data?.map((l) => (
              <tr key={l.name}>
                <td>{l.lead_name}</td>
                <td>{l.company_name || <span className="muted">—</span>}</td>
                <td>{l.email || l.phone || <span className="muted">—</span>}</td>
                <td><span className="pill">{l.status}</span></td>
                <td>{shortDate(l.creation)}</td>
              </tr>
            ))}
            {data?.length === 0 && <tr><td colSpan={5} className="empty">No leads yet. Add your first one above.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
