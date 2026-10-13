import { useState } from 'react';
import { Search, CheckCircle2, XCircle, AlertTriangle, UserCheck, Users, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatDateShort, getRegistrationsForEvent, getCheckedInCount, CATEGORY_LABELS } from '@/lib/helpers';

export default function CheckIn() {
  const { data, updateData } = useApp();
  const [selectedEventId, setSelectedEventId] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [result, setResult] = useState<
    { type: 'success' | 'invalid' | 'already' | 'wrong'; text: string; name?: string } | null
  >(null);

  const checkinEvents = data.events.filter((e) => e.status === 'live' || e.status === 'approved');
  const selectedEvent = selectedEventId ? data.events.find((e) => e.id === selectedEventId) : null;
  const regs = selectedEvent ? getRegistrationsForEvent(data.registrations, selectedEvent.id) : [];
  const checkedIn = selectedEvent ? getCheckedInCount(data.registrations, selectedEvent.id) : 0;

  function handleCheckIn() {
    if (!selectedEvent || !codeInput.trim()) {
      setResult({ type: 'invalid', text: 'Please select an event and enter a ticket code.' });
      return;
    }
    const code = codeInput.trim().toUpperCase();
    const reg = data.registrations.find((r) => r.ticketCode.toUpperCase() === code);

    if (!reg) {
      setResult({ type: 'invalid', text: `No ticket found with code "${code}".` });
      return;
    }
    if (reg.eventId !== selectedEvent.id) {
      const otherEvent = data.events.find((e) => e.id === reg.eventId);
      setResult({
        type: 'wrong',
        text: `This ticket is for "${otherEvent?.title || 'another event'}", not "${selectedEvent.title}".`,
      });
      return;
    }
    if (reg.checkedIn) {
      setResult({ type: 'already', text: `${reg.studentName} has already checked in.` });
      return;
    }
    updateData((prev) => ({
      ...prev,
      registrations: prev.registrations.map((r) =>
        r.id === reg.id ? { ...r, checkedIn: true } : r
      ),
    }));
    setResult({ type: 'success', text: `Check-in successful!`, name: reg.studentName });
    setCodeInput('');
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-pastel-navy mb-1">Check-In</h1>
      <p className="text-pastel-muted text-sm mb-6">Select an event and enter a ticket code to check in attendees.</p>

      <div className="bg-white rounded-2xl border border-pastel-border p-5 mb-5 shadow-soft">
        <label className="block text-sm font-medium text-pastel-navy mb-2">Select Event</label>
        <select
          value={selectedEventId}
          onChange={(e) => { setSelectedEventId(e.target.value); setResult(null); }}
          className="w-full px-4 py-3 rounded-2xl border border-pastel-border text-sm text-pastel-navy focus:outline-none focus:ring-2 focus:ring-pastel-lavender transition-all duration-150"
        >
          <option value="">-- Choose an event --</option>
          {checkinEvents.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title} ({formatDateShort(e.date)}) — {CATEGORY_LABELS[e.category]}
            </option>
          ))}
        </select>

        {selectedEvent && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-pastel-lavenderLight rounded-2xl p-3 text-center">
              <Users className="w-5 h-5 text-pastel-lavender mx-auto mb-1" />
              <p className="text-2xl font-bold text-pastel-lavenderText">{regs.length}</p>
              <p className="text-xs text-pastel-lavenderText font-medium">Registered</p>
            </div>
            <div className="bg-pastel-mint rounded-2xl p-3 text-center">
              <UserCheck className="w-5 h-5 text-pastel-mintText mx-auto mb-1" />
              <p className="text-2xl font-bold text-pastel-mintText">{checkedIn}</p>
              <p className="text-xs text-pastel-mintText font-medium">Checked In</p>
            </div>
            <div className="bg-pastel-peach rounded-2xl p-3 text-center">
              <TrendingUp className="w-5 h-5 text-pastel-peachText mx-auto mb-1" />
              <p className="text-2xl font-bold text-pastel-peachText">
                {regs.length > 0 ? Math.round((checkedIn / regs.length) * 100) : 0}%
              </p>
              <p className="text-xs text-pastel-peachText font-medium">Attendance</p>
            </div>
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className="bg-white rounded-2xl border border-pastel-border p-5 shadow-soft">
          <label className="block text-sm font-medium text-pastel-navy mb-2">Ticket Code</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-pastel-muted" />
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCheckIn()}
                placeholder="e.g. CP-AB12CD"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-pastel-border text-sm font-mono text-pastel-navy focus:outline-none focus:ring-2 focus:ring-pastel-lavender transition-all duration-150"
              />
            </div>
            <button
              onClick={handleCheckIn}
              className="px-5 py-3 bg-pastel-lavender text-white text-sm font-semibold rounded-2xl hover:bg-pastel-lavenderDark transition-colors duration-150 shadow-soft"
            >
              Check In
            </button>
          </div>

          {result && (
            <div
              className={`mt-4 rounded-2xl p-4 flex items-start gap-3 ${
                result.type === 'success' ? 'bg-pastel-mint border border-pastel-mint'
                : result.type === 'invalid' ? 'bg-pastel-bg border border-pastel-border'
                : result.type === 'already' ? 'bg-pastel-peach border border-pastel-peach'
                : 'bg-pastel-rose border border-pastel-rose'
              }`}
            >
              {result.type === 'success' && <CheckCircle2 className="w-6 h-6 text-pastel-mintText flex-shrink-0" />}
              {result.type === 'invalid' && <XCircle className="w-6 h-6 text-pastel-muted flex-shrink-0" />}
              {result.type === 'already' && <AlertTriangle className="w-6 h-6 text-pastel-peachText flex-shrink-0" />}
              {result.type === 'wrong' && <XCircle className="w-6 h-6 text-pastel-roseText flex-shrink-0" />}
              <div className="text-sm">
                {result.type === 'success' ? (
                  <>
                    <p className="font-semibold text-pastel-mintText">Check-in successful!</p>
                    <p className="text-pastel-mintText mt-0.5">Welcome, <span className="font-semibold">{result.name}</span>!</p>
                  </>
                ) : (
                  <p className={`font-medium ${
                    result.type === 'invalid' ? 'text-pastel-navy'
                    : result.type === 'already' ? 'text-pastel-peachText'
                    : 'text-pastel-roseText'
                  }`}>{result.text}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
