# Notes

## What the repository does (at ch14)
- `src/due-date.ts` and `py/brightline_ap/due_date.py`: the one due-date engine, with `Terms` as a literal type.
- `src/due-by-friday.ts`: the payment list. `npm run due -- 2027-03-05` gives 8 invoices, $19,229.53.
- `src/reconcile.ts`: checks stated due dates against the rule. 0 mismatches in `invoices.csv`, 2 in `invoices-check.csv`.
- `src/schemas.ts`, `src/load-invoices.ts`: every record checked at the edge. `invoices-messy.csv` gives 11 valid, 4 errors.
- `scripts/ap-api.ts` and `src/ap-client.ts`: the local sample API and the async client. Key in `.env` only.

## Open proposal
- The weekend rule (a Saturday or Sunday due date is paid the Friday before) is a finance proposal, not policy. It lives on branches, not on `main`.
