import { redirect } from 'next/navigation';

// The standalone waitlist page is retired: the redesigned homepage ends in
// its own waitlist form at /#waitlist. Keep this route so old links (email,
// social, bookmarks) still land somewhere useful instead of 404ing.
export default function WaitlistPage() {
  redirect('/#waitlist');
}
