import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

// For now Genie routes simple intents. The AI service will replace `route()` with a real call.
const intents: [RegExp, string][] = [
  [/quote|quotation|order/i, "/sales/quotes"],
  [/lead|prospect|contact/i, "/crm/leads"],
  [/home|summary|today/i, "/"],
];

export function GenieBar() {
  const [text, setText] = useState("");
  const [hint, setHint] = useState("");
  const navigate = useNavigate();

  const route = (e: FormEvent) => {
    e.preventDefault();
    const q = text.trim();
    if (!q) { setHint("Type what you want to do, like “show open quotes”."); return; }
    const match = intents.find(([re]) => re.test(q));
    if (match) { navigate(match[1]); setText(""); setHint(""); }
    else setHint("Genie can open quotes, leads and your summary for now. More is coming.");
  };

  return (
    <form className="genie" onSubmit={route} role="search">
      <label htmlFor="genie-input" className="genie-label">Ask Genie</label>
      <input
        id="genie-input"
        value={text}
        onChange={(e) => { setText(e.target.value); setHint(""); }}
        placeholder="Show open quotes, add a lead…"
        autoComplete="off"
      />
      {hint && <p className="genie-hint" role="status">{hint}</p>}
    </form>
  );
}
