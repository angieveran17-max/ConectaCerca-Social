import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserId: string;
  targetUserName: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetUserId,
  targetUserName
}) => {
  const { reportUser } = useAuth();
  const [reason, setReason] = useState('Comportamiento inadecuado');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      reportUser(targetUserId, reason, description);
      setIsSubmitting(false);
      onClose();
      setDescription('');
    }, 500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reportar usuario ${targetUserName}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <p>
            Nos tomamos la seguridad muy en serio. Los reportes son confidenciales e investigados por nuestro equipo.
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Motivo del reporte
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none"
          >
            <option value="Comportamiento inadecuado">Comportamiento inadecuado</option>
            <option value="Spam o publicidad">Spam o contenido comercial</option>
            <option value="Perfil falso o engañoso">Perfil falso o de menor de edad</option>
            <option value="Acoso o mensajes molestos">Acoso o mensajes incomodos</option>
            <option value="Uso enfocado en citas no deseadas">Intención romántica agresiva/no deseada</option>
            <option value="Otro">Otro motivo</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Detalles adicionales
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe lo sucedido brevemente..."
            className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none placeholder-slate-400"
          />
        </div>

        <div className="flex justify-end gap-2.5 mt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="danger" isLoading={isSubmitting}>
            Enviar reporte
          </Button>
        </div>
      </form>
    </Modal>
  );
};
