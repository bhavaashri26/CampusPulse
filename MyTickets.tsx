import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket, XCircle, Calendar, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  formatDate,
  formatTime,
  getVenueById,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '@/lib/helpers';

export default function MyTickets() {
  const { data, updateData, studentName } = useApp();

  const myTickets = data.registrations
    .filter((r) => r.studentName === studentName)
    .map((r) => ({ reg: r, event: data.events.find((e) => e.id === r.eventId) }))
    .filter((t) => t.event);

  function handleCancel(regId: string) {
    updateData((prev) => ({
      ...prev,
      registrations: prev.registrations.filter((r) => r.id !== regId),
    }));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-pastel-navy">My Tickets</h1>
        <p className="text-pastel-muted text-sm mt-1">Showing tickets for: <span className="font-medium text-pastel-navy">{studentName}</span></p>
      </div>

      {myTickets.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-pastel-border shadow-soft">
          <Ticket className="w-12 h-12 mx-auto mb-3 text-pastel-border" />
          <p className="text-lg font-medium text-pastel-muted">No tickets yet</p>
          <p className="text-sm text-pastel-muted mt-1">Browse events and register to get your first ticket.</p>
          <Link to="/" className="mt-4 inline-block px-5 py-3 bg-pastel-lavender text-white text-sm font-semibold rounded-2xl hover:bg-pastel-lavenderDark transition-colors duration-150">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {myTickets.map(({ reg, event }) => {
            const venue = getVenueById(data.venues, event!.venueId);
            return (
              <div key={reg.id} className="bg-white rounded-2xl border border-pastel-border overflow-hidden hover:shadow-soft-hover transition-all duration-150 shadow-soft">
                <div className="flex flex-col sm:flex-row">
                  <div className="flex flex-col items-center justify-center p-6 bg-pastel-bg border-b sm:border-b-0 sm:border-r border-pastel-border">
                    <div className="bg-white p-3 rounded-2xl border border-pastel-border">
                      <QRCodeSVG value={reg.ticketCode} size={120} level="M" />
                    </div>
                    <p className="mt-3 text-xs font-mono font-semibold text-pastel-muted">{reg.ticketCode}</p>
                    {reg.checkedIn ? (
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-pastel-mintText bg-pastel-mint px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Checked In
                      </span>
                    ) : (
                      <span className="mt-2 text-xs font-medium text-pastel-muted bg-pastel-lavenderLight px-2.5 py-1 rounded-full">
                        Not checked in
                      </span>
                    )}
                  </div>
                  <div className="flex-1 p-5">
                    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full border ${CATEGORY_COLORS[event!.category]}`}>
                      {CATEGORY_LABELS[event!.category]}
                    </span>
                    <h3 className="font-bold text-base text-pastel-navy mt-2 mb-3">{event!.title}</h3>
                    <div className="space-y-2 text-sm text-pastel-muted">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {formatDate(event!.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {formatTime(event!.startTime)} – {formatTime(event!.endTime)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {venue?.name || 'TBD'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancel(reg.id)}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-pastel-roseText hover:text-white hover:bg-pastel-roseText px-3 py-2 rounded-xl transition-all duration-150"
                    >
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
