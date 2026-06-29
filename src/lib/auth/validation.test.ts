import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePasswordStrength,
  validateFullName,
  validateDateOfBirth,
  calculateAge,
} from './validation';

describe('validateEmail', () => {
  it('accepts a valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('rejects email without @', () => {
    expect(validateEmail('testexample.com')).toBe(false);
  });

  it('rejects email without domain', () => {
    expect(validateEmail('test@')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});

describe('validatePasswordStrength', () => {
  it('accepts a strong password', () => {
    const result = validatePasswordStrength('SecurePass123!');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects password shorter than 8 chars', () => {
    const result = validatePasswordStrength('Sh0rt!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
  });

  it('rejects password without uppercase', () => {
    const result = validatePasswordStrength('securepass123!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });

  it('rejects password without a number', () => {
    const result = validatePasswordStrength('SecurePass!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });

  it('rejects password without a special character', () => {
    const result = validatePasswordStrength('SecurePass123');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character');
  });

  it('returns all errors for a completely weak password', () => {
    const result = validatePasswordStrength('weak');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});

describe('validateFullName', () => {
  it('accepts a name with 2+ characters', () => {
    expect(validateFullName('Jo')).toBe(true);
  });

  it('accepts a full name', () => {
    expect(validateFullName('John Doe')).toBe(true);
  });

  it('rejects a single character', () => {
    expect(validateFullName('J')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateFullName('')).toBe(false);
  });

  it('rejects whitespace-only string', () => {
    expect(validateFullName('   ')).toBe(false);
  });
});

describe('calculateAge', () => {
  it('calculates age correctly for a known birthday', () => {
    const dob = new Date('2000-01-01');
    const age = calculateAge(dob);
    expect(age).toBeGreaterThanOrEqual(25);
    expect(age).toBeLessThanOrEqual(26);
  });
});

describe('validateDateOfBirth', () => {
  it('accepts a valid adult DOB', () => {
    const result = validateDateOfBirth('2000-01-15');
    expect(result.valid).toBe(true);
  });

  it('rejects a minor (born this year)', () => {
    const thisYear = new Date().getFullYear();
    const result = validateDateOfBirth(`${thisYear}-01-15`);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('18 years old');
  });

  it('rejects an invalid date string', () => {
    const result = validateDateOfBirth('not-a-date');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid date format');
  });
});
