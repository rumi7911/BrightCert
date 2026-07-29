export const CYBER_ESSENTIALS_FEE_BANDS = [
  { size: "Micro", range: "0–9", minimum: 0, maximum: 9, feeExVat: 320 },
  { size: "Small", range: "10–49", minimum: 10, maximum: 49, feeExVat: 440 },
  { size: "Medium", range: "50–249", minimum: 50, maximum: 249, feeExVat: 500 },
  { size: "Large", range: "250+", minimum: 250, maximum: Number.POSITIVE_INFINITY, feeExVat: 600 },
] as const;

export function getCyberEssentialsFee(employees: number) {
  if (!Number.isInteger(employees) || employees < 0) {
    throw new Error("Employee count must be a non-negative whole number");
  }

  const band = CYBER_ESSENTIALS_FEE_BANDS.find(
    ({ minimum, maximum }) => employees >= minimum && employees <= maximum
  );

  if (!band) {
    throw new Error("Unable to determine the Cyber Essentials fee band");
  }

  const vat = band.feeExVat * 0.2;

  return {
    size: band.size,
    employees,
    feeExVat: band.feeExVat,
    vat,
    feeIncVat: band.feeExVat + vat,
  };
}
