import React, { useState } from 'react';
import { ShieldAlert, X, HeartHandshake } from 'lucide-react';

export const SafetyBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (compact) {
    return (
      <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="flex-1">
          <strong className="font-semibold">Consejo de seguridad:</strong> Recomendamos agendar siempre los primeros encuentros en lugares públicos concurridos (cafeterías, parques, museos).
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 shadow-xs relative">
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <span>Encuentros seguros y amistosos</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">Comunidad segura</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            ConectaCerca es un espacio para amistades y actividades compartidas. Para tu tranquilidad, acuerda encontrarte siempre en <strong>lugares públicos</strong> (cafés, eventos, parajes concurridos) y avisa a alguien cercano.
          </p>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors shrink-0"
        title="Ocultar aviso"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
