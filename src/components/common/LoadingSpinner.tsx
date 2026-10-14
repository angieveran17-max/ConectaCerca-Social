import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ label?: string }> = ({ label = 'Cargando personas cercanas...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 gap-3">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
        <Loader2 className="w-5 h-5 text-indigo-600 absolute animate-pulse" />
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
};
