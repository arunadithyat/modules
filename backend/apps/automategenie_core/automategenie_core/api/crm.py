import frappe

from automategenie_core.utils.paging import clamp_page


@frappe.whitelist()
def list_leads(limit=20, start=0):
    limit, start = clamp_page(limit, start)
    return frappe.get_list(
        "Lead",
        fields=["name", "lead_name", "company_name", "email_id as email",
                "mobile_no as phone", "status", "source", "creation"],
        order_by="creation desc",
        limit_page_length=limit,
        limit_start=start,
    )


@frappe.whitelist(methods=["POST"])
def create_lead(first_name, company_name=None, email=None, phone=None, source=None):
    if not (first_name or "").strip():
        frappe.throw("Add the contact's first name.")
    lead = frappe.get_doc({
        "doctype": "Lead",
        "first_name": first_name.strip(),
        "company_name": company_name,
        "email_id": email,
        "mobile_no": phone,
        "source": source,
    })
    lead.insert()
    return {"name": lead.name, "lead_name": lead.lead_name, "status": lead.status}
