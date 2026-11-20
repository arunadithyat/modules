import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { call } from "../lib/api";
import { money, shortDate } from "../lib/format";
import type { HomeSummary, Lead, Quote } from "../lib/types";
import { useAsync } from "../components/useAsync";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export function Home() {
  const { boot } = useAuth();
  const cur = boot?.currency || "INR";
  const summary = useAsync(() => call<HomeSummary>("dashboard.home_summary"));
  const quotes = useAsync(() => call<Quote[]>("sales.list_quotes", { limit: 5 }));
  const leads = useAsync(() => call<Lead[]>("crm.list_leads", { limit: 5 }));
  const first = boot?.full_name.split(" ")[0];

  return (
    <div className="page">
      <h1 className="page-title">{greeting()}, {first}.</h1>

      {summary.error ? <p className="error">{summary.error}</p> : (
        <dl className="figures" aria-busy={summary.loading}>
          <div><dt>Billed this month</dt><dd>{summary.data ? money(summary.data.sales_this_month, cur) : "—"}</dd></div>
          <div><dt>Waiting to be collected</dt><dd>{summary.data ? money(summary.data.to_collect, cur) : "—"}</dd></div>
          <div><dt>Open quotes</dt><dd>{summary.data?.open_quotes ?? "—"}</dd></div>
          <div><dt>New leads this month</dt><dd>{summary.data?.new_leads ?? "—"}</dd></div>
        </dl>
      )}

      <div className="two-col">
        <section>
          <div className="section-head"><h2>Recent quotes</h2><Link to="/sales/quotes">See all quotes</Link></div>
          {quotes.error && <p className="error">{quotes.error}</p>}
          <ul className="rows">
            {quotes.data?.map((q) => (
              <li key={q.name}><span>{q.customer}<small>{shortDate(q.date)}, {q.status.toLowerCase()}</small></span><strong className="num">{money(q.total, q.currency)}</strong></li>
            ))}
            {quotes.data?.length === 0 && <li className="empty">No quotes yet. Create one from Sales to see it here.</li>}
          </ul>
        </section>
        <section>
          <div className="section-head"><h2>Newest leads</h2><Link to="/crm/leads">See all leads</Link></div>
          {leads.error && <p className="error">{leads.error}</p>}
          <ul className="rows">
            {leads.data?.map((l) => (
              <li key={l.name}><span>{l.lead_name}<small>{l.company_name || "No company"}</small></span><span className="pill">{l.status}</span></li>
            ))}
            {leads.data?.length === 0 && <li className="empty">No leads yet. Add your first one from CRM.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}
