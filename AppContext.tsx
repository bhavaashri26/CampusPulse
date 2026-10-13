import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Role, AppData } from '@/types';
import { loadData, saveData, resetData } from '@/lib/storage';

interface AppContextValue {
  role: Role;
  setRole: (r: Role) => void;
  data: AppData;
  setData: (d: AppData) => void;
  updateData: (updater: (prev: AppData) => AppData) => void;
  reset: () => void;
  studentName: string;
  setStudentName: (name: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('student');
  const [data, setDataState] = useState<AppData>(() => loadData());
  const [studentName, setStudentName] = useState<string>('Demo Student');

  const setData = useCallback((d: AppData) => {
    setDataState(d);
    saveData(d);
  }, []);

  const updateData = useCallback((updater: (prev: AppData) => AppData) => {
    setDataState((prev) => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const fresh = resetData();
    setDataState(fresh);
  }, []);

  return (
    <AppContext.Provider value={{ role, setRole, data, setData, updateData, reset, studentName, setStudentName }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
