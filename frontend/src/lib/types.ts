export type ModuleKey = "sales" | "crm" | "accounts" | "inventory" | "manufacturing" | "hrms";

export interface Boot {
  user: string;
  full_name: string;
  company: string | null;
  currency: string | null;
  modules: { key: ModuleKey; label: string }[];
  csrf_token?: string;
}

export interface HomeSummary {
  sales_this_month: number;
  to_collect: number;
  open_quotes: number;
  new_leads: number;
}

export interface Quote {
  name: string;
  customer: string;
  date: string;
  total: number;
  currency: string;
  status: string;
}

export interface Lead {
  name: string;
  lead_name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  source: string | null;
  creation: string;
}
