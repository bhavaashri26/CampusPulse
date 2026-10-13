export type Role = 'student' | 'organizer' | 'approver';

export type EventCategory = 'coding' | 'music' | 'sports' | 'workshop';
export type EventStatus = 'draft' | 'pending' | 'approved' | 'live' | 'rejected';
export type PricingType = 'free' | 'paid';

export interface Venue {
  id: string;
  name: string;
  capacity: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  venueId: string;
  maxSeats: number;
  pricingType: PricingType;
  poster: string; // base64 or empty
  status: EventStatus;
  organizerId: string;
  approverComment: string;
  approvedBy: string;
  approvedAt: string | null;
  createdAt: string;
}

export interface Registration {
  id: string;
  eventId: string;
  studentName: string;
  ticketCode: string;
  checkedIn: boolean;
  createdAt: string;
}

export interface ApprovalDecision {
  id: string;
  eventId: string;
  outcome: 'approved' | 'rejected';
  decidedBy: string;
  comment: string;
  decidedAt: string;
}

export interface AppData {
  events: CampusEvent[];
  venues: Venue[];
  registrations: Registration[];
  decisions: ApprovalDecision[];
}
