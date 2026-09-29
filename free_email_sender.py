import csv
import json
import os
import sys
from pathlib import Path

FREEBUFF_KEY = os.getenv("FREEBUFF_KEY")
FREEBUFF_MODEL = os.getenv("FREEBUFF_MODEL", "minimax/minimax-m3")

DRY_RUN = "--dry-run" in sys.argv

if not DRY_RUN and not FREEBUFF_KEY:
    print("[X] Set FREEBUFF_KEY (copy .env.example to .env and fill it in).")
    sys.exit(1)

REQUESTS_AVAILABLE = False
try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    requests = None

LEADS_PATH = Path("leads.csv")
if not LEADS_PATH.exists():
    print(f"[X] {LEADS_PATH} not found. Add a leads.csv first.")
    sys.exit(1)

with LEADS_PATH.open(newline="", encoding="utf-8") as fh:
    reader = csv.DictReader(fh)
    leads = list(reader)

if not leads:
    print(f"[X] {LEADS_PATH} had no rows.")
    sys.exit(1)

required = {"name", "email", "company"}
for lead in leads:
    missing = required - set(lead)
    if missing:
        print(f"[X] Row is missing fields {sorted(missing)}: {lead}")
        sys.exit(1)

# ---------------------------------------------------------------------------
# Freebuff API contract — best known shape as of the project's docs/source state.
#
# This is an Anthropic-compatible /v1/messages wrapper endpoint. The script
# below treats that as the expected shape but validates the actual response
# at runtime, so a mismatch fails loudly instead of silently producing empty
# output.
#
# Known caveats from the project's own ecosystem notes:
# - Freebuff's backend historically rejects direct `/v1/messages` calls with a
#   403 like: "Free mode is only available through the freebuff CLI."
# - Third-party proxies (e.g. free-buff-lol) get around that by stripping the
#   cost_mode field and routing through a session, but that is unofficial and
#   can be rate-limited or banned by Freebuff.
# - Model names currently travel as Anthropic-format agent ids such as
#   "minimax/minimax-m3", "deepseek/deepseek-v4-flash", etc. The hardcoded
#   "claude-3-5-sonnet" in the original snippet does not match the catalog
#   surfaced by Freebuff's own tooling.
# ---------------------------------------------------------------------------

API_URL = "https://api.freebuff.com/v1/messages"

# Model id Freebuff expects for this project. Override with FREEBUFF_MODEL.
# Falls back to a Free-tier Anthropic-format id seen in the project's ecosystem docs.

headers = {
    "Authorization": f"Bearer {FREEBUFF_KEY or '[REDACTED IN DRY-RUN]'}",
    "Content-Type": "application/json",
}

if not DRY_RUN:
    if not REQUESTS_AVAILABLE:
        print("[X] Install requests to send emails: pip install requests")
        sys.exit(1)
    if not FREEBUFF_KEY:
        print("[X] Set FREEBUFF_KEY (copy .env.example to .env and fill it in).")
        sys.exit(1)


def extract_text(payload: dict) -> str:
    """Pull a string response out of the Freebuff / Anthropic-shaped response."""

    if "content" in payload and isinstance(payload["content"], list):
        for block in payload["content"]:
            if isinstance(block, dict) and block.get("type") == "text":
                text = block.get("text")
                if isinstance(text, str):
                    return text

    if "error" in payload:
        error_text = str(payload["error"])
        raise RuntimeError(f"Freebuff API error: {error_text}")

    raise RuntimeError(
        f"Unexpected Freebuff response shape: {json.dumps(payload)[:500]}"
    )


def build_request_body(lead: dict) -> dict:
    """The exact POST body the live path would send for one lead."""
    return {
        "model": FREEBUFF_MODEL,
        "max_tokens": 100,
        "messages": [
            {
                "role": "user",
                "content": f"Write a 30-word cold email to {lead['name']} at {lead['company']}",
            }
        ],
    }


if DRY_RUN:
    print("[>] Freebuff dry run — no API calls will be made.\n")
    print(f"Model: {FREEBUFF_MODEL}\n")
    for idx, lead in enumerate(leads, start=1):
        prompt = f"Write a 30-word cold email to {lead['name']} at {lead['company']}"
        body = build_request_body(lead)
        print(f"--- Lead {idx} ---")
        print(f"name: {lead['name']}")
        print(f"email: {lead['email']}")
        print(f"company: {lead['company']}")
        print(f"prompt:\n{prompt}\n")
        print("request body:\n" + json.dumps(body, indent=2) + "\n")
    print("Done. (dry run)")
    sys.exit(0)

print("[>] Sending emails with Freebuff (FREE)...\n")

sent = 0
for lead in leads:
    body = build_request_body(lead)

    response = requests.post(API_URL, headers=headers, json=body)
    response.raise_for_status()

    try:
        payload = response.json()
    except ValueError as exc:
        raise RuntimeError(
            f"Freebuff returned non-JSON: {response.status_code} {response.text[:200]}"
        ) from exc

    email_text = extract_text(payload)

    print(f"[+] {lead['name']} ({lead['email']})")
    print(f"Email:\n{email_text}\n")
    sent += 1

leads_attempted = len(leads)
print(f"Done. Leads attempted: {leads_attempted}. Emails printed: {sent}.")
