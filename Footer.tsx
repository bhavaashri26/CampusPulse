import { RotateCcw, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { reset } = useApp();

  return (
    <footer className="mt-16 border-t border-pastel-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-pastel-muted flex items-center gap-1.5">
            CampusPulse — Hackathon Demo Prototype
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-pastel-muted flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-pastel-pinkText" /> for campuses
            </span>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-pastel-lavenderText bg-pastel-lavenderLight hover:bg-pastel-border rounded-xl border border-pastel-border transition-colors duration-150"
            >
              <RotateCcw className="w-4 h-4" />
              Reset demo data
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
