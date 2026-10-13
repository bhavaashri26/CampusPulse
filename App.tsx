import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StudentHome from '@/pages/student/StudentHome';
import EventDetail from '@/pages/student/EventDetail';
import MyTickets from '@/pages/student/MyTickets';
import CreateEvent from '@/pages/organizer/CreateEvent';
import MyEvents from '@/pages/organizer/MyEvents';
import CheckIn from '@/pages/organizer/CheckIn';
import Analytics from '@/pages/organizer/Analytics';
import Approvals from '@/pages/approver/Approvals';
import type { Role } from '@/types';

function RoleHome() {
  const { role } = useApp();
  // Student and organizer both see event listing at "/"; approver sees approvals
  if (role === 'approver') return <Approvals />;
  return <StudentHome />;
}

function AppRoutes() {
  const { role } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-pastel-bg">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<RoleHome />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/tickets" element={<MyTickets />} />
          {/* Organizer routes */}
          <Route path="/organizer/create" element={<CreateEvent />} />
          <Route path="/organizer/create/:id" element={<CreateEvent />} />
          <Route path="/organizer/events" element={<MyEvents />} />
          <Route path="/organizer/checkin" element={<CheckIn />} />
          <Route path="/organizer/analytics" element={<Analytics />} />
          {/* Approver routes */}
          <Route path="/approver" element={<Approvals />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
