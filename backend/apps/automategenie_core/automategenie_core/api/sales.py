import frappe
from frappe.utils import add_days, nowdate

from automategenie_core.utils.paging import clamp_page


@frappe.whitelist()
def list_quotes(limit=20, start=0):
    limit, start = clamp_page(limit, start)
    return frappe.get_list(
        "Quotation",
        fields=["name", "party_name as customer", "transaction_date as date",
                "grand_total as total", "currency", "status"],
        filters={"docstatus": 1},
        order_by="transaction_date desc, creation desc",
        limit_page_length=limit,
        limit_start=start,
    )


@frappe.whitelist(methods=["POST"])
def convert_quote_to_order(quote, delivery_days=7):
    """Turn a submitted quotation into a submitted sales order in one step."""
    from erpnext.selling.doctype.quotation.quotation import make_sales_order

    frappe.has_permission("Quotation", "read", quote, throw=True)
    order = make_sales_order(quote)

    delivery = add_days(nowdate(), int(delivery_days))
    order.delivery_date = order.delivery_date or delivery
    for item in order.items:
        item.delivery_date = item.delivery_date or delivery

    order.insert()   # respects Sales Order create permission
    order.submit()
    return {"order": order.name, "status": order.status, "total": order.grand_total}
