// In-memory backend used by `npm run dev:demo`, so the UI can be explored without ERPNext.
import type { Boot, HomeSummary, Lead, Quote } from "./types";

const quotes: Quote[] = [
  { name: "SAL-QTN-2026-00042", customer: "Meridian Textiles", date: "2026-11-19", total: 184500, currency: "INR", status: "Open" },
  { name: "SAL-QTN-2026-00041", customer: "Kaveri Agro Foods", date: "2026-11-17", total: 62300, currency: "INR", status: "Open" },
  { name: "SAL-QTN-2026-00039", customer: "Northstar Clinics", date: "2026-11-12", total: 241000, currency: "INR", status: "Ordered" },
  { name: "SAL-QTN-2026-00036", customer: "Bluegate Logistics", date: "2026-11-05", total: 98750, currency: "INR", status: "Open" },
];

const leads: Lead[] = [
  { name: "CRM-LEAD-0118", lead_name: "Ananya Rao", company_name: "Sunrise Public School", email: "ananya@sunrise.edu", phone: "+91 98450 11223", status: "Open", source: "Website", creation: "2026-11-20" },
  { name: "CRM-LEAD-0117", lead_name: "Farhan Qureshi", company_name: "Helping Hands Trust", email: "farhan@hht.org", phone: null, status: "Replied", source: "Referral", creation: "2026-11-18" },
  { name: "CRM-LEAD-0115", lead_name: "Meera Iyer", company_name: "Iyer Precision Works", email: "meera@ipw.in", phone: "+91 99001 44556", status: "Open", source: "Campaign", creation: "2026-11-14" },
];

const boot: Boot = {
  user: "demo@automategenie.ai", full_name: "Priya Sharma", company: "Demo Company", currency: "INR",
  modules: [
    { key: "sales", label: "Sales" }, { key: "crm", label: "CRM" }, { key: "accounts", label: "Accounts" },
    { key: "inventory", label: "Inventory" }, { key: "hrms", label: "People" },
  ],
};

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export async function demoCall<T>(method: string, args: Record<string, any>): Promise<T> {
  await wait();
  switch (method) {
    case "session.boot": return boot as T;
    case "dashboard.home_summary": {
      const s: HomeSummary = { sales_this_month: 1284300, to_collect: 342600, open_quotes: quotes.filter(q => q.status === "Open").length, new_leads: leads.length };
      return s as T;
    }
    case "sales.list_quotes": return [...quotes] as T;
    case "sales.convert_quote_to_order": {
      const q = quotes.find((x) => x.name === args.quote);
      if (!q) throw new Error("That quote no longer exists.");
      q.status = "Ordered";
      return { order: q.name.replace("QTN", "ORD"), status: "To Deliver and Bill", total: q.total } as T;
    }
    case "crm.list_leads": return [...leads] as T;
    case "crm.create_lead": {
      if (!String(args.first_name || "").trim()) throw new Error("Add the contact's first name.");
      const lead: Lead = { name: `CRM-LEAD-0${119 + leads.length}`, lead_name: args.first_name, company_name: args.company_name || null, email: args.email || null, phone: args.phone || null, status: "Lead", source: args.source || null, creation: new Date().toISOString().slice(0, 10) };
      leads.unshift(lead);
      return { name: lead.name, lead_name: lead.lead_name, status: lead.status } as T;
    }
    default: throw new Error(`Demo mode has no data for ${method}.`);
  }
}
