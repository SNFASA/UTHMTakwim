export interface Course {
  id: string;
  name: string;
  credits: number;
  continuousScore: number; // e.g. 80/100
  continuousWeight: number; // e.g. 60%
  finalScore: number; // e.g. 70/100
  finalWeight: number; // e.g. 40%
}

export const calculatePointValue = (totalMark: number): number => {
  const mark = Math.round(totalMark);
  
  // A+ & A
  if (mark >= 80) return 4.00;
  
  // A- (75-79)
  if (mark === 79) return 3.94;
  if (mark === 78) return 3.88;
  if (mark === 77) return 3.82;
  if (mark === 76) return 3.76;
  if (mark === 75) return 3.70;

  // B+ (70-74)
  if (mark === 74) return 3.62;
  if (mark === 73) return 3.54;
  if (mark === 72) return 3.46;
  if (mark === 71) return 3.38;
  if (mark === 70) return 3.30;

  // Formula for B down to D using the start points from your table
  if (mark >= 65) return 3.00 + (mark - 65) * 0.06; // B
  if (mark >= 60) return 2.70 + (mark - 60) * 0.06; // B-
  if (mark >= 55) return 2.30 + (mark - 55) * 0.08; // C+
  if (mark >= 50) return 2.00 + (mark - 50) * 0.06; // C
  if (mark >= 45) return 1.50 + (mark - 45) * 0.08; // C-
  if (mark >= 40) return 1.00 + (mark - 40) * 0.10; // D

  return 0.00; // E
};