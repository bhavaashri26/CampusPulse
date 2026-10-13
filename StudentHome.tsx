import { useState, useMemo } from 'react';
import { Search, Filter, CalendarDays } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import EventCard from '@/components/EventCard';
import { CATEGORY_LABELS } from '@/lib/helpers';
import type { EventCategory, PricingType } from '@/types';

export default function StudentHome() {
  const { data } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<EventCategory | 'all'>('all');
  const [pricing, setPricing] = useState<PricingType | 'all'>('all');

  const liveEvents = useMemo(() => {
    return data.events
      .filter((e) => e.status === 'live')
      .filter((e) => {
        if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (category !== 'all' && e.category !== category) return false;
        if (pricing !== 'all' && e.pricingType !== pricing) return false;
        return true;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data.events, search, category, pricing]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero with soft pastel gradient */}
      <div className="mb-8 rounded-3xl p-8 sm:p-10 text-white" style={{ background: 'linear-gradient(135deg, #7C6BD6 0%, #A63D6B 50%, #2B6CB0 100%)' }}>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Discover Campus Events</h1>
        <p className="text-white/90 text-lg">Browse, register, and show up. Your campus pulse, all in one place.</p>
        <div className="mt-5 flex items-center gap-2 text-sm text-white/80">
          <CalendarDays className="w-4 h-4" />
          <span>{liveEvents.length} live events happening soon</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-pastel-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-pastel-border bg-white text-sm text-pastel-navy focus:outline-none focus:ring-2 focus:ring-pastel-lavender focus:border-transparent transition-all duration-150"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-pastel-muted hidden sm:block" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as EventCategory | 'all')}
            className="px-4 py-3 rounded-2xl border border-pastel-border bg-white text-sm text-pastel-navy focus:outline-none focus:ring-2 focus:ring-pastel-lavender transition-all duration-150"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={pricing}
            onChange={(e) => setPricing(e.target.value as PricingType | 'all')}
            className="px-4 py-3 rounded-2xl border border-pastel-border bg-white text-sm text-pastel-navy focus:outline-none focus:ring-2 focus:ring-pastel-lavender transition-all duration-150"
          >
            <option value="all">All Pricing</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Event grid */}
      {liveEvents.length === 0 ? (
        <div className="text-center py-20 text-pastel-muted">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No events match your filters</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {liveEvents.map((event) => (
            <EventCard key={event.id} event={event} venues={data.venues} registrations={data.registrations} />
          ))}
        </div>
      )}
    </div>
  );
}
