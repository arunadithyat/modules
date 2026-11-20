# Architecture rules

1. Never edit ERPNext, HRMS or Frappe code. All changes live in our own apps
   (`automategenie_core`, later `ag_ngo`, `ag_institutions`, ...) via hooks,
   custom fields, fixtures and doctype overrides. This keeps upstream upgrades cheap.

2. The frontend never calls `/api/resource/<Doctype>` for business flows. It calls
   task-shaped methods in `automategenie_core/api/`. If ERPNext changes a field,
   we fix one Python function, not many screens.

3. Every endpoint runs as the signed-in user. Use permission-aware calls
   (`frappe.get_list`, `doc.insert`, `frappe.has_permission`). Never use a shared
   admin API key from the browser, and avoid `frappe.qb` / raw SQL for user data.

4. Modules are independent. A module appears when its app is installed and the user
   has one of its roles (`utils/modules.py`). Modules react to each other through
   document events (hooks.py `doc_events`), never by reaching into each other's screens.

5. Shared features (AI, onboarding, branding, notifications) live in
   `automategenie_core`, so every module and vertical inherits them.

6. Licensing: ERPNext/HRMS are GPLv3 and their names are trademarks. Brand everything
   as AutomateGenie, and confirm the licensing of server-side apps with a lawyer
   before distributing them to clients.
