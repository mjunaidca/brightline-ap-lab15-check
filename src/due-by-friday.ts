// Which open invoices are due on or before the payment run?
// Run: npm run due -- 2027-03-05
import { pathToFileURL } from "node:url";
import { readData, rows } from "./csv.ts";
import { dueDate, parseTerms } from "./due-date.ts";
import { usd } from "./money.ts";

export type DueInvoice = { due: string; number: string; vendor: string; cents: number };

export function dueBy(invoicesCsv: string, vendorsCsv: string, cutoff: string): DueInvoice[] {
  const names: Record<string, string> = Object.fromEntries(rows(vendorsCsv).map(([id, name]) => [id, name]));
  return rows(invoicesCsv)
    .filter((r) => r[6] === "open")
    .map(([number = "", vendorId = "", invoiceDate = "", due = "", terms = "", cents = "0"]) => ({
      due: due || dueDate(invoiceDate, parseTerms(terms)),
      number,
      vendor: names[vendorId] ?? vendorId,
      cents: Number(cents),
    }))
    .filter((r) => r.due <= cutoff)
    .sort((a, b) => a.due.localeCompare(b.due) || a.number.localeCompare(b.number));
}

export function report(list: DueInvoice[]): string {
  const lines = list.map((r) => `${r.due}  ${r.number}  ${r.vendor}  ${usd(r.cents)}`);
  const total = list.reduce((sum, r) => sum + r.cents, 0);
  lines.push(`${list.length} invoices, total ${usd(total)}`);
  return lines.join("\n");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const cutoff = process.argv[2] ?? "2027-03-05";
  console.log(report(dueBy(readData("invoices.csv"), readData("vendors.csv"), cutoff)));
}
