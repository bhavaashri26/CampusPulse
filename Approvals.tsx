import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, MapPin, Calendar, MessageSquare, Inbox } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  formatDate,
  formatTime,
  getVenueById,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getEventPoster,
} from '@/lib/helpers';
import { genId } from '@/lib/storage';
import type { CampusEvent } from '@/types';

export default function Approvals() {
  const { data, updateData } = useApp();
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pendingEvents = data.events
    .filter((e) => e.status === 'pending')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const pastDecisions = data.decisions
    .map((d) => ({ decision: d, event: data.events.find((e) => e.id === d.eventId) }))
    .filter((d) => d.event)
    .sort((a, b) => b.decision.decidedAt.localeCompare(a.decision.decidedAt));

  function handleApprove(event: CampusEvent) {
    updateData((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === event.id
          ? { ...e, status: 'approved', approverComment: '', approvedBy: 'approver1', approvedAt: new Date().toISOString() }
          : e
      ),
      decisions: [
        ...prev.decisions,
        {
          id: genId('d'),
          eventId: event.id,
          outcome: 'approved',
          decidedBy: 'approver1',
          comment: '',
          decidedAt: new Date().toISOString(),
        },
      ],
    }));
  }

  function handleReject(event: CampusEvent) {
    const comment = commentInputs[event.id]?.trim();
    if (!comment) {
      setErrors({ ...errors, [event.id]: 'A rejection comment is required.' });
      return;
    }
    updateData((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === event.id
          ? { ...e, status: 'rejected', approverComment: comment, approvedBy: 'approver1', approvedAt: new Date().toISOString() }
          : e
      ),
      decisions: [
        ...prev.decisions,
        {
          id: genId('d'),
          eventId: event.id,
          outcome: 'rejected',
          decidedBy: 'approver1',
          comment,
          decidedAt: new Date().toISOString(),
        },
      ],
    }));
    setCommentInputs({ ...commentInputs, [event.id]: '' });
    setErrors({ ...errors, [event.id]: '' });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-pastel-navy mb-1">Approvals</h1>
      <p className="text-pastel-muted text-sm mb-6">Review pending event submissions. Approve or reject with a reason.</p>

      <h2 className="text-sm font-semibold text-pastel-muted uppercase tracking-wide mb-3">Pending Review ({pendingEvents.length})</h2>
      {pendingEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-pastel-border mb-8 shadow-soft">
          <Inbox className="w-12 h-12 mx-auto mb-3 text-pastel-border" />
          <p className="text-lg font-medium text-pastel-muted">No pending events</p>
          <p className="text-sm text-pastel-muted mt-1">All submissions have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {pendingEvents.map((event) => {
            const venue = getVenueById(data.venues, event.venueId);
            const poster = getEventPoster(event);
            return (
              <div key={event.id} className="bg-white rounded-2xl border border-pastel-border overflow-hidden shadow-soft">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-36 h-36 flex-shrink-0 overflow-hidden">
                    <img src={poster} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${CATEGORY_COLORS[event.category]}`}>
                        {CATEGORY_LABELS[event.category]}
                      </span>
                      <span className="text-xs text-pastel-muted">{event.pricingType === 'free' ? 'Free' : 'Paid'}</span>
                    </div>
                    <h3 className="font-bold text-pastel-navy mb-2">{event.title}</h3>
                    <p className="text-sm text-pastel-muted mb-3 line-clamp-2">{event.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-pastel-muted mb-4">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(event.date)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatTime(event.startTime)}–{formatTime(event.endTime)}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {venue?.name}</span>
                      <span>Seats: {event.maxSeats}</span>
                    </div>

                    <div className="mb-3">
                      <label className="block text-xs font-medium text-pastel-muted mb-1.5">Rejection Comment (required for reject)</label>
                      <input
                        type="text"
                        value={commentInputs[event.id] || ''}
                        onChange={(e) => {
                          setCommentInputs({ ...commentInputs, [event.id]: e.target.value });
                          if (errors[event.id]) setErrors({ ...errors, [event.id]: '' });
                        }}
                        placeholder="e.g. Missing co-organizer info, schedule overlap..."
                        className="w-full px-4 py-2.5 rounded-2xl border border-pastel-border text-sm text-pastel-navy focus:outline-none focus:ring-2 focus:ring-pastel-lavender transition-all duration-150"
                      />
                      {errors[event.id] && (
                        <p className="text-xs text-pastel-roseText mt-1.5">{errors[event.id]}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleApprove(event)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-pastel-mintText hover:bg-pastel-mintText rounded-2xl transition-colors duration-150 shadow-soft"
                        style={{ backgroundColor: '#1F7A5A' }}
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(event)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-pastel-roseText bg-pastel-rose hover:bg-pastel-rose border border-pastel-rose rounded-2xl transition-colors duration-150"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pastDecisions.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-pastel-muted uppercase tracking-wide mb-3">Decision History</h2>
          <div className="bg-white rounded-2xl border border-pastel-border overflow-hidden shadow-soft">
            <div className="divide-y divide-pastel-border">
              {pastDecisions.map(({ decision, event }) => (
                <div key={decision.id} className="p-4 flex items-start gap-3">
                  {decision.outcome === 'approved' ? (
                    <CheckCircle2 className="w-5 h-5 text-pastel-mintText flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-pastel-roseText flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-pastel-navy">{event!.title}</p>
                    <p className="text-xs text-pastel-muted mt-0.5">
                      {decision.outcome === 'approved' ? 'Approved' : 'Rejected'} by {decision.decidedBy} ·{' '}
                      {new Date(decision.decidedAt).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                    {decision.comment && (
                      <div className="mt-1.5 flex items-start gap-1.5 text-xs text-pastel-muted bg-pastel-bg rounded-xl px-3 py-2">
                        <MessageSquare className="w-3.5 h-3.5 text-pastel-muted flex-shrink-0 mt-0.5" />
                        {decision.comment}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
