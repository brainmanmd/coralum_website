import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('hashPassword', () => {
  it('returns a hash different from the plaintext', async () => {
    const hash = await hashPassword('SecurePass123!');
    expect(hash).not.toBe('SecurePass123!');
  });

  it('produces different hashes for the same password each time', async () => {
    const hash1 = await hashPassword('SecurePass123!');
    const hash2 = await hashPassword('SecurePass123!');
    expect(hash1).not.toBe(hash2);
  });
});

describe('verifyPassword', () => {
  it('returns true for correct password', async () => {
    const hash = await hashPassword('SecurePass123!');
    const result = await verifyPassword('SecurePass123!', hash);
    expect(result).toBe(true);
  });

  it('returns false for incorrect password', async () => {
    const hash = await hashPassword('SecurePass123!');
    const result = await verifyPassword('WrongPassword1!', hash);
    expect(result).toBe(false);
  });
});
