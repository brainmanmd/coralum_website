export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
