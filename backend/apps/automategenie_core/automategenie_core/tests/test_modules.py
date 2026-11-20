import unittest

from automategenie_core.utils.modules import resolve_modules
from automategenie_core.utils.paging import clamp_page


class TestModuleRegistry(unittest.TestCase):
    def test_hrms_hidden_when_app_missing(self):
        mods = resolve_modules(["frappe", "erpnext"], ["System Manager"])
        self.assertNotIn("hrms", [m["key"] for m in mods])

    def test_role_filtering(self):
        mods = resolve_modules(["erpnext", "hrms"], ["Employee"])
        self.assertEqual([m["key"] for m in mods], ["hrms"])

    def test_no_roles_no_modules(self):
        self.assertEqual(resolve_modules(["erpnext"], []), [])


class TestPaging(unittest.TestCase):
    def test_clamps(self):
        self.assertEqual(clamp_page(10_000, -5), (100, 0))
        self.assertEqual(clamp_page("abc", None), (20, 0))


if __name__ == "__main__":
    unittest.main()
