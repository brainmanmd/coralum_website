import { describe, it, expect } from 'vitest';
import { validateEmail, validateFullName } from './validation';

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
