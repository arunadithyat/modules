"""Module registry: one source of truth for which product modules a user sees.

Pure Python (no frappe import) so it can be unit tested and reused by the AI service.
A module shows up only if its backing app is installed on the site AND the user
holds at least one of its roles. This is what lets a customer buy modules one at a time.
"""

MODULES = [
    {"key": "sales", "label": "Sales", "app": "erpnext",
     "roles": ["Sales User", "Sales Manager", "System Manager"]},
    {"key": "crm", "label": "CRM", "app": "erpnext",
     "roles": ["Sales User", "Sales Manager", "System Manager"]},
    {"key": "accounts", "label": "Accounts", "app": "erpnext",
     "roles": ["Accounts User", "Accounts Manager", "System Manager"]},
    {"key": "inventory", "label": "Inventory", "app": "erpnext",
     "roles": ["Stock User", "Stock Manager", "System Manager"]},
    {"key": "manufacturing", "label": "Manufacturing", "app": "erpnext",
     "roles": ["Manufacturing User", "Manufacturing Manager", "System Manager"]},
    {"key": "hrms", "label": "People", "app": "hrms",
     "roles": ["HR User", "HR Manager", "Employee", "System Manager"]},
]


def resolve_modules(installed_apps, user_roles, registry=None):
    """Return the modules visible to a user, in registry order."""
    registry = registry if registry is not None else MODULES
    apps = set(installed_apps or [])
    roles = set(user_roles or [])
    return [
        {"key": m["key"], "label": m["label"]}
        for m in registry
        if m["app"] in apps and roles.intersection(m["roles"])
    ]
