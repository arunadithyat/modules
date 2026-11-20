import frappe
from frappe.utils import flt, get_first_day, nowdate


def _sum(doctype, field, filters):
    rows = frappe.get_list(doctype, fields=[f"sum({field}) as total"], filters=filters)
    return flt(rows[0].total) if rows else 0.0


def _count(doctype, filters):
    rows = frappe.get_list(doctype, fields=["count(name) as n"], filters=filters)
    return int(rows[0].n or 0) if rows else 0


@frappe.whitelist()
def home_summary():
    """Numbers for the home screen. Permission-aware: users only see what they can read."""
    month_start = get_first_day(nowdate())
    return {
        "sales_this_month": _sum(
            "Sales Invoice", "base_grand_total",
            {"docstatus": 1, "posting_date": [">=", month_start]},
        ),
        "to_collect": _sum("Sales Invoice", "outstanding_amount", {"docstatus": 1, "outstanding_amount": [">", 0]}),
        "open_quotes": _count("Quotation", {"docstatus": 1, "status": "Open"}),
        "new_leads": _count("Lead", {"creation": [">=", month_start]}),
    }
