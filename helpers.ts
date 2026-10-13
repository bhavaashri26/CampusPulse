import type { CampusEvent, Venue, Registration } from '@/types';

export function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function getVenueById(venues: Venue[], id: string): Venue | undefined {
  return venues.find((v) => v.id === id);
}

export function getRegistrationsForEvent(regs: Registration[], eventId: string): Registration[] {
  return regs.filter((r) => r.eventId === eventId);
}

export function getSeatsLeft(event: CampusEvent, regs: Registration[]): number {
  return event.maxSeats - getRegistrationsForEvent(regs, event.id).length;
}

export function getCheckedInCount(regs: Registration[], eventId: string): number {
  return regs.filter((r) => r.eventId === eventId && r.checkedIn).length;
}

export const CATEGORY_LABELS: Record<string, string> = {
  coding: 'Coding',
  music: 'Music',
  sports: 'Sports',
  workshop: 'Workshop',
};

export const CATEGORY_COLORS: Record<string, string> = {
  coding: 'bg-pastel-sky text-pastel-skyText border-pastel-sky',
  music: 'bg-pastel-pink text-pastel-pinkText border-pastel-pink',
  sports: 'bg-pastel-mint text-pastel-mintText border-pastel-mint',
  workshop: 'bg-pastel-peach text-pastel-peachText border-pastel-peach',
};

export const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  pending: 'Pending',
  approved: 'Approved',
  live: 'Live',
  rejected: 'Rejected',
};

export const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-pastel-sky text-pastel-skyText border-pastel-sky',
  pending: 'bg-pastel-peach text-pastel-peachText border-pastel-peach',
  approved: 'bg-pastel-mint text-pastel-mintText border-pastel-mint',
  live: 'bg-pastel-mint text-pastel-mintText border-pastel-mint',
  rejected: 'bg-pastel-rose text-pastel-roseText border-pastel-rose',
};

// Venue conflict check: existing_start < new_end AND existing_end > new_start
export function hasVenueConflict(
  events: CampusEvent[],
  venueId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeEventId?: string
): CampusEvent | null {
  const newStart = toMinutes(startTime);
  const newEnd = toMinutes(endTime);
  const conflicting = events.find((e) => {
    if (e.venueId !== venueId) return false;
    if (e.date !== date) return false;
    if (e.id === excludeEventId) return false;
    // Only count pending, approved, live
    if (!['pending', 'approved', 'live'].includes(e.status)) return false;
    const existStart = toMinutes(e.startTime);
    const existEnd = toMinutes(e.endTime);
    return existStart < newEnd && existEnd > newStart;
  });
  return conflicting || null;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// Pastel gradient posters (SVG data URIs) — different color combos per category
export function categoryPoster(category: string): string {
  const colors: Record<string, [string, string, string]> = {
    coding: ['#DCEEFF', '#E9E4FF', '#7C6BD6'],
    music: ['#FFDDEB', '#FFE6D5', '#A63D6B'],
    sports: ['#D3F5E5', '#DCEEFF', '#1F7A5A'],
    workshop: ['#FFE6D5', '#FFDDEB', '#B5532B'],
  };
  const [c1, c2, textCol] = colors[category] || ['#E9E4FF', '#FFDDEB', '#7C6BD6'];
  const labels: Record<string, string> = {
    coding: 'CODE',
    music: 'MUSIC',
    sports: 'SPORTS',
    workshop: 'WORKSHOP',
  };
  const label = labels[category] || 'EVENT';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="400" height="250" fill="url(#g)"/>
    <text x="200" y="135" font-family="Plus Jakarta Sans, sans-serif" font-size="28" font-weight="700" fill="${textCol}" text-anchor="middle" opacity="0.85">${label}</text>
    <circle cx="70" cy="55" r="35" fill="white" opacity="0.15"/>
    <circle cx="330" cy="195" r="45" fill="white" opacity="0.1"/>
    <circle cx="350" cy="40" r="20" fill="white" opacity="0.12"/>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function getEventPoster(event: CampusEvent): string {
  if (event.poster) return event.poster;
  return categoryPoster(event.category);
}
