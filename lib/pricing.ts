export const APPOINTMENT_PRICING: Record<string, number> = {
  "Initial evaluation (60 min)": 200,
  "Follow-up (30 min)": 120,
  "Medication management (30 min)": 140,
};

export function estimateCost(appointmentType: string) {
  const sessionFee = APPOINTMENT_PRICING[appointmentType] ?? 150;
  const estimatedCoverage = Math.round(sessionFee * 0.8);
  const estimatedCopay = sessionFee - estimatedCoverage;
  return { sessionFee, estimatedCoverage, estimatedCopay };
}
