import type { AppData, CampusEvent, Venue, Registration } from '@/types';

const STORAGE_KEY = 'campuspulse_data_v1';

const today = new Date();
const todayStr = today.toISOString().slice(0, 10);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().slice(0, 10);
const dayAfter = new Date(today);
dayAfter.setDate(today.getDate() + 2);
const dayAfterStr = dayAfter.toISOString().slice(0, 10);
const pastDate = new Date(today);
pastDate.setDate(today.getDate() - 3);
const pastStr = pastDate.toISOString().slice(0, 10);

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function ticketCode(): string {
  return `CP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function seedData(): AppData {
  const venues: Venue[] = [
    { id: 'v1', name: 'Main Auditorium', capacity: 500 },
    { id: 'v2', name: 'Tech Lab 101', capacity: 80 },
    { id: 'v3', name: 'Sports Complex', capacity: 300 },
    { id: 'v4', name: 'Seminar Hall B', capacity: 120 },
  ];

  const events: CampusEvent[] = [
    {
      id: 'e1',
      title: 'Hack the Night Code Sprint',
      description: 'A 6-hour overnight coding sprint with challenges in algorithms, web, and AI. Bring your laptop and caffeine.',
      category: 'coding',
      date: todayStr,
      startTime: '18:00',
      endTime: '23:00',
      venueId: 'v2',
      maxSeats: 80,
      pricingType: 'free',
      poster: '',
      status: 'live',
      organizerId: 'org1',
      approverComment: '',
      approvedBy: 'approver1',
      approvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'e2',
      title: 'Open Mic & Live Music Night',
      description: 'Perform or just enjoy. Solo acts, bands, and DJ sets welcome. Sound system provided.',
      category: 'music',
      date: todayStr,
      startTime: '19:00',
      endTime: '22:00',
      venueId: 'v1',
      maxSeats: 200,
      pricingType: 'paid',
      poster: '',
      status: 'live',
      organizerId: 'org1',
      approverComment: '',
      approvedBy: 'approver1',
      approvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'e3',
      title: 'Inter-College Basketball Cup',
      description: 'Round-robin tournament across 8 college teams. Finals followed by awards ceremony.',
      category: 'sports',
      date: tomorrowStr,
      startTime: '09:00',
      endTime: '17:00',
      venueId: 'v3',
      maxSeats: 300,
      pricingType: 'free',
      poster: '',
      status: 'live',
      organizerId: 'org1',
      approverComment: '',
      approvedBy: 'approver1',
      approvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'e4',
      title: 'AI/ML Hands-On Workshop',
      description: 'Build a sentiment classifier from scratch using Python and scikit-learn. No prior ML experience needed.',
      category: 'workshop',
      date: tomorrowStr,
      startTime: '10:00',
      endTime: '13:00',
      venueId: 'v4',
      maxSeats: 120,
      pricingType: 'paid',
      poster: '',
      status: 'live',
      organizerId: 'org1',
      approverComment: '',
      approvedBy: 'approver1',
      approvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'e5',
      title: 'React Deep Dive Bootcamp',
      description: 'From hooks to suspense to server components. A full-day intensive for intermediate React devs.',
      category: 'coding',
      date: dayAfterStr,
      startTime: '09:30',
      endTime: '16:30',
      venueId: 'v2',
      maxSeats: 80,
      pricingType: 'free',
      poster: '',
      status: 'live',
      organizerId: 'org1',
      approverComment: '',
      approvedBy: 'approver1',
      approvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'e6',
      title: 'Sunset Yoga & Wellness Session',
      description: 'Relax, stretch, and unwind. Mats provided. Open to all fitness levels.',
      category: 'sports',
      date: dayAfterStr,
      startTime: '17:00',
      endTime: '18:30',
      venueId: 'v3',
      maxSeats: 60,
      pricingType: 'free',
      poster: '',
      status: 'live',
      organizerId: 'org1',
      approverComment: '',
      approvedBy: 'approver1',
      approvedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'e7',
      title: 'DJ Battle: Bass Wars',
      description: 'Four DJs. Two rounds. One winner. Vote for your favorite set via the CampusPulse app.',
      category: 'music',
      date: dayAfterStr,
      startTime: '20:00',
      endTime: '23:30',
      venueId: 'v1',
      maxSeats: 300,
      pricingType: 'paid',
      poster: '',
      status: 'pending',
      organizerId: 'org1',
      approverComment: '',
      approvedBy: '',
      approvedAt: null,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'e8',
      title: 'Startup Pitch Day (Draft)',
      description: 'Pitch your idea to a panel of investors. 5-minute slots with Q&A. Prizes for top 3.',
      category: 'workshop',
      date: pastStr,
      startTime: '14:00',
      endTime: '18:00',
      venueId: 'v4',
      maxSeats: 100,
      pricingType: 'free',
      poster: '',
      status: 'draft',
      organizerId: 'org1',
      approverComment: '',
      approvedBy: '',
      approvedAt: null,
      createdAt: new Date().toISOString(),
    },
  ];

  // Seed a few registrations on live events
  const registrations: Registration[] = [
    {
      id: uid('r'),
      eventId: 'e1',
      studentName: 'Alice Johnson',
      ticketCode: ticketCode(),
      checkedIn: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('r'),
      eventId: 'e1',
      studentName: 'Bob Smith',
      ticketCode: ticketCode(),
      checkedIn: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('r'),
      eventId: 'e2',
      studentName: 'Carol White',
      ticketCode: ticketCode(),
      checkedIn: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('r'),
      eventId: 'e3',
      studentName: 'Dave Brown',
      ticketCode: ticketCode(),
      checkedIn: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: uid('r'),
      eventId: 'e1',
      studentName: 'Eve Martinez',
      ticketCode: ticketCode(),
      checkedIn: true,
      createdAt: new Date().toISOString(),
    },
  ];

  return { events, venues, registrations, decisions: [] };
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = seedData();
      saveData(seed);
      return seed;
    }
    return JSON.parse(raw) as AppData;
  } catch {
    const seed = seedData();
    saveData(seed);
    return seed;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetData(): AppData {
  const seed = seedData();
  saveData(seed);
  return seed;
}

export function genId(prefix: string): string {
  return uid(prefix);
}

export function genTicketCode(): string {
  return ticketCode();
}
