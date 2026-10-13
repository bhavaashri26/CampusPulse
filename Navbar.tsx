import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, ChevronDown, User, Settings, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Role } from '@/types';

const ROLE_LABELS: Record<Role, string> = {
  student: 'Student',
  organizer: 'Organizer',
  approver: 'Approver',
};

export default function Navbar() {
  const { role, setRole } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleRoleChange(r: Role) {
    setRole(r);
    setDropdownOpen(false);
    navigate('/');
  }

  const studentLinks = [
    { to: '/', label: 'Home', icon: Calendar },
    { to: '/tickets', label: 'My Tickets', icon: CheckCircle },
  ];
  const organizerLinks = [
    { to: '/', label: 'Home', icon: Calendar },
    { to: '/organizer/create', label: 'Create Event', icon: Settings },
    { to: '/organizer/events', label: 'My Events', icon: Settings },
    { to: '/organizer/checkin', label: 'Check-In', icon: CheckCircle },
    { to: '/organizer/analytics', label: 'Analytics', icon: Settings },
  ];
  const approverLinks = [
    { to: '/', label: 'Home', icon: Calendar },
    { to: '/approver', label: 'Approvals', icon: Settings },
  ];

  const links = role === 'student' ? studentLinks : role === 'organizer' ? organizerLinks : approverLinks;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-pastel-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-pastel-lavender flex items-center justify-center transition-transform group-hover:scale-105">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-pastel-navy">
              Campus<span className="text-pastel-lavender">Pulse</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
                    active
                      ? 'bg-pastel-lavender text-white'
                      : 'text-pastel-muted hover:bg-pastel-lavenderLight hover:text-pastel-navy'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-pastel-lavenderLight hover:bg-pastel-border transition-colors duration-150 border border-pastel-border"
            >
              <div className="w-7 h-7 rounded-full bg-pastel-lavender flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden sm:inline text-pastel-navy">{ROLE_LABELS[role]}</span>
              <ChevronDown className={`w-4 h-4 text-pastel-muted transition-transform duration-150 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-soft-hover border border-pastel-border py-2 overflow-hidden">
                <p className="px-4 py-1.5 text-xs font-semibold text-pastel-muted uppercase tracking-wide">Switch Role</p>
                {(['student', 'organizer', 'approver'] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors duration-150 hover:bg-pastel-lavenderLight ${
                      role === r ? 'text-pastel-lavender font-semibold' : 'text-pastel-navy'
                    }`}
                  >
                    {ROLE_LABELS[r]}
                    {role === r && <CheckCircle className="w-4 h-4 text-pastel-lavender" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:hidden flex items-center gap-1.5 pb-3 overflow-x-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
                  active ? 'bg-pastel-lavender text-white' : 'text-pastel-muted hover:bg-pastel-lavenderLight'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
