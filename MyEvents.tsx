import { Link } from 'react-router-dom';
import { Plus, Send, Rocket, Pencil, AlertCircle, Calendar, MapPin } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  formatDateShort,
  formatTime,
  getVenueById,
  CATEGORY_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  getEventPoster,
} from '@/lib/helpers';

export default function MyEvents() {
  const { data, updateData } = useApp();

  const events = [...data.events].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function handleSubmit(eventId: string) {
    updateData((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === eventId ? { ...e, status: 'pending', approverComment: '', approvedBy: '', approvedAt: null } : e
      ),
    }));
  }

  function handlePublish(eventId: string) {
    updateData((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === eventId ? { ...e, status: 'live' } : e
      ),
    }));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-pastel-navy">My Events</h1>
          <p className="text-pastel-muted text-sm mt-1">Manage your events through the approval pipeline.</p>
        </div>
        <Link
          to="/organizer/create"
          className="inline-flex items-center gap-2 px-4 py-3 bg-pastel-lavender text-white text-sm font-semibold rounded-2xl hover:bg-pastel-lavenderDark transition-colors duration-150 shadow-soft"
        >
          <Plus className="w-4 h-4" /> New Event
        </Link>
      </div>

      <div className="mb-6 bg-pastel-bg rounded-2xl p-4 flex flex-wrap items-center gap-2 text-xs border border-pastel-border">
        <span className="font-semibold text-pastel-muted">Status flow:</span>
        {['draft', 'pending', 'approved', 'live'].map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[s]}`}>{STATUS_LABELS[s]}</span>
            {i < 3 && <span className="text-pastel-border">→</span>}
          </span>
        ))}
        <span className="text-pastel-border mx-1">|</span>
        <span className={`px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS['rejected']}`}>{STATUS_LABELS['rejected']}</span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-pastel-border shadow-soft">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-pastel-border" />
          <p className="text-lg font-medium text-pastel-muted">No events yet</p>
          <Link to="/organizer/create" className="mt-3 inline-block text-pastel-lavender font-medium text-sm">
            Create your first event →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const venue = getVenueById(data.venues, event.venueId);
            const poster = getEventPoster(event);
            const canSubmit = event.status === 'draft' || event.status === 'rejected';
            const canPublish = event.status === 'approved';

            return (
              <div key={event.id} className="bg-white rounded-2xl border border-pastel-border overflow-hidden hover:shadow-soft-hover transition-all duration-150 shadow-soft">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-36 h-36 flex-shrink-0 overflow-hidden">
                    <img src={poster} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${STATUS_COLORS[event.status]}`}>
                            {STATUS_LABELS[event.status]}
                          </span>
                          <span className="text-xs text-pastel-muted">{CATEGORY_LABELS[event.category]}</span>
                        </div>
                        <h3 className="font-bold text-pastel-navy">{event.title}</h3>
                        <div className="flex items-center gap-3 mt-1.5 text-sm text-pastel-muted">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDateShort(event.date)}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {venue?.name}</span>
                          <span>{formatTime(event.startTime)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {event.status === 'rejected' && event.approverComment && (
                          <div className="flex items-center gap-1.5 text-xs text-pastel-roseText bg-pastel-rose px-2.5 py-1.5 rounded-xl border border-pastel-rose">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span className="max-w-xs truncate">Rejected: {event.approverComment}</span>
                          </div>
                        )}
                        <Link
                          to={`/organizer/create/${event.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-pastel-muted hover:text-pastel-lavender px-3 py-2 rounded-xl hover:bg-pastel-lavenderLight transition-colors duration-150"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </Link>
                        {canSubmit && (
                          <button
                            onClick={() => handleSubmit(event.id)}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-pastel-peachText bg-pastel-peach hover:bg-pastel-peach px-3 py-2 rounded-xl border border-pastel-peach transition-colors duration-150"
                          >
                            <Send className="w-3.5 h-3.5" /> Submit
                          </button>
                        )}
                        {canPublish && (
                          <button
                            onClick={() => handlePublish(event.id)}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-pastel-mintText hover:bg-pastel-mintText px-3 py-2 rounded-xl transition-colors duration-150 shadow-soft"
                            style={{ backgroundColor: '#1F7A5A' }}
                          >
                            <Rocket className="w-3.5 h-3.5" /> Publish
                          </button>
                        )}
                      </div>
                    </div>
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
