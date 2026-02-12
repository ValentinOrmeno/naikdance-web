"use client";
import { AdminDashboardSection } from "./AdminDashboardSection";
import { useState, useEffect } from "react";
import { confirmReservation, cancelReservation, getAvailability } from "@/lib/supabase-admin";
import {
  getAllReservations,
  getAllAvailability,
  getStats,
  updateAvailability,
  getReservationsByTeacher,
  getClassSchedules,
  createClassSchedule,
  updateClassSchedule,
  deleteClassSchedule,
  resetAllAvailability,
  fixNegativeCupos,
} from "@/lib/supabase-admin-extended";
import type { Reservation, Availability, ClassSchedule } from "@/lib/supabase";
import type { AdminStats } from "@/lib/supabase-admin-extended";
import {
  X,
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Edit2,
  Save,
  Eye,
  Plus,
  Trash2,
  CalendarClock,
} from "lucide-react";
import { teachers } from "@/data/teachers";

type Tab = "dashboard" | "reservas" | "clases";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [reservasFilter, setReservasFilter] = useState<"todas" | "pendiente" | "confirmada">("pendiente");
  
  // Generar mes actual por defecto
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };
  
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
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
    schedules: ClassSchedule[];
    availableDays: number[];
  }>({
    show: false,
    teacherId: '',
    teacherName: '',
    month: '',
    schedules: [],
    availableDays: []
  });
  const [newSchedule, setNewSchedule] = useState({
    day: '',
    time: '',
    class_name: '',
    max_students: '15',
    duration: '60'
  });
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  const [newScheduleDays, setNewScheduleDays] = useState<number[]>([]);
  const [addAvailabilityModal, setAddAvailabilityModal] = useState({
    show: false,
    teacherId: '',
    cupos: 15,
    days: [] as number[]
  });
  const [quickClassModal, setQuickClassModal] = useState({
    show: false,
    teacherId: '',
    month: getCurrentMonth(),
    day: '',
    className: '',
    time: '',
    duration: '60',
    cupos: 15,
  });
  const [quickClassDays, setQuickClassDays] = useState<number[]>([]);
  const [scheduleDaysByKey, setScheduleDaysByKey] = useState<Record<string, { count: number; days: number[] }>>(
    {}
  );

  // Helper: generar proximos 6 meses desde hoy
  const getNextMonths = () => {
    const months = [];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const now = new Date();
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const value = `${year}-${String(month).padStart(2, '0')}`;
      const label = `${monthNames[month - 1]} ${year}`;
      
      months.push({ value, label });
    }
    
    return months;
  };

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
      // Corregir cupos negativos después de operaciones masivas
      await fixNegativeCupos();
      alert(`${pendingReservations.length} reservas confirmadas correctamente`);
      await loadData();
      await loadStats(); // Actualizar estadísticas
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

  const handleOpenQuickClass = () => {
    setQuickClassModal({
      show: true,
      teacherId: '',
      month: selectedMonth,
      day: '',
      className: '',
      time: '',
      duration: '60',
      cupos: 15,
    });
    setQuickClassDays([]);
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
      if (activeTab === "clases") await loadAvailability();
    } catch (error: any) {
      console.error('Error al agregar disponibilidad:', error);
      alert('Error al agregar disponibilidad');
    }
  };

  const handleCreateQuickClass = async () => {
    const { teacherId, month, day, className, time, duration, cupos } = quickClassModal;

    if (!teacherId || !month || !className || !time) {
      alert('Completa profesor, hora y nombre de la clase');
      return;
    }

    // Determinar días a usar (multi-selección o campo único)
    const singleDay = day ? parseInt(day, 10) : NaN;
    const daysToUse =
      quickClassDays.length > 0
        ? quickClassDays
        : !isNaN(singleDay)
        ? [singleDay]
        : [];

    if (daysToUse.length === 0) {
      alert('Selecciona al menos un día en el calendario');
      return;
    }

    const invalidDay = daysToUse.find((d) => d < 1 || d > 31 || isDayPast(d, month));
    if (invalidDay) {
      alert('No se pueden crear clases en días pasados o inválidos');
      return;
    }

    try {
      setLoading(true);

      const baseCupos = cupos;

      // Evitar duplicados: filtrar días que ya tienen un horario para ese profesor/mes/hora
      const existingSchedules = await getClassSchedules(teacherId, month);
      const existingSlots = new Set(
        (existingSchedules || []).map((s: any) => `${s.day}-${s.time}`)
      );

      const daysToInsert = daysToUse.filter(
        (d) => !existingSlots.has(`${d}-${time}`)
      );

      if (daysToInsert.length === 0) {
        alert('Ya existe una clase en esos días a esa hora.');
        return;
      }

      const existing = await getAvailability(teacherId, month);
      const existingDays: number[] = existing?.days || [];
      const mergedDays = Array.from(new Set([...existingDays, ...daysToInsert])).sort(
        (a, b) => a - b
      );

      await updateAvailability(teacherId, month, {
        cupos_total: existing?.cupos_total ?? baseCupos,
        cupos_reservados: existing?.cupos_reservados ?? 0,
        days: mergedDays,
      });

      // Crear un horario por cada día
      await Promise.all(
        daysToInsert.map((d) =>
          createClassSchedule({
            teacher_id: teacherId,
            month,
            day: d,
            time,
            class_name: className,
            duration: parseInt(duration, 10) || 60,
            max_students: cupos,
          })
        )
      );

      alert('Clases creadas correctamente (cupos + horarios)');

      setQuickClassModal({
        show: false,
        teacherId: '',
        month: selectedMonth,
        day: '',
        className: '',
        time: '',
        duration: '60',
        cupos: 15,
      });
      setQuickClassDays([]);

      await loadStats();
      if (activeTab === 'cupos') {
        await loadAvailability();
      }
    } catch (error: any) {
      console.error('Error al crear clase rápida:', error);
      alert(error.message || 'Error al crear la clase');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAllCupos = async () => {
    if (!confirm('ATENCION: Esto eliminara TODA la disponibilidad (dias y cupos) de todos los profesores. Estas seguro?')) {
      return;
    }
    
    if (!confirm('¿Realmente querés borrar todo y empezar de cero?')) {
      return;
    }

    try {
      setLoading(true);
      await resetAllAvailability();
      alert('Todos los cupos fueron eliminados correctamente');
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

    if (!ADMIN_PASSWORD) {
      console.error('NEXT_PUBLIC_ADMIN_PASSWORD no está configurada');
      setLoginError('Error de configuración del panel. Hablá con el desarrollador.');
      return;
    }
    
    if (pwd === ADMIN_PASSWORD) {
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

      if (data && data.length > 0) {
        const entries: Record<string, { count: number; days: number[] }> = {};

        await Promise.all(
          data.map(async (item) => {
            const schedules = await getClassSchedules(item.teacher_id, item.month);
            const daysSet = new Set<number>();

            (schedules || []).forEach((s: ClassSchedule) => {
              if (typeof s.day === "number") {
                daysSet.add(s.day);
              }
            });

            const key = `${item.teacher_id}-${item.month}`;
            entries[key] = {
              count: schedules?.length || 0,
              days: Array.from(daysSet).sort((a, b) => a - b),
            };
          })
        );

        setScheduleDaysByKey(entries);
      } else {
        setScheduleDaysByKey({});
      }
    } catch (error) {
      console.error('Error al cargar disponibilidad:', error);
      alert('Error al cargar disponibilidad');
      setScheduleDaysByKey({});
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
    } else if (activeTab === 'reservas') {
      const status = reservasFilter === 'todas' ? undefined : reservasFilter;
      loadReservations(status);
    } else if (activeTab === 'clases') {
      loadAvailability();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [activeTab, selectedMonth, reservasFilter, isAuthenticated]);

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
        // Después de cancelar, corregir automáticamente cupos negativos si los hay
        await fixNegativeCupos();
        alert('Reserva cancelada.');
      }
      setConfirmModal({ show: false, id: '', action: 'confirm' });
      
      // Recargar datos del tab actual
      await loadData();
      
      // IMPORTANTE: Siempre recargar estadísticas después de confirmar/cancelar
      // para mantener el dashboard actualizado
      await loadStats();
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
      // Cargar disponibilidad del profesor para saber qué días tienen cupos
      const allAvailability = await getAllAvailability(month);
      const teacherAvailability = allAvailability?.find(
        (a: any) => a.teacher_id === teacherId && a.month === month
      );
      
      setScheduleModal({
        show: true,
        teacherId,
        teacherName,
        month,
        schedules: schedules || [],
        availableDays: teacherAvailability?.days || []
      });
      setNewSchedule({ day: '', time: '', class_name: '', max_students: '15', duration: '60' });
    } catch (error) {
      console.error('Error al cargar horarios:', error);
      alert('Error al cargar horarios del profesor');
    }
  };

  const handleAddSchedule = async () => {
    const hasDays = newScheduleDays.length > 0 || newSchedule.day;
    if (!hasDays || !newSchedule.time || !newSchedule.class_name) {
      alert('Por favor selecciona al menos un día y completa hora y clase');
      return;
    }

    try {
      const baseCupos = parseInt(newSchedule.max_students) || 15;

      // Determinar días a usar
      const singleDay = newSchedule.day ? parseInt(newSchedule.day) : NaN;
      const candidateDays =
        newScheduleDays.length > 0
          ? newScheduleDays
          : !isNaN(singleDay)
          ? [singleDay]
          : [];

      if (candidateDays.length === 0) {
        alert('No hay días válidos seleccionados');
        return;
      }

      // Evitar duplicados: filtrar días que ya tienen un horario a esa hora
      const existingSchedules = await getClassSchedules(
        scheduleModal.teacherId,
        scheduleModal.month
      );
      const existingSlots = new Set(
        (existingSchedules || []).map((s: any) => `${s.day}-${s.time}`)
      );

      const daysToUse = candidateDays.filter(
        (d) => !existingSlots.has(`${d}-${newSchedule.time}`)
      );

      if (daysToUse.length === 0) {
        alert('Ya existe un horario para ese/estos días a esa hora.');
        return;
      }

      // Asegurar que exista disponibilidad y que todos los días estén incluidos
      const existing = await getAvailability(scheduleModal.teacherId, scheduleModal.month);
      const existingDays: number[] = existing?.days || [];
      const mergedDays = Array.from(new Set([...existingDays, ...daysToUse])).sort(
        (a, b) => a - b
      );

      await updateAvailability(scheduleModal.teacherId, scheduleModal.month, {
        cupos_total: existing?.cupos_total ?? baseCupos,
        cupos_reservados: existing?.cupos_reservados ?? 0,
        days: mergedDays,
      });

      // Crear un horario por cada día seleccionado
      await Promise.all(
        daysToUse.map((day) =>
          createClassSchedule({
            teacher_id: scheduleModal.teacherId,
            month: scheduleModal.month,
            day,
            time: newSchedule.time,
            class_name: newSchedule.class_name,
            max_students: parseInt(newSchedule.max_students),
            duration: parseInt(newSchedule.duration),
          })
        )
      );
      alert('Horarios agregados correctamente');
      // Recargar horarios
      await handleViewSchedules(scheduleModal.teacherId, scheduleModal.teacherName, scheduleModal.month);
      setNewSchedule({ day: '', time: '', class_name: '', max_students: '15', duration: '60' });
      setNewScheduleDays([]);
    } catch (error: any) {
      console.error('Error al agregar horario:', error);
      alert('Error al agregar horario: ' + error.message);
    }
  };

  const handleEditScheduleClick = (schedule: ClassSchedule) => {
    setEditingSchedule(String(schedule.id));
    setNewSchedule({
      day: String(schedule.day),
      time: schedule.time || '',
      class_name: schedule.class_name || '',
      max_students: schedule.max_students ? String(schedule.max_students) : '15',
      duration: schedule.duration ? String(schedule.duration) : '60',
    });
    setNewScheduleDays([schedule.day]);
  };

  const handleUpdateSchedule = async () => {
    if (!editingSchedule) return;

    if (!newSchedule.day || !newSchedule.time || !newSchedule.class_name) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      await updateClassSchedule(editingSchedule, {
        day: parseInt(newSchedule.day),
        time: newSchedule.time,
        class_name: newSchedule.class_name,
        duration: parseInt(newSchedule.duration) || undefined,
        max_students: parseInt(newSchedule.max_students) || undefined,
      });

      alert('Horario actualizado correctamente');
      setEditingSchedule(null);
      setNewSchedule({ day: '', time: '', class_name: '', max_students: '15', duration: '60' });
      setNewScheduleDays([]);
      await handleViewSchedules(scheduleModal.teacherId, scheduleModal.teacherName, scheduleModal.month);
    } catch (error: any) {
      console.error('Error al actualizar horario:', error);
      alert('Error al actualizar horario: ' + error.message);
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
                {loginError}
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
    { id: 'reservas', label: 'Reservas', icon: Clock },
    { id: 'clases', label: 'Clases y Horarios', icon: CalendarClock },
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
        {activeTab === "dashboard" && (
          <AdminDashboardSection
            stats={stats}
            reservations={reservations}
            loading={loading}
            onConfirmAllPending={handleConfirmAllPending}
            onQuickAvailability={handleQuickAvailability}
            onQuickCreateClass={handleOpenQuickClass}
            onGoToClases={() => setActiveTab("clases")}
            onConfirmReservation={handleConfirm}
            onCancelReservation={handleCancel}
            onGoToPendientes={() => setActiveTab("reservas")}
            onResetAllCupos={handleResetAllCupos}
          />
        )}

        {/* TAB: CLASES Y HORARIOS */}
        {activeTab === 'clases' && (
          <div>
            {/* Selector de mes */}
            <div className="mb-6">
              <label className="block text-sm font-bold uppercase mb-3">Mes</label>
              <div className="flex flex-wrap gap-2">
                {getNextMonths().map((month) => (
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

            {/* Lista de profesores y horarios */}
            <div className="space-y-4">
              {loading && (
                <div className="text-center py-12 text-gray-400">
                  Cargando clases y horarios...
                </div>
              )}

              {!loading && availability.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No hay disponibilidad ni horarios configurados para este mes
                </div>
              )}

              {!loading &&
                availability.map((item) => {
                  const teacherInfo = teachers.find((t) => t.id === item.teacher_id);
                  const key = `${item.teacher_id}-${item.month}`;
                  const scheduleInfo = scheduleDaysByKey[key];
                  const horariosCount = scheduleInfo?.count ?? 0;
                  const daysWithSchedule = scheduleInfo?.days ?? [];

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
                            <h3 className="text-xl font-black">
                              {teacherInfo?.name || item.teacher_id}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {teacherInfo?.classes?.join(', ') || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {horariosCount > 0
                                ? `${horariosCount} ${
                                    horariosCount === 1
                                      ? 'horario configurado'
                                      : 'horarios configurados'
                                  } en este mes`
                                : 'Sin horarios configurados para este mes'}
                            </p>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              handleViewSchedules(
                                item.teacher_id,
                                teacherInfo?.name || item.teacher_id,
                                item.month
                              )
                            }
                            className="bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-xl font-bold uppercase text-sm flex items-center gap-2 transition-all"
                          >
                            <CalendarClock size={18} />
                            Ver / Editar horarios
                          </button>
                        </div>
                      </div>

                      {/* Mini resumen de días con horarios */}
                      {daysWithSchedule.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs text-gray-400 uppercase mb-2">
                            Días con clases este mes
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {daysWithSchedule.map((day) => (
                              <span
                                key={day}
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-naik-gold/60 text-naik-gold text-xs font-bold bg-naik-gold/10"
                              >
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB: CUPOS (AVANZADO) */}
        {activeTab === 'cupos' && (
          <div>
            {/* Selector de mes */}
            <div className="mb-6">
              <label className="block text-sm font-bold uppercase mb-3">Mes</label>
              <div className="flex flex-wrap gap-2">
                {getNextMonths().map(month => (
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

            {/* Ayuda rápida de uso */}
            <div className="mb-6 bg-white/5 border border-white/10 rounded-lg p-4 text-xs md:text-sm text-gray-300">
              <p className="text-naik-gold font-bold uppercase text-xs mb-2">
                Cómo usar Gestión de Cupos
              </p>
              <ul className="list-decimal list-inside space-y-1">
                <li>Elegí el mes arriba para ver la disponibilidad de cada profesor.</li>
                <li>
                  Usá <span className="font-bold text-naik-gold">Clases y Horarios</span> o{' '}
                  <span className="font-bold text-naik-gold">Crear Clase Rápida</span> para crear
                  clases nuevas. Cuando creás un horario, se generan cupos básicos automáticamente.
                </li>
                <li>
                  Acá solo ajustás los <span className="font-bold">cupos totales y los días</span>;
                  los <span className="font-bold">reservados</span> vienen de las reservas reales.
                </li>
                <li>
                  En el mini calendario, los días con{' '}
                  <span className="font-bold text-naik-gold">borde dorado</span> ya tienen horarios
                  configurados.
                </li>
              </ul>
            </div>

            {/* Lista de disponibilidad (edición avanzada de cupos por día) */}
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
                const key = `${item.teacher_id}-${item.month}`;
                const scheduleInfo = scheduleDaysByKey[key];
                const horariosCount = scheduleInfo?.count ?? 0;

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
                          <p className="text-xs text-gray-400 mt-2">
                            {horariosCount > 0
                              ? `${horariosCount} ${horariosCount === 1 ? 'horario configurado' : 'horarios configurados'}`
                              : 'Sin horarios configurados para este mes'}
                          </p>
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
                    {isEditing &&
                      (() => {
                        const keyForEdit = `${item.teacher_id}-${item.month}`;
                        const scheduledDaysForEdit = scheduleDaysByKey[keyForEdit]?.days || [];
                        return (
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
                                  readOnly
                                  className="w-24 bg-white/10 border border-white/20 rounded px-3 py-2 text-center opacity-60 cursor-not-allowed"
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
                                  const isPast = editingCupo ? isDayPast(day, editingCupo.month) : false;
                                  const hasSchedule = scheduledDaysForEdit.includes(day);
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
                                        aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all border
                                        ${isPast
                                          ? 'bg-white/5 text-gray-600 cursor-not-allowed line-through border-white/5'
                                          : isSelected 
                                            ? 'bg-naik-gold text-black hover:bg-yellow-400 border-naik-gold'
                                            : hasSchedule
                                              ? 'bg-white/10 text-gray-200 hover:bg-white/20 border-naik-gold/60'
                                              : 'bg-white/10 text-gray-400 hover:bg-white/20 border-white/10'
                                        }
                                      `}
                                      title={
                                        isPast
                                          ? 'Día ya pasado'
                                          : isSelected
                                            ? 'Click para quitar'
                                            : hasSchedule
                                              ? 'Día con horarios configurados'
                                              : 'Click para agregar'
                                      }
                                    >
                                      {day}
                                    </button>
                                  );
                                })}
                              </div>
                              <p className="text-xs text-gray-400 mt-3 text-center">
                                Click en un dia para agregar/quitar - {editForm.days.length} dias seleccionados
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
                        );
                      })()}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: RESERVAS (con filtros) */}
        {activeTab === 'reservas' && (
          <div className="space-y-4">
            {/* Filtros de estado */}
            <div className="flex flex-wrap gap-2 mb-2">
              {[
                { id: 'pendiente', label: 'Pendientes' },
                { id: 'confirmada', label: 'Confirmadas' },
                { id: 'todas', label: 'Todas' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setReservasFilter(f.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${
                    reservasFilter === f.id
                      ? 'bg-naik-gold text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {loading && (
              <div className="text-center py-12 text-gray-400">
                Cargando reservas...
              </div>
            )}

            {!loading && reservations.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                {reservasFilter === 'pendiente'
                  ? 'No hay reservas pendientes'
                  : reservasFilter === 'confirmada'
                  ? 'No hay reservas confirmadas'
                  : 'No hay reservas registradas'}
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

                {reservation.status === 'pendiente' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleConfirm(reservation.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl uppercase transition-all"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl uppercase transition-all"
                    >
                      ✗ Cancelar
                    </button>
                  </div>
                )}

                {reservation.status === 'confirmada' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl uppercase transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle size={20} />
                      Cancelar Reserva
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
          <div className="bg-[#111] border border-white/20 rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col p-4 md:p-6 my-8">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <div>
                <h3 className="text-2xl font-black text-white uppercase">
                  Horarios de {scheduleModal.teacherName}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Mes: {scheduleModal.month}
                </p>
              </div>
              <button
                onClick={() =>
                  setScheduleModal({
                    show: false,
                    teacherId: "",
                    teacherName: "",
                    month: "",
                    schedules: [],
                    availableDays: [],
                  })
                }
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 mt-2 md:mt-4 pr-1">
              {/* Formulario para agregar / editar horario */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h4 className="text-lg font-bold uppercase text-naik-gold flex items-center gap-2">
                    <Plus size={20} />
                    {editingSchedule ? "Editar Horario" : "Agregar Nuevo Horario"}
                  </h4>
                  {editingSchedule && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSchedule(null);
                        setNewSchedule({
                          day: "",
                          time: "",
                          class_name: "",
                          max_students: "15",
                          duration: "60",
                        });
                      }}
                      className="text-xs uppercase font-bold text-gray-400 hover:text-white transition-colors"
                    >
                      Cancelar edición
                    </button>
                  )}
                </div>

                {/* Calendario para seleccionar día */}
                <div className="mb-6">
                  <label className="block text-sm font-bold uppercase mb-3 text-white">
                    Seleccionar Día *
                  </label>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                        const isSelected =
                          newScheduleDays.includes(day) || newSchedule.day === String(day);
                        const isPast = isDayPast(day, scheduleModal.month);
                        const hasAvailability =
                          scheduleModal.availableDays.length === 0 ||
                          scheduleModal.availableDays.includes(day);
                        const isDisabled = isPast || !hasAvailability;

                        return (
                          <button
                            key={day}
                            type="button"
                            disabled={isDisabled}
                              onClick={() => {
                                if (isDisabled) return;
                                // toggle selección múltiple
                                setNewScheduleDays((prev) =>
                                  prev.includes(day)
                                    ? prev.filter((d) => d !== day)
                                    : [...prev, day].sort((a, b) => a - b)
                                );
                                setNewSchedule({ ...newSchedule, day: String(day) });
                              }}
                            className={`
                              aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all
                              ${
                                isDisabled
                                  ? "bg-white/5 text-gray-600 cursor-not-allowed opacity-40" +
                                    (isPast ? " line-through" : "")
                                  : isSelected
                                  ? "bg-naik-gold text-black"
                                  : "bg-white/10 text-gray-400 hover:bg-white/20"
                              }
                            `}
                            title={
                              isPast
                                ? "Día ya pasado"
                                : !hasAvailability
                                ? "Sin cupos disponibles"
                                : isSelected
                                ? "Día seleccionado"
                                : "Click para seleccionar"
                            }
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {newSchedule.day && (
                    <p className="text-xs text-naik-gold mt-3 text-center font-bold">
                      Días seleccionados:{' '}
                      {newScheduleDays.length > 0
                        ? newScheduleDays.join(', ')
                        : newSchedule.day}
                    </p>
                  )}
                </div>

                {/* Otros campos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-400 uppercase mb-2">
                      Hora *
                    </label>
                    <input
                      type="time"
                      value={newSchedule.time}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, time: e.target.value })
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase mb-2">
                      Clase *
                    </label>
                    <input
                      type="text"
                      value={newSchedule.class_name}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, class_name: e.target.value })
                      }
                      placeholder="Ej: Hip Hop Intermedio"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase mb-2">
                      Duración (min)
                    </label>
                    <input
                      type="number"
                      value={newSchedule.duration}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, duration: e.target.value })
                      }
                      placeholder="60"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 uppercase mb-2">
                      Max Alumnos
                    </label>
                    <input
                      type="number"
                      value={newSchedule.max_students}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          max_students: e.target.value,
                        })
                      }
                      placeholder="15"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={editingSchedule ? handleUpdateSchedule : handleAddSchedule}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl uppercase transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  {editingSchedule ? "Guardar Cambios" : "Agregar Horario"}
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
                  <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                    {scheduleModal.schedules
                      .sort((a, b) => {
                        if (a.day !== b.day) return a.day - b.day;
                        return a.time.localeCompare(b.time);
                      })
                      .map((schedule) => {
                        // Convertir mes "2026-02" a nombre
                        const [year, month] = scheduleModal.month.split("-");
                        const monthNames = [
                          "Enero",
                          "Febrero",
                          "Marzo",
                          "Abril",
                          "Mayo",
                          "Junio",
                          "Julio",
                          "Agosto",
                          "Septiembre",
                          "Octubre",
                          "Noviembre",
                          "Diciembre",
                        ];
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
                                    <div className="text-3xl leading-none">
                                      {schedule.day}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-400 font-bold uppercase">
                                    {monthName}
                                  </div>
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-xl font-bold text-white">
                                      {schedule.time}
                                    </span>
                                    <span className="text-gray-500">-</span>
                                    <span className="text-sm text-gray-400">
                                      {schedule.duration} min
                                    </span>
                                  </div>
                                  <p className="text-lg font-black text-naik-gold mb-1">
                                    {schedule.class_name}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Users size={14} className="text-gray-500" />
                                    <p className="text-sm text-gray-400">
                                      Máximo:{" "}
                                      <span className="text-white font-bold">
                                        {schedule.max_students}
                                      </span>{" "}
                                      alumnos
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                  onClick={() => handleEditScheduleClick(schedule)}
                                  className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-xs uppercase font-bold"
                                  title="Editar horario"
                                >
                                  <Edit2 size={16} />
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteSchedule(schedule.id)}
                                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-all flex items-center justify-center"
                                  title="Eliminar horario"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
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

      {/* Modal Crear Clase Rápida */}
      {quickClassModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#111] border border-white/20 rounded-xl max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-white uppercase">
                Crear Clase Rápida
              </h3>
              <button
                onClick={() =>
                  setQuickClassModal({
                    show: false,
                    teacherId: '',
                    month: selectedMonth,
                    day: '',
                    className: '',
                    time: '',
                    duration: '60',
                    cupos: 15,
                  })
                }
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
                  value={quickClassModal.teacherId}
                  onChange={(e) =>
                    setQuickClassModal({ ...quickClassModal, teacherId: e.target.value })
                  }
                  className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-4 py-3 text-white outline-none"
                  style={{
                    colorScheme: 'dark',
                  }}
                >
                  <option value="" style={{ backgroundColor: '#1a1a1a', color: '#999' }}>
                    Seleccionar profesor...
                  </option>
                  {teachers.map((t) => (
                    <option
                      key={t.id}
                      value={t.id}
                      style={{ backgroundColor: '#1a1a1a', color: 'white' }}
                    >
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mes y selección de días (calendario rápido) */}
              <div>
                <label className="block text-sm font-bold uppercase mb-2 text-gray-400">
                  Mes
                </label>
                <p className="text-white font-bold text-lg mb-3">{quickClassModal.month}</p>
                <label className="block text-xs font-bold uppercase mb-2 text-naik-gold">
                  Días de la clase (podés elegir varios)
                </label>
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                      const isSelected = quickClassDays.includes(day);
                      const isPast = isDayPast(day, quickClassModal.month);

                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={isPast}
                          onClick={() => {
                            if (isPast) return;
                            setQuickClassDays((prev) => {
                              const exists = prev.includes(day);
                              const next = exists
                                ? prev.filter((d) => d !== day)
                                : [...prev, day].sort((a, b) => a - b);
                              setQuickClassModal((prevModal) => ({
                                ...prevModal,
                                day: next.length ? String(next[0]) : '',
                              }));
                              return next;
                            });
                          }}
                          className={`
                            aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all
                            ${
                              isPast
                                ? 'bg-white/5 text-gray-600 cursor-not-allowed opacity-40 line-through'
                                : isSelected
                                ? 'bg-naik-gold text-black'
                                : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }
                          `}
                          title={isPast ? 'Día ya pasado' : 'Click para seleccionar/quitar'}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {quickClassDays.length > 0 && (
                  <p className="text-xs text-naik-gold mt-3 text-center font-bold">
                    Días seleccionados: {quickClassDays.join(', ')}
                  </p>
                )}
              </div>

              {/* Datos de la clase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 text-naik-gold">
                    Nombre de la clase
                  </label>
                  <input
                    type="text"
                    value={quickClassModal.className}
                    onChange={(e) =>
                      setQuickClassModal({ ...quickClassModal, className: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none"
                    placeholder="Ej: Hip Hop Intermedio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 text-naik-gold">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={quickClassModal.time}
                    onChange={(e) =>
                      setQuickClassModal({ ...quickClassModal, time: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none"
                  />
                </div>
              </div>

              {/* Duración y cupos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 text-gray-400">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    value={quickClassModal.duration}
                    onChange={(e) =>
                      setQuickClassModal({ ...quickClassModal, duration: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase mb-2 text-naik-gold">
                    Cupos
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quickClassModal.cupos}
                    onChange={(e) =>
                      setQuickClassModal({
                        ...quickClassModal,
                        cupos: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() =>
                  {
                    setQuickClassModal({
                      show: false,
                      teacherId: '',
                      month: selectedMonth,
                      day: '',
                      className: '',
                      time: '',
                      duration: '60',
                      cupos: 15,
                    });
                    setQuickClassDays([]);
                  }
                }
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl uppercase transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateQuickClass}
                className="flex-1 bg-naik-gold hover:bg-yellow-400 text-black font-bold py-3 rounded-xl uppercase transition-all"
              >
                Crear clase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
