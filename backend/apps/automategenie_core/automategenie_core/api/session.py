import frappe

from automategenie_core.utils.modules import resolve_modules


@frappe.whitelist()
def boot():
    """Everything the app shell needs right after login."""
    user = frappe.session.user
    if user == "Guest":
        frappe.throw("Sign in to continue.", frappe.AuthenticationError)

    roles = frappe.get_roles(user)
    company = frappe.defaults.get_user_default("Company") or frappe.db.get_single_value(
        "Global Defaults", "default_company"
    )
    return {
        "user": user,
        "full_name": frappe.utils.get_fullname(user),
        "company": company,
        "currency": frappe.db.get_value("Company", company, "default_currency") if company else None,
        "modules": resolve_modules(frappe.get_installed_apps(), roles),
        "csrf_token": frappe.sessions.get_csrf_token(),
    }
