'use client';

import { useState, useEffect } from 'react';
import { confirmReservation, cancelReservation } from '@/lib/supabase-admin';
import { getAllReservations, getAllAvailability, getStats, updateAvailability, getReservationsByTeacher, getClassSchedules, createClassSchedule, updateClassSchedule, deleteClassSchedule, resetAllAvailability } from '@/lib/supabase-admin-extended';
import type { Reservation } from '@/lib/supabase';
import { X, Calendar, Users, TrendingUp, CheckCircle, Clock, XCircle, Edit2, Save, Eye, Plus, Trash2, CalendarClock } from 'lucide-react';
import { teachers } from '@/data/teachers';

type Tab = 'dashboard' | 'pendientes' | 'confirmadas' | 'cupos';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('2026-02');
  const [editingCupo, setEditingCupo] = useState<{teacherId: string; month: string} | null>(null);
  const [editForm, setEditForm] = useState({cupos_total: 0, cupos_reservados: 0, days: [] as number[]});
  const [newDay, setNewDay] = useState('');
  const [confirmModal, setConfirmModal] = useState<{ show: boolean; id: string; action: 'confirm' | 'cancel' }>({ 
    show: false, 
    id: '', 
    action: 'confirm' 
  });
  const [detailModal, setDetailModal] = useState<{
    show: boolean;
    teacherId: string;
    teacherName: string;
    month: string;
    reservations: Reservation[];
  }>({
    show: false,
    teacherId: '',
    teacherName: '',
    month: '',
    reservations: []
  });
  const [scheduleModal, setScheduleModal] = useState<{
    show: boolean;
    teacherId: string;
    teacherName: string;
    month: string;
    schedules: any[];
  }>({
    show: false,
    teacherId: '',
    teacherName: '',
    month: '',
    schedules: []
  });
  const [newSchedule, setNewSchedule] = useState({
    day: '',
    time: '',
    class_name: '',
    max_students: '15',
    duration: '60'
  });
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  const [addAvailabilityModal, setAddAvailabilityModal] = useState({
    show: false,
    teacherId: '',
    cupos: 15,
    days: [] as number[]
  });

  // Helper: verificar si un día ya pasó
  const isDayPast = (day: number, month: string) => {
    const [year, monthNum] = month.split('-').map(Number);
    const dayDate = new Date(year, monthNum - 1, day);
    
    // Obtener solo la fecha de hoy sin hora (inicio del día)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // El día es "pasado" si es anterior al día actual (no incluye el día actual)
    return dayDate < today;
  };

  // Acciones rápidas
  const handleConfirmAllPending = async () => {
    const pendingReservations = reservations.filter(r => r.status === 'pendiente');
    if (pendingReservations.length === 0) {
      alert('No hay reservas pendientes para confirmar');
      return;
    }
    
    if (!confirm(`¿Confirmar ${pendingReservations.length} reservas pendientes?`)) return;
    
    try {
      setLoading(true);
      for (const reservation of pendingReservations) {
        await confirmReservation(reservation.id);
      }
      alert(`${pendingReservations.length} reservas confirmadas correctamente`);
      await loadData();
    } catch (error: any) {
      console.error('Error al confirmar reservas:', error);
      alert('Error al confirmar algunas reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAvailability = () => {
    setAddAvailabilityModal({
      show: true,
      teacherId: '',
      cupos: 15,
      days: []
    });
  };

  const handleSaveAvailability = async () => {
    if (!addAvailabilityModal.teacherId) {
      alert('Selecciona un profesor');
      return;
    }
    if (addAvailabilityModal.days.length === 0) {
      alert('Selecciona al menos un día');
      return;
    }

    try {
      await updateAvailability(addAvailabilityModal.teacherId, selectedMonth, {
        cupos_total: addAvailabilityModal.cupos,
        cupos_reservados: 0,
        days: addAvailabilityModal.days
      });
      alert('Disponibilidad agregada correctamente');
      setAddAvailabilityModal({ show: false, teacherId: '', cupos: 15, days: [] });
      if (activeTab === 'cupos') await loadAvailability();
    } catch (error: any) {
      console.error('Error al agregar disponibilidad:', error);
      alert('Error al agregar disponibilidad');
    }
  };

  const handleResetAllCupos = async () => {
    if (!confirm('⚠️ ATENCIÓN: Esto eliminará TODA la disponibilidad (días y cupos) de todos los profesores. ¿Estás seguro?')) {
      return;
    }
    
    if (!confirm('¿Realmente querés borrar todo y empezar de cero?')) {
      return;
    }

    try {
      setLoading(true);
      await resetAllAvailability();
      alert('✓ Todos los cupos fueron eliminados correctamente');
      await loadData();
    } catch (error: any) {
      console.error('Error al resetear cupos:', error);
      alert('Error al resetear cupos');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setLoginError('');
    
    const pwd = password.trim();
    
    if (!pwd) {
      setLoginError('Por favor ingresa la contraseña');
      return;
    }
    
    if (pwd === 'naik2026') {
      setIsAuthenticated(true);
      setPassword('');
      loadData();
    } else {
      setLoginError('Contraseña incorrecta');
      setPassword('');
      setTimeout(() => setLoginError(''), 3000);
    }
  };

  const loadReservations = async (status?: 'pendiente' | 'confirmada' | 'cancelada') => {
    setLoading(true);
    try {
      const data = await getAllReservations(status);
      setReservations(data || []);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      alert('Error al cargar reservas');
    }
    setLoading(false);
  };

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const data = await getAllAvailability(selectedMonth);
      setAvailability(data || []);
    } catch (error) {
      console.error('Error al cargar disponibilidad:', error);
      alert('Error al cargar disponibilidad');
    }
    setLoading(false);
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Error al cargar estadisticas:', error);
    }
    setLoading(false);
  };

  const loadData = () => {
    if (activeTab === 'dashboard') {
      loadStats();
      loadReservations('pendiente');
    } else if (activeTab === 'pendientes') {
      loadReservations('pendiente');
    } else if (activeTab === 'confirmadas') {
      loadReservations('confirmada');
    } else if (activeTab === 'cupos') {
      loadAvailability();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [activeTab, selectedMonth, isAuthenticated]);

  const handleConfirm = async (id: string) => {
    setConfirmModal({ show: true, id, action: 'confirm' });
  };

  const handleCancel = async (id: string) => {
    setConfirmModal({ show: true, id, action: 'cancel' });
  };

  const executeAction = async () => {
    try {
      if (confirmModal.action === 'confirm') {
        await confirmReservation(confirmModal.id);
        alert('Reserva confirmada! Cupos actualizados.');
      } else {
        await cancelReservation(confirmModal.id);
        alert('Reserva cancelada.');
      }
      setConfirmModal({ show: false, id: '', action: 'confirm' });
      await loadData();
    } catch (error: any) {
      console.error('Error en executeAction:', error);
      alert(error.message || 'Error al procesar la accion');
    }
  };

  const handleEditCupo = (teacherId: string, month: string, cupos_total: number, cupos_reservados: number, days: number[]) => {
    setEditingCupo({teacherId, month});
    setEditForm({cupos_total, cupos_reservados, days: days || []});
    setNewDay('');
  };

  const handleSaveCupo = async () => {
    if (!editingCupo) return;
    
    try {
      await updateAvailability(editingCupo.teacherId, editingCupo.month, editForm);
      alert('Cupos actualizados correctamente');
      setEditingCupo(null);
      await loadAvailability();
    } catch (error: any) {
      console.error('Error al guardar cupos:', error);
      alert('Error al guardar cupos');
    }
  };

  const handleAddDay = () => {
    const day = parseInt(newDay);
    if (!isNaN(day) && day >= 1 && day <= 31 && !editForm.days.includes(day)) {
      setEditForm({
        ...editForm,
        days: [...editForm.days, day].sort((a, b) => a - b)
      });
      setNewDay('');
    }
  };

  const handleRemoveDay = (day: number) => {
    setEditForm({
      ...editForm,
      days: editForm.days.filter(d => d !== day)
    });
  };

  const handleViewDetails = async (teacherId: string, teacherName: string, month: string) => {
    try {
      const reservations = await getReservationsByTeacher(teacherId);
      // Filtrar solo las del mes seleccionado
      const filtered = reservations?.filter(r => r.month === month) || [];
      setDetailModal({
        show: true,
        teacherId,
        teacherName,
        month,
        reservations: filtered
      });
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      alert('Error al cargar reservas del profesor');
    }
  };

  const handleViewSchedules = async (teacherId: string, teacherName: string, month: string) => {
    try {
      const schedules = await getClassSchedules(teacherId, month);
      setScheduleModal({
        show: true,
        teacherId,
        teacherName,
        month,
        schedules: schedules || []
      });
      setNewSchedule({ day: '', time: '', class_name: '', max_students: '15', duration: '60' });
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      alert('Error al cargar horarios del profesor');
    }
  };

  const handleAddSchedule = async () => {
    if (!newSchedule.day || !newSchedule.time || !newSchedule.class_name) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      await createClassSchedule({
        teacher_id: scheduleModal.teacherId,
        month: scheduleModal.month,
        day: parseInt(newSchedule.day),
        time: newSchedule.time,
        class_name: newSchedule.class_name,
        max_students: parseInt(newSchedule.max_students),
        duration: parseInt(newSchedule.duration)
      });
      alert('Horario agregado correctamente');
      // Recargar horarios
      await handleViewSchedules(scheduleModal.teacherId, scheduleModal.teacherName, scheduleModal.month);
    } catch (error: any) {
      console.error('Error al agregar horario:', error);
      alert('Error al agregar horario: ' + error.message);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('¿Estas seguro de eliminar este horario?')) return;

    try {
      await deleteClassSchedule(id);
      alert('Horario eliminado correctamente');
      // Recargar horarios
      await handleViewSchedules(scheduleModal.teacherId, scheduleModal.teacherName, scheduleModal.month);
    } catch (error: any) {
      console.error('Error al eliminar horario:', error);
      alert('Error al eliminar horario');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-[#111] border border-white/20 rounded-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-black text-white mb-6 text-center uppercase">
            Panel Admin
          </h1>
          
          {loginError && (
            <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3 animate-fade-in">
              <p className="text-red-400 text-sm font-bold text-center">
                ⚠️ {loginError}
              </p>
            </div>
          )}
          
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLoginError(''); // Limpiar error al escribir
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Contraseña"
            className={`w-full bg-white text-black rounded-lg py-3 px-4 mb-4 outline-none transition-all ${
              loginError ? 'ring-2 ring-red-500' : ''
            }`}
            autoFocus
          />
          <button
            onClick={handleLogin}
            className="w-full bg-naik-gold hover:bg-yellow-400 text-black font-bold py-3 rounded-xl uppercase transition-all hover:scale-105"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'pendientes', label: 'Pendientes', icon: Clock },
    { id: 'confirmadas', label: 'Confirmadas', icon: CheckCircle },
    { id: 'cupos', label: 'Gestion Cupos', icon: Calendar },
  ] as const;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-black uppercase">
            Panel de <span className="text-naik-gold">Admin</span>
          </h1>
          <button
            onClick={loadData}
            disabled={loading}
            className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold uppercase transition-all disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold uppercase transition-all ${
                  activeTab === tab.id
                    ? 'bg-naik-gold text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards - Grandes y Visuales */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Reservas Pendientes */}
                <div className="bg-gradient-to-br from-yellow-600/30 to-yellow-800/30 border-2 border-yellow-500/50 rounded-2xl p-6 md:p-8 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <Clock size={32} className="text-yellow-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">Pendientes</span>
                  </div>
                  <div className="text-5xl md:text-6xl font-black text-white mb-2">{stats.reservas.pendientes}</div>
                  <div className="text-sm text-gray-400">Reservas por confirmar</div>
                </div>

                {/* Confirmadas Hoy */}
                <div className="bg-gradient-to-br from-green-600/30 to-green-800/30 border-2 border-green-500/50 rounded-2xl p-6 md:p-8 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle size={32} className="text-green-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-green-400">Confirmadas</span>
                  </div>
                  <div className="text-5xl md:text-6xl font-black text-white mb-2">{stats.reservas.confirmadas}</div>
                  <div className="text-sm text-gray-400">Total confirmadas</div>
                </div>

                {/* Ocupación */}
                <div className="bg-gradient-to-br from-naik-gold/30 to-yellow-600/30 border-2 border-naik-gold/50 rounded-2xl p-6 md:p-8 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp size={32} className="text-naik-gold" />
                    <span className="text-xs font-bold uppercase tracking-wider text-naik-gold">Ocupación</span>
                  </div>
                  <div className="text-5xl md:text-6xl font-black text-white mb-2">{stats.cupos.ocupacion}%</div>
                  <div className="w-full bg-white/10 rounded-full h-3 mt-3">
                    <div 
                      className="bg-naik-gold rounded-full h-3 transition-all duration-500"
                      style={{width: `${stats.cupos.ocupacion}%`}}
                    />
                  </div>
                </div>

                {/* Total Reservas */}
                <div className="bg-gradient-to-br from-blue-600/30 to-blue-800/30 border-2 border-blue-500/50 rounded-2xl p-6 md:p-8 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between mb-4">
                    <Users size={32} className="text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Total</span>
                  </div>
                  <div className="text-5xl md:text-6xl font-black text-white mb-2">{stats.reservas.total}</div>
                  <div className="text-sm text-gray-400">Reservas registradas</div>
                </div>
              </div>
            )}

            {/* Acciones Rápidas */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-black uppercase mb-6 flex items-center gap-3">
                <span className="text-naik-gold">⚡</span> Acciones Rápidas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={handleConfirmAllPending}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl uppercase transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <CheckCircle size={24} />
                  <span>Confirmar Pendientes</span>
                </button>

                <button
                  onClick={handleQuickAvailability}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl uppercase transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <Calendar size={24} />
                  <span>Agregar Disponibilidad</span>
                </button>

                <button
                  onClick={() => setActiveTab('cupos')}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl uppercase transition-all hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Edit2 size={24} />
                  <span>Gestionar Cupos</span>
                </button>
              </div>
              
              {/* Zona de Admin Avanzado */}
              <div className="mt-6 pt-6 border-t border-red-500/20">
                <details className="group">
                  <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400 uppercase font-bold tracking-wide flex items-center gap-2">
                    <span>⚠️ Zona de Admin Avanzado</span>
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-4">
                    <button
                      onClick={handleResetAllCupos}
                      disabled={loading}
                      className="w-full bg-red-600/20 border-2 border-red-500 hover:bg-red-600 text-red-400 hover:text-white font-bold py-3 px-6 rounded-xl uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={20} />
                      <span>Resetear Todos los Cupos</span>
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Elimina TODA la disponibilidad. Úsalo solo para empezar de cero.
                    </p>
                  </div>
                </details>
              </div>
            </div>

            {/* Últimas Reservas Pendientes */}
            {reservations.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl md:text-3xl font-black uppercase flex items-center gap-3">
                    <Clock className="text-yellow-400" size={28} />
                    Últimas Pendientes
                  </h3>
                  <button
                    onClick={() => setActiveTab('pendientes')}
                    className="text-sm text-naik-gold hover:text-yellow-400 font-bold uppercase transition-colors"
                  >
                    Ver todas →
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
                            onClick={() => handleConfirm(reservation.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg text-sm uppercase transition-all"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleCancel(reservation.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg text-sm uppercase transition-all"
                          >
                            ✗
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {reservations.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    🎉 No hay reservas pendientes
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB: CUPOS */}
        {activeTab === 'cupos' && (
          <div>
            {/* Selector de mes */}
            <div className="mb-6">
              <label className="block text-sm font-bold uppercase mb-3">Mes</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: '2026-02', label: 'Febrero 2026' },
                  { value: '2026-03', label: 'Marzo 2026' },
                  { value: '2026-04', label: 'Abril 2026' },
                  { value: '2026-05', label: 'Mayo 2026' },
                ].map(month => (
                  <button
                    key={month.value}
                    onClick={() => setSelectedMonth(month.value)}
                    className={`px-5 py-2 rounded-lg font-bold uppercase transition-all ${
                      selectedMonth === month.value
                        ? 'bg-naik-gold text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {month.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de disponibilidad */}
            <div className="space-y-4">
              {loading && (
                <div className="text-center py-12 text-gray-400">
                  Cargando disponibilidad...
                </div>
              )}

              {!loading && availability.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No hay disponibilidad para este mes
                </div>
              )}

              {!loading && availability.map((item) => {
                const isEditing = editingCupo?.teacherId === item.teacher_id && editingCupo?.month === item.month;
                const disponibles = item.cupos_total - item.cupos_reservados;
                const ocupacion = item.cupos_total > 0 
                  ? ((item.cupos_reservados / item.cupos_total) * 100).toFixed(0)
                  : 0;
                
                // Buscar info del profesor en el array local
                const teacherInfo = teachers.find(t => t.id === item.teacher_id);

                return (
                  <div
                    key={`${item.teacher_id}-${item.month}`}
                    className="bg-[#111] border border-white/20 rounded-xl p-6 hover:border-naik-gold/50 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Info del profesor */}
                      <div className="flex items-center gap-4 flex-1">
                        {teacherInfo?.image && (
                          <img 
                            src={teacherInfo.image} 
                            alt={teacherInfo.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-black">{teacherInfo?.name || item.teacher_id}</h3>
                          <p className="text-sm text-gray-400">
                            {teacherInfo?.classes?.join(', ') || 'N/A'}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="text-xs text-gray-500 font-bold uppercase">Días:</span>
                            {item.days && item.days.length > 0 ? (
                              item.days.slice(0, 6).map((day: number) => (
                                <span 
                                  key={day}
                                  className="inline-flex items-center justify-center w-7 h-7 bg-naik-gold/20 text-naik-gold border border-naik-gold/30 rounded text-xs font-bold"
                                >
                                  {day}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">No especificado</span>
                            )}
                            {item.days && item.days.length > 6 && (
                              <span className="text-xs text-gray-500">+{item.days.length - 6} más</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Cupos y Acciones */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {!isEditing && (
                          <>
                            <div className="text-center">
                              <p className="text-xs text-gray-400 uppercase mb-1">Reservados</p>
                              <p className="text-2xl font-black text-orange-400">{item.cupos_reservados}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400 uppercase mb-1">Disponibles</p>
                              <p className="text-2xl font-black text-green-400">{disponibles}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400 uppercase mb-1">Totales</p>
                              <p className="text-2xl font-black">{item.cupos_total}</p>
                            </div>
                            <div className="text-center min-w-[80px]">
                              <p className="text-xs text-gray-400 uppercase mb-1">Ocupacion</p>
                              <p className="text-xl font-black text-naik-gold">{ocupacion}%</p>
                            </div>
                            <button
                              onClick={() => handleViewDetails(item.teacher_id, teacherInfo?.name || item.teacher_id, item.month)}
                              className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-all"
                              title="Ver reservas"
                            >
                              <Eye size={20} />
                            </button>
                            <button
                              onClick={() => handleViewSchedules(item.teacher_id, teacherInfo?.name || item.teacher_id, item.month)}
                              className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg transition-all"
                              title="Gestionar horarios"
                            >
                              <CalendarClock size={20} />
                            </button>
                            <button
                              onClick={() => handleEditCupo(item.teacher_id, item.month, item.cupos_total, item.cupos_reservados, item.days)}
                              className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all"
                              title="Editar cupos"
                            >
                              <Edit2 size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Panel de edición expandido */}
                    {isEditing && (
                      <div className="mt-6 border-t border-white/20 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Edición de Cupos */}
                          <div>
                            <h4 className="text-sm font-bold uppercase mb-3 text-naik-gold">Cupos</h4>
                            <div className="flex gap-3">
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Totales</label>
                                <input
                                  type="number"
                                  value={editForm.cupos_total}
                                  onChange={(e) => setEditForm({...editForm, cupos_total: parseInt(e.target.value) || 0})}
                                  className="w-24 bg-white/10 border border-white/20 rounded px-3 py-2 text-center"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">Reservados</label>
                                <input
                                  type="number"
                                  value={editForm.cupos_reservados}
                                  onChange={(e) => setEditForm({...editForm, cupos_reservados: parseInt(e.target.value) || 0})}
                                  className="w-24 bg-white/10 border border-white/20 rounded px-3 py-2 text-center"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Edición de Días */}
                          <div>
                            <h4 className="text-sm font-bold uppercase mb-3 text-naik-gold">Días Disponibles del Mes</h4>
                            <div className="flex gap-2 mb-4">
                              <input
                                type="number"
                                min="1"
                                max="31"
                                value={newDay}
                                onChange={(e) => setNewDay(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddDay()}
                                placeholder="Día (1-31)"
                                className="w-24 bg-white/10 border border-white/20 rounded px-3 py-2"
                              />
                              <button
                                onClick={handleAddDay}
                                className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg transition-all flex items-center gap-1"
                              >
                                <Plus size={16} />
                                Agregar
                              </button>
                            </div>
                            
                            {/* Mini Calendario Visual */}
                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                              <div className="grid grid-cols-7 gap-1">
                                {Array.from({length: 31}, (_, i) => i + 1).map(day => {
                                  const isSelected = editForm.days.includes(day);
                                  const isPast = editingCupo && isDayPast(day, editingCupo.month);
                                  return (
                                    <button
                                      key={day}
                                      disabled={isPast}
                                      onClick={() => {
                                        if (isPast) return;
                                        if (isSelected) {
                                          handleRemoveDay(day);
                                        } else {
                                          setEditForm({...editForm, days: [...editForm.days, day].sort((a,b) => a-b)});
                                        }
                                      }}
                                      className={`
                                        aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all
                                        ${isPast
                                          ? 'bg-white/5 text-gray-600 cursor-not-allowed line-through'
                                          : isSelected 
                                            ? 'bg-naik-gold text-black hover:bg-yellow-400' 
                                            : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                        }
                                      `}
                                      title={isPast ? 'Día ya pasado' : isSelected ? 'Click para quitar' : 'Click para agregar'}
                                    >
                                      {day}
                                    </button>
                                  );
                                })}
                              </div>
                              <p className="text-xs text-gray-400 mt-3 text-center">
                                Click en un día para agregar/quitar • {editForm.days.length} días seleccionados
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={handleSaveCupo}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl uppercase transition-all flex items-center justify-center gap-2"
                          >
                            <Save size={20} />
                            Guardar Cambios
                          </button>
                          <button
                            onClick={() => setEditingCupo(null)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl uppercase transition-all flex items-center justify-center gap-2"
                          >
                            <X size={20} />
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: RESERVAS (Pendientes y Confirmadas) */}
        {(activeTab === 'pendientes' || activeTab === 'confirmadas') && (
          <div className="space-y-4">
            {loading && (
              <div className="text-center py-12 text-gray-400">
                Cargando reservas...
              </div>
            )}

            {!loading && reservations.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No hay reservas {activeTab === 'pendientes' ? 'pendientes' : 'confirmadas'}
              </div>
            )}

            {!loading && reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-[#111] border border-white/20 rounded-xl p-6 hover:border-naik-gold/50 transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">Nombre</p>
                    <p className="font-bold">{reservation.nombre}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">Email</p>
                    <p className="text-sm break-all">{reservation.email}</p>
                  </div>
                  {reservation.telefono && (
                    <div>
                      <p className="text-xs text-gray-400 uppercase mb-1">Telefono</p>
                      <p>{reservation.telefono}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">Profesor</p>
                    <p className="font-bold">{reservation.teacher_id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">Clase</p>
                    <p className="text-sm">{reservation.clase}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">Fecha</p>
                    <p>{reservation.fecha}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase mb-1">Estado</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      reservation.status === 'pendiente' 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : reservation.status === 'confirmada'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {reservation.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {activeTab === 'pendientes' && reservation.status === 'pendiente' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleConfirm(reservation.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl uppercase transition-all"
                    >
                      ✓ Confirmar
                    </button>
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl uppercase transition-all"
                    >
                      ✗ Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalles de Reservas por Profesor */}
      {detailModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#111] border border-white/20 rounded-xl max-w-4xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-black text-white uppercase">
                  Reservas de {detailModal.teacherName}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Mes: {detailModal.month}
                </p>
              </div>
              <button
                onClick={() => setDetailModal({show: false, teacherId: '', teacherName: '', month: '', reservations: []})}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {detailModal.reservations.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No hay reservas para este profesor en este mes
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {detailModal.reservations
                  .sort((a, b) => {
                    // Ordenar por fecha
                    const dateA = a.fecha.split('/').reverse().join('-');
                    const dateB = b.fecha.split('/').reverse().join('-');
                    return dateA.localeCompare(dateB);
                  })
                  .map((reservation) => (
                    <div
                      key={reservation.id}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-naik-gold/50 transition-all"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-gray-400 uppercase mb-1">Fecha</p>
                          <p className="font-bold text-naik-gold">{reservation.fecha}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase mb-1">Alumno</p>
                          <p className="font-bold">{reservation.nombre}</p>
                          <p className="text-xs text-gray-500">{reservation.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase mb-1">Estado</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            reservation.status === 'pendiente' 
                              ? 'bg-yellow-500/20 text-yellow-400' 
                              : reservation.status === 'confirmada'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {reservation.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-gray-400">Clase: <span className="text-white">{reservation.clase}</span></p>
                        {reservation.telefono && (
                          <p className="text-xs text-gray-400 mt-1">Tel: <span className="text-white">{reservation.telefono}</span></p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-1">Total</p>
                  <p className="text-2xl font-black">{detailModal.reservations.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-1">Confirmadas</p>
                  <p className="text-2xl font-black text-green-400">
                    {detailModal.reservations.filter(r => r.status === 'confirmada').length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase mb-1">Pendientes</p>
                  <p className="text-2xl font-black text-yellow-400">
                    {detailModal.reservations.filter(r => r.status === 'pendiente').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Gestion de Horarios */}
      {scheduleModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#111] border border-white/20 rounded-xl max-w-5xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-black text-white uppercase">
                  Horarios de {scheduleModal.teacherName}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Mes: {scheduleModal.month}
                </p>
              </div>
              <button
                onClick={() => setScheduleModal({show: false, teacherId: '', teacherName: '', month: '', schedules: []})}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Formulario para agregar nuevo horario */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-bold uppercase mb-4 text-naik-gold flex items-center gap-2">
                <Plus size={20} />
                Agregar Nuevo Horario
              </h4>
              
              {/* Calendario para seleccionar día */}
              <div className="mb-6">
                <label className="block text-sm font-bold uppercase mb-3 text-white">Seleccionar Día *</label>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({length: 31}, (_, i) => i + 1).map(day => {
                      const isSelected = newSchedule.day === String(day);
                      const isPast = isDayPast(day, scheduleModal.month);
                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={isPast}
                          onClick={() => !isPast && setNewSchedule({...newSchedule, day: String(day)})}
                          className={`
                            aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all
                            ${isPast
                              ? 'bg-white/5 text-gray-600 cursor-not-allowed line-through'
                              : isSelected 
                                ? 'bg-naik-gold text-black' 
                                : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }
                          `}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  {newSchedule.day && (
                    <p className="text-xs text-naik-gold mt-3 text-center font-bold">
                      Día {newSchedule.day} seleccionado
                    </p>
                  )}
                </div>
              </div>

              {/* Otros campos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-400 uppercase mb-2">Hora *</label>
                  <input
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase mb-2">Clase *</label>
                  <input
                    type="text"
                    value={newSchedule.class_name}
                    onChange={(e) => setNewSchedule({...newSchedule, class_name: e.target.value})}
                    placeholder="Ej: Hip Hop Intermedio"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase mb-2">Duración (min)</label>
                  <input
                    type="number"
                    value={newSchedule.duration}
                    onChange={(e) => setNewSchedule({...newSchedule, duration: e.target.value})}
                    placeholder="60"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 uppercase mb-2">Max Alumnos</label>
                  <input
                    type="number"
                    value={newSchedule.max_students}
                    onChange={(e) => setNewSchedule({...newSchedule, max_students: e.target.value})}
                    placeholder="15"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>
              
              <button
                onClick={handleAddSchedule}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl uppercase transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Agregar Horario
              </button>
            </div>

            {/* Lista de horarios existentes */}
            <div>
              <h4 className="text-lg font-bold uppercase mb-4">Horarios Existentes</h4>
              {scheduleModal.schedules.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No hay horarios configurados para este mes
                </div>
              ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                  {scheduleModal.schedules
                    .sort((a, b) => {
                      if (a.day !== b.day) return a.day - b.day;
                      return a.time.localeCompare(b.time);
                    })
                    .map((schedule) => {
                      // Convertir mes "2026-02" a nombre
                      const [year, month] = scheduleModal.month.split('-');
                      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                                         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                      const monthName = monthNames[parseInt(month) - 1];
                      
                      return (
                        <div
                          key={schedule.id}
                          className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-naik-gold/50 transition-all"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              {/* Badge del día con contexto */}
                              <div className="text-center">
                                <div className="bg-naik-gold text-black font-black rounded-xl px-4 py-3 mb-1">
                                  <div className="text-3xl leading-none">{schedule.day}</div>
                                </div>
                                <div className="text-xs text-gray-400 font-bold uppercase">{monthName}</div>
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-xl font-bold text-white">{schedule.time}</span>
                                  <span className="text-gray-500">•</span>
                                  <span className="text-sm text-gray-400">{schedule.duration} min</span>
                                </div>
                                <p className="text-lg font-black text-naik-gold mb-1">{schedule.class_name}</p>
                                <div className="flex items-center gap-2">
                                  <Users size={14} className="text-gray-500" />
                                  <p className="text-sm text-gray-400">
                                    Máximo: <span className="text-white font-bold">{schedule.max_students}</span> alumnos
                                  </p>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="bg-red-600 hover:bg-red-700 p-3 rounded-lg transition-all"
                              title="Eliminar horario"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmacion */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111] border border-white/20 rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-white uppercase">
                {confirmModal.action === 'confirm' ? 'Confirmar Reserva' : 'Cancelar Reserva'}
              </h3>
              <button
                onClick={() => setConfirmModal({ show: false, id: '', action: 'confirm' })}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-gray-300 mb-6">
              {confirmModal.action === 'confirm' 
                ? 'Estas seguro de confirmar esta reserva? El cupo se actualizara automaticamente.'
                : 'Estas seguro de cancelar esta reserva? Si ya estaba confirmada, se liberara el cupo.'}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal({ show: false, id: '', action: 'confirm' })}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl uppercase transition-all"
              >
                No, volver
              </button>
              <button
                onClick={executeAction}
                className={`flex-1 font-bold py-3 rounded-xl uppercase transition-all ${
                  confirmModal.action === 'confirm'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                Si, {confirmModal.action === 'confirm' ? 'confirmar' : 'cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar Disponibilidad */}
      {addAvailabilityModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#111] border border-white/20 rounded-xl max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-white uppercase">
                Agregar Disponibilidad
              </h3>
              <button
                onClick={() => setAddAvailabilityModal({ show: false, teacherId: '', cupos: 15, days: [] })}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Selección de profesor */}
              <div>
                <label className="block text-sm font-bold uppercase mb-2 text-naik-gold">Profesor</label>
                <select
                  value={addAvailabilityModal.teacherId}
                  onChange={(e) => setAddAvailabilityModal({...addAvailabilityModal, teacherId: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-4 py-3 text-white outline-none"
                  style={{
                    colorScheme: 'dark'
                  }}
                >
                  <option value="" style={{backgroundColor: '#1a1a1a', color: '#999'}}>Seleccionar profesor...</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id} style={{backgroundColor: '#1a1a1a', color: 'white'}}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Mes */}
              <div>
                <label className="block text-sm font-bold uppercase mb-2 text-gray-400">Mes</label>
                <p className="text-white font-bold text-lg">{selectedMonth}</p>
              </div>

              {/* Cupos por día */}
              <div>
                <label className="block text-sm font-bold uppercase mb-2 text-naik-gold">Cupos por día</label>
                <input
                  type="number"
                  min="1"
                  value={addAvailabilityModal.cupos}
                  onChange={(e) => setAddAvailabilityModal({...addAvailabilityModal, cupos: parseInt(e.target.value) || 1})}
                  className="w-32 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none"
                />
              </div>

              {/* Calendario para días */}
              <div>
                <label className="block text-sm font-bold uppercase mb-3 text-naik-gold">Días Disponibles</label>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({length: 31}, (_, i) => i + 1).map(day => {
                      const isSelected = addAvailabilityModal.days.includes(day);
                      const isPast = isDayPast(day, selectedMonth);
                      return (
                        <button
                          key={day}
                          disabled={isPast}
                          onClick={() => {
                            if (isPast) return;
                            if (isSelected) {
                              setAddAvailabilityModal({
                                ...addAvailabilityModal,
                                days: addAvailabilityModal.days.filter(d => d !== day)
                              });
                            } else {
                              setAddAvailabilityModal({
                                ...addAvailabilityModal,
                                days: [...addAvailabilityModal.days, day].sort((a,b) => a-b)
                              });
                            }
                          }}
                          className={`
                            aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all
                            ${isPast 
                              ? 'bg-white/5 text-gray-600 cursor-not-allowed line-through' 
                              : isSelected 
                                ? 'bg-naik-gold text-black hover:bg-yellow-400' 
                                : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }
                          `}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    {addAvailabilityModal.days.length} días seleccionados
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setAddAvailabilityModal({ show: false, teacherId: '', cupos: 15, days: [] })}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl uppercase transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAvailability}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl uppercase transition-all"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
