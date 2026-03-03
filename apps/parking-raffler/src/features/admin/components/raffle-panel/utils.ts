export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString();
}

export function dateToTs(dateStr: string): number {
  return new Date(dateStr).getTime();
}
