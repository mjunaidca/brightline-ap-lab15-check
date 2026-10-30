// The one engine for due dates. Every script uses it.
export type Terms = "Net 15" | "Net 30" | "Net 45" | "Net 60" | "Due on receipt";

const DAYS: Record<Terms, number> = {
  "Net 15": 15,
  "Net 30": 30,
  "Net 45": 45,
  "Net 60": 60,
  "Due on receipt": 0,
};

export function isTerms(text: string): text is Terms {
  return Object.hasOwn(DAYS, text);
}

export function parseTerms(text: string): Terms {
  if (!isTerms(text)) throw new Error(`Unknown terms: ${text}`);
  return text;
}

export function termsDays(terms: Terms): number {
  return DAYS[terms];
}

export function dueDate(invoiceDate: string, terms: Terms): string {
  const date = new Date(`${invoiceDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + termsDays(terms));
  return date.toISOString().slice(0, 10);
}
