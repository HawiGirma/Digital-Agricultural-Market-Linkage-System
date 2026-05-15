export function formatETB(value) {
  const n = Number(value) || 0;
  try {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `ETB ${n.toFixed(0)}`;
  }
}
