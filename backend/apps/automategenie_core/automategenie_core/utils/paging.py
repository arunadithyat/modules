MAX_PAGE = 100


def clamp_page(limit, start):
    """Sanitise paging params coming from the browser."""
    try:
        limit = int(limit)
    except (TypeError, ValueError):
        limit = 20
    try:
        start = int(start)
    except (TypeError, ValueError):
        start = 0
    return max(1, min(limit, MAX_PAGE)), max(0, start)
