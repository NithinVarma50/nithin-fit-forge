export function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

export function formatHeight(cm: number): string {
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);
  return `${feet}'${remainingInches}"`;
}

export function getTodayName(): string {
  return new Date().toLocaleString('en-us', { weekday: 'long' });
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}
