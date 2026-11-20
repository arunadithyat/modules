"""Task-shaped API for the AutomateGenie frontend.

Rules for everything in this package:
- Every endpoint runs as the logged-in user; use permission-aware calls
  (frappe.get_list, doc.insert) rather than frappe.qb / raw SQL for user data.
- Return small, screen-ready payloads. The frontend never sees raw doctypes.
"""
