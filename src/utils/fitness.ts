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

// Get the start of the current week (Sunday)
export function getWeekStartDate(): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek);
  return weekStart.toISOString().split('T')[0];
}

// Check if a date is in the current week
export function isInCurrentWeek(dateStr: string): boolean {
  const date = new Date(dateStr);
  const weekStart = new Date(getWeekStartDate());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  return date >= weekStart && date < weekEnd;
}

// Storage utility functions
export function saveAppState(appState: any): void {
  try {
    localStorage.setItem('fitForgeAppState', JSON.stringify(appState));
  } catch (error) {
    console.error('Error saving app state to localStorage:', error);
  }
}

export function loadAppState(): any | null {
  try {
    const savedState = localStorage.getItem('fitForgeAppState');
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.error('Error loading app state from localStorage:', error);
    return null;
  }
}
