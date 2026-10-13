import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, Save, Send, Upload, ImageIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { hasVenueConflict, CATEGORY_LABELS } from '@/lib/helpers';
import { genId } from '@/lib/storage';
import type { EventCategory, PricingType, CampusEvent } from '@/types';

export default function CreateEvent() {
  const { id } = useParams<{ id: string }>();
  const { data, updateData } = useApp();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const editing = id ? data.events.find((e) => e.id === id) : null;

  const [form, setForm] = useState({
    title: editing?.title || '',
    description: editing?.description || '',
    category: (editing?.category || 'coding') as EventCategory,
    date: editing?.date || '',
    startTime: editing?.startTime || '09:00',
    endTime: editing?.endTime || '17:00',
    venueId: editing?.venueId || data.venues[0]?.id || '',
    maxSeats: editing?.maxSeats?.toString() || '100',
    pricingType: (editing?.pricingType || 'free') as PricingType,
    poster: editing?.poster || '',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const conflict = form.date && form.venueId && form.startTime && form.endTime
    ? hasVenueConflict(data.events, form.venueId, form.date, form.startTime, form.endTime, editing?.id)
    : null;

  function updateField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handlePosterUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image too large. Please use an image under 1MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateField('poster', reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function buildEvent(status: 'draft' | 'pending'): CampusEvent | null {
    if (!form.title.trim() || !form.date || !form.venueId) {
      setMessage({ type: 'error', text: 'Please fill in title, date, and venue.' });
      return null;
    }
    if (status === 'pending' && conflict) {
      setMessage({ type: 'error', text: 'Cannot submit: venue conflict detected. Please change time or venue.' });
      return null;
    }
    const seats = parseInt(form.maxSeats, 10) || 0;
    if (seats <= 0) {
      setMessage({ type: 'error', text: 'Max seats must be greater than 0.' });
      return null;
    }
    return {
      id: editing?.id || genId('e'),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      venueId: form.venueId,
      maxSeats: seats,
      pricingType: form.pricingType,
      poster: form.poster,
      status,
      organizerId: 'org1',
      approverComment: editing?.approverComment || '',
      approvedBy: editing?.approvedBy || '',
      approvedAt: editing?.approvedAt || null,
      createdAt: editing?.createdAt || new Date().toISOString(),
    };
  }

  function handleSave(status: 'draft' | 'pending') {
    const evt = buildEvent(status);
    if (!evt) return;
    updateData((prev) => {
      const exists = prev.events.some((e) => e.id === evt.id);
      return {
        ...prev,
        events: exists
          ? prev.events.map((e) => (e.id === evt.id ? evt : e))
          : [...prev.events, evt],
      };
    });
    setMessage({
      type: 'success',
      text: status === 'draft' ? 'Draft saved successfully!' : 'Event submitted for approval!',
    });
    setTimeout(() => navigate('/organizer/events'), 1200);
  }

  const inputClass = 'w-full px-4 py-3 rounded-2xl border border-pastel-border text-sm text-pastel-navy focus:outline-none focus:ring-2 focus:ring-pastel-lavender focus:border-transparent transition-all duration-150';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-pastel-navy mb-1">{editing ? 'Edit Event' : 'Create Event'}</h1>
      <p className="text-pastel-muted text-sm mb-6">Fill in the details below. Save as draft or submit for approval.</p>

      {message && (
        <div
          className={`mb-5 rounded-2xl p-4 flex items-center gap-2 text-sm ${
            message.type === 'success' ? 'bg-pastel-mint border border-pastel-mint text-pastel-mintText'
            : 'bg-pastel-rose border border-pastel-rose text-pastel-roseText'
          }`}
        >
          {message.type === 'success' ? <Save className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-pastel-border p-6 sm:p-8 space-y-5 shadow-soft">
        <div>
          <label className="block text-sm font-medium text-pastel-navy mb-2">Event Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g. AI/ML Workshop"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pastel-navy mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            placeholder="Describe your event..."
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-pastel-navy mb-2">Category</label>
            <select value={form.category} onChange={(e) => updateField('category', e.target.value as EventCategory)} className={inputClass}>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-pastel-navy mb-2">Pricing</label>
            <select value={form.pricingType} onChange={(e) => updateField('pricingType', e.target.value as PricingType)} className={inputClass}>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-pastel-navy mb-2">Date</label>
          <input type="date" value={form.date} onChange={(e) => updateField('date', e.target.value)} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-pastel-navy mb-2">Start Time</label>
            <input type="time" value={form.startTime} onChange={(e) => updateField('startTime', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-pastel-navy mb-2">End Time</label>
            <input type="time" value={form.endTime} onChange={(e) => updateField('endTime', e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-pastel-navy mb-2">Venue</label>
            <select value={form.venueId} onChange={(e) => updateField('venueId', e.target.value)} className={inputClass}>
              {data.venues.map((v) => (
                <option key={v.id} value={v.id}>{v.name} (cap: {v.capacity})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-pastel-navy mb-2">Max Seats</label>
            <input type="number" min="1" value={form.maxSeats} onChange={(e) => updateField('maxSeats', e.target.value)} className={inputClass} />
          </div>
        </div>

        {conflict && (
          <div className="bg-pastel-peach border border-pastel-peach rounded-2xl p-4 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-pastel-peachText flex-shrink-0 mt-0.5" />
            <div className="text-sm text-pastel-peachText">
              <p className="font-semibold">Venue Conflict Detected</p>
              <p className="mt-0.5">
                "{conflict.title}" is already booked at this venue on the same date ({conflict.startTime}–{conflict.endTime}).
                Submission will be blocked. Please pick a different venue, date, or time.
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-pastel-navy mb-2">Poster Image</label>
          <div className="flex items-start gap-4">
            <div className="w-32 h-24 rounded-2xl border-2 border-dashed border-pastel-border flex items-center justify-center overflow-hidden bg-pastel-bg flex-shrink-0">
              {form.poster ? (
                <img src={form.poster} alt="Poster preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-pastel-border" />
              )}
            </div>
            <div className="flex-1">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePosterUpload}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-pastel-lavenderText bg-pastel-lavenderLight hover:bg-pastel-border rounded-xl border border-pastel-border transition-colors duration-150"
              >
                <Upload className="w-4 h-4" /> Upload Poster
              </button>
              {form.poster && (
                <button
                  onClick={() => updateField('poster', '')}
                  className="ml-2 text-sm text-pastel-muted hover:text-pastel-roseText transition-colors duration-150"
                >
                  Remove
                </button>
              )}
              <p className="text-xs text-pastel-muted mt-2">Max 1MB. A category placeholder is used if no image is uploaded.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-pastel-border">
          <button
            onClick={() => handleSave('draft')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm bg-pastel-lavenderLight text-pastel-lavenderText hover:bg-pastel-border transition-colors duration-150"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button
            onClick={() => handleSave('pending')}
            disabled={!!conflict}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-150 ${
              conflict
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-pastel-lavender text-white hover:bg-pastel-lavenderDark shadow-soft hover:shadow-soft-hover'
            }`}
          >
            <Send className="w-4 h-4" /> Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );
}
