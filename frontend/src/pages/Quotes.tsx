import { useState } from "react";
import { call } from "../lib/api";
import { money, shortDate } from "../lib/format";
import type { Quote } from "../lib/types";
import { useAsync } from "../components/useAsync";

export function Quotes() {
  const { data, error, loading, reload } = useAsync(() => call<Quote[]>("sales.list_quotes", { limit: 50 }));
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const convert = async (q: Quote) => {
    setBusy(q.name); setNotice(null);
    try {
      const r = await call<{ order: string }>("sales.convert_quote_to_order", { quote: q.name }, true);
      setNotice({ kind: "ok", text: `Order ${r.order} created from ${q.customer}'s quote.` });
      reload();
    } catch (e) {
      setNotice({ kind: "error", text: e instanceof Error ? e.message : "Couldn't create the order." });
    } finally { setBusy(null); }
  };

  return (
    <div className="page">
      <h1 className="page-title">Quotes</h1>
      {notice && <p className={notice.kind === "ok" ? "notice" : "error"} role="status">{notice.text}</p>}
      {error && <p className="error">{error}</p>}
      <div className="table-wrap" aria-busy={loading}>
        <table>
          <thead><tr><th>Customer</th><th>Date</th><th>Status</th><th className="num">Total</th><th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {data?.map((q) => (
              <tr key={q.name}>
                <td>{q.customer}<small className="muted block">{q.name}</small></td>
                <td>{shortDate(q.date)}</td>
                <td><span className="pill">{q.status}</span></td>
                <td className="num">{money(q.total, q.currency)}</td>
                <td className="actions">
                  {q.status === "Open" && (
                    <button className="btn" disabled={busy === q.name} onClick={() => convert(q)}>
                      {busy === q.name ? "Creating order…" : "Create order"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {data?.length === 0 && <tr><td colSpan={5} className="empty">No submitted quotes yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
