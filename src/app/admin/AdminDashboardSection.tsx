"use client";

import { Calendar, Clock, Users, TrendingUp, CheckCircle, Edit2, Trash2, CalendarClock } from "lucide-react";
import type { Reservation } from "@/lib/supabase";
import type { AdminStats } from "@/lib/supabase-admin-extended";

type Props = {
  stats: AdminStats | null;
  reservations: Reservation[];
  loading: boolean;
  onConfirmAllPending: () => void;
  onQuickAvailability: () => void;
  onQuickCreateClass: () => void;
  onGoToClases: () => void;
  onConfirmReservation: (id: string) => void;
  onCancelReservation: (id: string) => void;
  onGoToPendientes: () => void;
  onResetAllCupos: () => void;
};

export function AdminDashboardSection({
  stats,
  reservations,
  loading,
  onConfirmAllPending,
  onQuickAvailability,
  onQuickCreateClass,
  onGoToClases,
  onConfirmReservation,
  onCancelReservation,
  onGoToPendientes,
  onResetAllCupos,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Pendientes */}
          <div className="bg-gradient-to-br from-yellow-600/30 to-yellow-800/30 border-2 border-yellow-500/50 rounded-2xl p-6 md:p-8 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <Clock size={32} className="text-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">Pendientes</span>
            </div>
            <div className="text-5xl md:text-6xl font-black text-white mb-2">
              {stats.reservas.pendientes}
            </div>
            <div className="text-sm text-gray-400">Reservas por confirmar</div>
          </div>

          {/* Confirmadas */}
          <div className="bg-gradient-to-br from-green-600/30 to-green-800/30 border-2 border-green-500/50 rounded-2xl p-6 md:p-8 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle size={32} className="text-green-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-green-400">Confirmadas</span>
            </div>
            <div className="text-5xl md:text-6xl font-black text-white mb-2">
              {stats.reservas.confirmadas}
            </div>
            <div className="text-sm text-gray-400">Total confirmadas</div>
          </div>

          {/* Ocupación */}
          <div className="bg-gradient-to-br from-naik-gold/30 to-yellow-600/30 border-2 border-naik-gold/50 rounded-2xl p-6 md:p-8 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp size={32} className="text-naik-gold" />
              <span className="text-xs font-bold uppercase tracking-wider text-naik-gold">Ocupación</span>
            </div>
            <div className="text-5xl md:text-6xl font-black text-white mb-2">
              {stats.cupos.ocupacion}%
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 mt-3">
              <div
                className="bg-naik-gold rounded-full h-3 transition-all duration-500"
                style={{ width: `${stats.cupos.ocupacion}%` }}
              />
            </div>
          </div>

          {/* Total reservas */}
          <div className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 border-2 border-blue-500/50 rounded-2xl p-6 md:p-8 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <Users size={32} className="text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Total</span>
            </div>
            <div className="text-5xl md:text-6xl font-black text-white mb-2">
              {stats.reservas.total}
            </div>
            <div className="text-sm text-gray-400">Reservas registradas</div>
          </div>
        </div>
      )}

      {/* Acciones rápidas & Zona avanzada */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-black uppercase mb-6 flex items-center gap-3">
          <span className="text-naik-gold">⚡</span> Acciones Rápidas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={onConfirmAllPending}
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl uppercase transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <CheckCircle size={24} />
            <span>Confirmar Pendientes</span>
          </button>

          <button
            onClick={onQuickCreateClass}
            disabled={loading}
            className="bg-gradient-to-r from-naik-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-4 px-6 rounded-xl uppercase transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <CalendarClock size={24} />
            <span>Crear Clase Rápida</span>
          </button>

          <button
            onClick={onGoToClases}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl uppercase transition-all hover:scale-105 flex items-center justify-center gap-3"
          >
            <Edit2 size={24} />
            <span>Clases y Horarios</span>
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-red-500/20">
          <details className="group">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400 uppercase font-bold tracking-wide flex items-center gap-2">
              <span>Zona de Admin Avanzado</span>
              <span className="group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-4">
              <button
                onClick={onResetAllCupos}
                disabled={loading}
                className="w-full bg-red-600/20 border-2 border-red-500 hover:bg-red-600 text-red-400 hover:text-white font-bold py-3 px-6 rounded-xl uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Trash2 size={20} />
                <span>Resetear Todos los Cupos</span>
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Elimina TODA la disponibilidad. Usalo solo para empezar de cero.
              </p>
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <p className="text-xs text-gray-400 mb-2 text-center uppercase font-bold">
                        Opciones avanzadas de cupos
                      </p>
                      <button
                        onClick={onQuickAvailability}
                        disabled={loading}
                        className="w-full bg-blue-600/20 border-2 border-blue-500 hover:bg-blue-600 text-blue-200 hover:text-white font-bold py-3 px-6 rounded-xl uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                      >
                        <Calendar size={18} />
                        <span>Agregar Disponibilidad Manual</span>
                      </button>
                    </div>
            </div>
          </details>
        </div>
      </div>

      {/* Últimas pendientes */}
      {reservations.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl md:text-3xl font-black uppercase flex items-center gap-3">
              <Clock className="text-yellow-400" size={28} />
              Últimas Pendientes
            </h3>
            <button
              onClick={onGoToPendientes}
              className="text-sm text-naik-gold hover:text-yellow-400 font-bold uppercase transition-colors"
            >
              Ver todas
            </button>
          </div>

          <div className="space-y-3">
            {reservations.slice(0, 5).map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-naik-gold/50 transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">Alumno</p>
                    <p className="font-bold">{reservation.nombre}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">Profesor</p>
                    <p className="text-sm">{reservation.teacher_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">Fecha</p>
                    <p className="text-sm">{reservation.fecha}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onConfirmReservation(reservation.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg text-sm uppercase transition-all"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => onCancelReservation(reservation.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg text-sm uppercase transition-all"
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

