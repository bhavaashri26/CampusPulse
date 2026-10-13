import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Tag, Calendar, CheckCircle, XCircle, Ticket } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  formatDate,
  formatTime,
  getVenueById,
  getSeatsLeft,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getEventPoster,
} from '@/lib/helpers';
import { genTicketCode } from '@/lib/storage';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, updateData, studentName, setStudentName } = useApp();
  const navigate = useNavigate();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [nameInput, setNameInput] = useState(studentName);

  const event = data.events.find((e) => e.id === id);
  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-pastel-muted text-lg">Event not found.</p>
        <Link to="/" className="text-pastel-lavender font-medium mt-3 inline-block">← Back to Home</Link>
      </div>
    );
  }

  const venue = getVenueById(data.venues, event.venueId);
  const seatsLeft = getSeatsLeft(event, data.registrations);
  const full = seatsLeft <= 0;
  const poster = getEventPoster(event);
  const isLive = event.status === 'live';

  const existingReg = data.registrations.find(
    (r) => r.eventId === event.id && r.studentName === studentName
  );

  function handleRegister() {
    if (!nameInput.trim()) {
      setMessage({ type: 'error', text: 'Please enter your name to register.' });
      return;
    }
    setStudentName(nameInput.trim());

    const dup = data.registrations.find(
      (r) => r.eventId === event!.id && r.studentName === nameInput.trim()
    );
    if (dup) {
      setMessage({ type: 'error', text: 'You already have a ticket for this event.' });
      return;
    }
    if (getSeatsLeft(event!, data.registrations) <= 0) {
      setMessage({ type: 'error', text: 'This event is full. No more seats available.' });
      return;
    }
    const code = genTicketCode();
    updateData((prev) => ({
      ...prev,
      registrations: [
        ...prev.registrations,
        {
          id: `r_${Math.random().toString(36).slice(2, 10)}`,
          eventId: event!.id,
          studentName: nameInput.trim(),
          ticketCode: code,
          checkedIn: false,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
    setMessage({ type: 'success', text: `Registered! Your ticket code is ${code}.` });
    setTimeout(() => navigate('/tickets'), 1800);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-pastel-muted hover:text-pastel-lavender transition-colors duration-150 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to events
      </Link>

      <div className="bg-white rounded-2xl border border-pastel-border overflow-hidden shadow-soft">
        <div className="relative h-64 sm:h-80">
          <img src={poster} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${CATEGORY_COLORS[event.category]}`}>
              {CATEGORY_LABELS[event.category]}
            </span>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${event.pricingType === 'free' ? 'bg-pastel-mint text-pastel-mintText' : 'bg-pastel-peach text-pastel-peachText'}`}>
              {event.pricingType === 'free' ? 'FREE' : 'PAID'}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-pastel-navy mb-3">{event.title}</h1>
          <p className="text-pastel-muted leading-relaxed mb-6">{event.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-pastel-bg rounded-2xl p-4">
              <Calendar className="w-5 h-5 text-pastel-lavender" />
              <div>
                <p className="text-xs text-pastel-muted uppercase font-medium">Date</p>
                <p className="text-sm font-semibold text-pastel-navy">{formatDate(event.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-pastel-bg rounded-2xl p-4">
              <Clock className="w-5 h-5 text-pastel-lavender" />
              <div>
                <p className="text-xs text-pastel-muted uppercase font-medium">Time</p>
                <p className="text-sm font-semibold text-pastel-navy">{formatTime(event.startTime)} – {formatTime(event.endTime)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-pastel-bg rounded-2xl p-4">
              <MapPin className="w-5 h-5 text-pastel-lavender" />
              <div>
                <p className="text-xs text-pastel-muted uppercase font-medium">Venue</p>
                <p className="text-sm font-semibold text-pastel-navy">{venue?.name || 'TBD'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-pastel-bg rounded-2xl p-4">
              <Users className="w-5 h-5 text-pastel-lavender" />
              <div>
                <p className="text-xs text-pastel-muted uppercase font-medium">Seats Left</p>
                <p className={`text-sm font-semibold ${full ? 'text-pastel-roseText' : 'text-pastel-navy'}`}>
                  {full ? 'Full' : `${seatsLeft} / ${event.maxSeats}`}
                </p>
              </div>
            </div>
          </div>

          {isLive ? (
            <div className="border-t border-pastel-border pt-6">
              {existingReg ? (
                <div className="bg-pastel-lavenderLight border border-pastel-border rounded-2xl p-4 flex items-center gap-3">
                  <Ticket className="w-6 h-6 text-pastel-lavenderText flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-pastel-lavenderText">You already have a ticket</p>
                    <p className="text-sm text-pastel-lavenderText">Code: {existingReg.ticketCode}</p>
                  </div>
                  <Link to="/tickets" className="ml-auto text-sm font-medium text-pastel-lavender hover:text-pastel-lavenderDark">
                    View My Tickets →
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-pastel-navy mb-2">Your Name</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full max-w-sm px-4 py-3 rounded-2xl border border-pastel-border text-sm text-pastel-navy focus:outline-none focus:ring-2 focus:ring-pastel-lavender focus:border-transparent transition-all duration-150"
                    />
                  </div>
                  {message && (
                    <div
                      className={`mb-4 rounded-2xl p-4 flex items-center gap-2 text-sm ${
                        message.type === 'success'
                          ? 'bg-pastel-mint border border-pastel-mint text-pastel-mintText'
                          : 'bg-pastel-rose border border-pastel-rose text-pastel-roseText'
                      }`}
                    >
                      {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      {message.text}
                    </div>
                  )}
                  <button
                    onClick={handleRegister}
                    disabled={full}
                    className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-150 ${
                      full
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-pastel-lavender text-white hover:bg-pastel-lavenderDark shadow-soft hover:shadow-soft-hover'
                    }`}
                  >
                    {full ? 'Event Full' : 'Register Now'}
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="border-t border-pastel-border pt-6">
              <div className="bg-pastel-peach border border-pastel-peach rounded-2xl p-4 flex items-center gap-3">
                <Tag className="w-5 h-5 text-pastel-peachText" />
                <p className="text-sm font-medium text-pastel-peachText">
                  This event is not live yet. Status: {event.status}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
