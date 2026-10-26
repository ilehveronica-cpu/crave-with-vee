import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-200 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-white border-[#2E9D63]/30 text-[#222222]'
              : toast.type === 'error'
              ? 'bg-white border-red-200 text-red-900'
              : 'bg-white border-orange-200 text-[#222222]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#2E9D63] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#FF6B35] shrink-0" />}
            <span className="text-xs sm:text-sm font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="p-1 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors ml-2"
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
