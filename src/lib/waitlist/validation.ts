export const PARKINSONS_DURATION_OPTIONS = [
  'Less than 1 year',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  'More than 10 years',
  'Prefer not to say',
] as const;

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateJoiningAs(joiningAs: string): joiningAs is 'patient' | 'caregiver' {
  return joiningAs === 'patient' || joiningAs === 'caregiver';
}

export function validateParkinsonsDuration(duration: string): boolean {
  return (PARKINSONS_DURATION_OPTIONS as readonly string[]).includes(duration);
}

export function validateFullName(name: string): boolean {
  return name.trim().length >= 2;
}

export function validateZipCode(zip: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(zip.trim());
}

export function validateWaitlistDateOfBirth(dateString: string): {
  valid: boolean;
  error?: string;
} {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }

  if (date.getTime() > Date.now()) {
    return { valid: false, error: 'Date of birth cannot be in the future' };
  }

  return { valid: true };
}
