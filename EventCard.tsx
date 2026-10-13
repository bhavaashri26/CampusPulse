import { Link } from 'react-router-dom';
import { MapPin, Users, Calendar } from 'lucide-react';
import type { CampusEvent, Venue, Registration } from '@/types';
import {
  formatDateShort,
  formatTime,
  getVenueById,
  getSeatsLeft,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getEventPoster,
} from '@/lib/helpers';

interface Props {
  event: CampusEvent;
  venues: Venue[];
  registrations: Registration[];
}

export default function EventCard({ event, venues, registrations }: Props) {
  const venue = getVenueById(venues, event.venueId);
  const seatsLeft = getSeatsLeft(event, registrations);
  const full = seatsLeft <= 0;
  const poster = getEventPoster(event);

  return (
    <Link
      to={`/event/${event.id}`}
      className="group bg-white rounded-2xl border border-pastel-border overflow-hidden hover:shadow-soft-hover hover:-translate-y-1 transition-all duration-150 flex flex-col"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={poster}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full border ${CATEGORY_COLORS[event.category]}`}
        >
          {CATEGORY_LABELS[event.category]}
        </span>
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-full ${
            event.pricingType === 'free'
              ? 'bg-pastel-mint text-pastel-mintText'
              : 'bg-pastel-peach text-pastel-peachText'
          }`}
        >
          {event.pricingType === 'free' ? 'FREE' : 'PAID'}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-base text-pastel-navy leading-snug group-hover:text-pastel-lavender transition-colors duration-150 line-clamp-2">
          {event.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-pastel-muted">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>{formatDateShort(event.date)}</span>
          <span className="text-pastel-border">·</span>
          <span>{formatTime(event.startTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-pastel-muted">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{venue?.name || 'TBD'}</span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex items-center gap-1.5 text-sm">
            <Users className="w-4 h-4 text-pastel-muted" />
            <span className={full ? 'text-pastel-roseText font-semibold' : 'text-pastel-muted'}>
              {full ? 'Full' : `${seatsLeft} seats left`}
            </span>
          </div>
          <span className="text-sm font-semibold text-pastel-lavender group-hover:translate-x-0.5 transition-transform duration-150">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
