import { describe, it, expect, afterAll } from 'vitest';
import { eq } from 'drizzle-orm';
import { POST } from './route';
import { db } from '@/lib/db/client';
import { waitlistSignups } from '@/lib/db/schema';

const TEST_EMAIL = 'integration-test@coralum.care';

describe('POST /api/waitlist (integration, requires live POSTGRES_URL)', () => {
  afterAll(async () => {
    await db.delete(waitlistSignups).where(eq(waitlistSignups.email, TEST_EMAIL));
  });

  it('persists a signup row to the database', async () => {
    const request = new Request('http://localhost/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'Integration Test',
        email: TEST_EMAIL,
        date_of_birth: '1990-01-01',
        zip_code: '94301',
        contact_consent: true,
        beta_consent: false,
      }),
    });

    const response = await POST(request as never);
    expect(response.status).toBe(200);

    const rows = await db
      .select()
      .from(waitlistSignups)
      .where(eq(waitlistSignups.email, TEST_EMAIL));

    expect(rows).toHaveLength(1);
    expect(rows[0].fullName).toBe('Integration Test');
    expect(rows[0].contactConsent).toBe(true);
  });
});
