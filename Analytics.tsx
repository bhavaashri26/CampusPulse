import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, UserCheck, TrendingUp, Ticket } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CATEGORY_LABELS, getRegistrationsForEvent, getCheckedInCount } from '@/lib/helpers';

export default function Analytics() {
  const { data } = useApp();

  const liveAndApproved = data.events.filter((e) => e.status === 'live' || e.status === 'approved');

  const totals = useMemo(() => {
    const totalRegs = data.registrations.length;
    const totalCheckins = data.registrations.filter((r) => r.checkedIn).length;
    const attendance = totalRegs > 0 ? Math.round((totalCheckins / totalRegs) * 100) : 0;
    return { totalRegs, totalCheckins, attendance };
  }, [data.registrations]);

  const chartData = useMemo(() => {
    return liveAndApproved.map((e) => ({
      name: e.title.length > 18 ? e.title.slice(0, 18) + '…' : e.title,
      registrations: getRegistrationsForEvent(data.registrations, e.id).length,
      checkIns: getCheckedInCount(data.registrations, e.id),
    }));
  }, [liveAndApproved, data.registrations]);

  const cards = [
    { label: 'Total Registrations', value: totals.totalRegs, icon: Ticket, color: 'lavender' },
    { label: 'Total Check-ins', value: totals.totalCheckins, icon: UserCheck, color: 'mint' },
    { label: 'Attendance Rate', value: `${totals.attendance}%`, icon: TrendingUp, color: 'peach' },
  ];

  const colorMap: Record<string, string> = {
    lavender: 'bg-pastel-lavenderLight text-pastel-lavender',
    mint: 'bg-pastel-mint text-pastel-mintText',
    peach: 'bg-pastel-peach text-pastel-peachText',
  };

  const PASTEL_LAVENDER = '#7C6BD6';
  const PASTEL_MINT = '#1F7A5A';
  const PASTEL_GRID = '#EDE7FA';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-pastel-navy mb-1">Analytics</h1>
      <p className="text-pastel-muted text-sm mb-6">Overview of registrations and attendance across your events.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-pastel-border p-5 flex items-center gap-4 shadow-soft">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorMap[card.color]}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-pastel-navy">{card.value}</p>
                <p className="text-sm text-pastel-muted">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-pastel-border p-6 shadow-soft">
        <h2 className="text-lg font-bold text-pastel-navy mb-1">Registrations & Check-ins by Event</h2>
        <p className="text-sm text-pastel-muted mb-5">Compare registration volume with actual attendance.</p>
        {chartData.length === 0 ? (
          <div className="text-center py-12 text-pastel-muted">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>No live or approved events to show analytics for.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={PASTEL_GRID} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7A7799', fontFamily: 'Plus Jakarta Sans' }} interval={0} angle={-15} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 12, fill: '#7A7799', fontFamily: 'Plus Jakarta Sans' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '16px', border: '1px solid #EDE7FA', fontSize: '13px', fontFamily: 'Plus Jakarta Sans' }}
                cursor={{ fill: '#FBF8FF' }}
              />
              <Bar dataKey="registrations" name="Registrations" radius={[8, 8, 0, 0]} fill={PASTEL_LAVENDER}>
                {chartData.map((_, i) => (
                  <Cell key={`r-${i}`} fill={PASTEL_LAVENDER} />
                ))}
              </Bar>
              <Bar dataKey="checkIns" name="Check-ins" radius={[8, 8, 0, 0]} fill={PASTEL_MINT}>
                {chartData.map((_, i) => (
                  <Cell key={`c-${i}`} fill={PASTEL_MINT} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <span className="flex items-center gap-2 text-pastel-navy">
            <span className="w-3 h-3 rounded-md" style={{ backgroundColor: PASTEL_LAVENDER }} /> Registrations
          </span>
          <span className="flex items-center gap-2 text-pastel-navy">
            <span className="w-3 h-3 rounded-md" style={{ backgroundColor: PASTEL_MINT }} /> Check-ins
          </span>
        </div>
      </div>

      {liveAndApproved.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-pastel-border p-6 shadow-soft">
          <h2 className="text-lg font-bold text-pastel-navy mb-4">Per-Event Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-pastel-muted border-b border-pastel-border">
                  <th className="pb-3 font-medium">Event</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium text-center">Registered</th>
                  <th className="pb-3 font-medium text-center">Checked In</th>
                  <th className="pb-3 font-medium text-center">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {liveAndApproved.map((e) => {
                  const regs = getRegistrationsForEvent(data.registrations, e.id);
                  const cin = getCheckedInCount(data.registrations, e.id);
                  const pct = regs.length > 0 ? Math.round((cin / regs.length) * 100) : 0;
                  return (
                    <tr key={e.id} className="border-b border-pastel-border last:border-0">
                      <td className="py-3 font-medium text-pastel-navy">{e.title}</td>
                      <td className="py-3 text-pastel-muted">{CATEGORY_LABELS[e.category]}</td>
                      <td className="py-3 text-center text-pastel-navy">{regs.length}</td>
                      <td className="py-3 text-center text-pastel-navy">{cin}</td>
                      <td className="py-3 text-center">
                        <span className={`font-semibold ${pct >= 75 ? 'text-pastel-mintText' : pct >= 50 ? 'text-pastel-peachText' : 'text-pastel-muted'}`}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
