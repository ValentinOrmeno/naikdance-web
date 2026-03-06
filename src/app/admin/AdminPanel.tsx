"use client";
import { AdminDashboardSection } from "./AdminDashboardSection";
import { useState, useEffect, useCallback, useMemo } from "react";
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
  getAllPackPurchases,
  incrementPackUsage,
  deleteExpiredWhatsappReservations,
} from "@/lib/supabase-admin-extended";
import type { Reservation, Availability, ClassSchedule, PackPurchase } from "@/lib/supabase";
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
// Clases especiales: ver AdminSpecialClassesSection.tsx para integrar cuando sea necesario.

type Tab = "dashboard" | "reservas" | "clases" | "creditos";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [reservasFilter, setReservasFilter] = useState<"todas" | "pendiente" | "confirmada">("pendiente");
  const [reservasSearch, setReservasSearch] = useState("");
  const [packPurchases, setPackPurchases] = useState<PackPurchase[]>([]);
  const [packSearch, setPackSearch] = useState("");
  const [packConfirmModal, setPackConfirmModal] = useState<{
    show: boolean;
    reservationId: string | null;
    pack: PackPurchase | null;
  }>({
    show: false,
    reservationId: null,
    pack: null,
  });
  
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
    details: '',
    nivel: '',
    categoria: '',
    precioEfectivo: '',
    precioMercadoPago: '',
  });
  // Bloquear scroll global cuando hay modales abiertos
  useEffect(() => {
    const modalOpen =
      confirmModal.show ||
      detailModal.show ||
      scheduleModal.show ||
      packConfirmModal.show ||
      quickClassModal.show ||
      addAvailabilityModal.show;

    if (modalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [
    confirmModal.show,
    detailModal.show,
    scheduleModal.show,
    packConfirmModal.show,
    quickClassModal.show,
    addAvailabilityModal.show,
  ]);
  const [newSchedule, setNewSchedule] = useState({
    day: '',
    time: '',
    class_name: '',
    max_students: '15',
    duration: '60'
  });
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null);
  const [newScheduleDays, setNewScheduleDays] = useState<number[]>([]);

  const filteredReservations = useMemo(() => {
    // Filtrar por estado primero
    let base =
      reservasFilter === "todas"
        ? reservations
        : reservations.filter((r) => r.status === reservasFilter);

    const term = reservasSearch.trim().toLowerCase();
    if (!term) return base;

    return base.filter((r) => {
      const nombre = (r.nombre || "").toLowerCase();
      const email = (r.email || "").toLowerCase();
      const teacher = (r.teacher_id || "").toLowerCase();
      const clase = (r.clase || "").toLowerCase();
      const fecha = (r.fecha || "").toLowerCase();
      return (
        nombre.includes(term) ||
        email.includes(term) ||
        teacher.includes(term) ||
        clase.includes(term) ||
        fecha.includes(term)
      );
    });
  }, [reservations, reservasFilter, reservasSearch]);

  const filteredPackPurchases = useMemo(() => {
    const term = packSearch.trim().toLowerCase();
    if (!term) return packPurchases;
    return packPurchases.filter((pack) => {
      const nombre = (pack.alumno_nombre || "").toLowerCase();
      const email = (pack.alumno_email || "").toLowerCase();
      const packName = (pack.pack_name || "").toLowerCase();
      const packType = (pack.pack_type || "").toLowerCase();
      return (
        nombre.includes(term) ||
        email.includes(term) ||
        packName.includes(term) ||
        packType.includes(term)
      );
    });
  }, [packPurchases, packSearch]);
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
      details: '',
      nivel: '',
      categoria: '',
      precioEfectivo: '',
      precioMercadoPago: '',
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
    const { teacherId, month, day, className, time, duration, cupos, details, nivel, categoria, precioEfectivo, precioMercadoPago } = quickClassModal;

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

      // Construir nombre de clase: nombre + nivel + categoría + detalle libre + precio efectivo
      const parts = [className.trim()];
      if (nivel.trim()) parts.push(nivel.trim());
      if (categoria.trim()) parts.push(categoria.trim());
      if (details.trim()) parts.push(details.trim());
      if (precioEfectivo.trim()) parts.push(`Efectivo ${precioEfectivo.trim()}`);
      const fullClassName = parts.join(' · ');
      const priceNum = precioMercadoPago.trim() ? parseInt(precioMercadoPago.replace(/\D/g, ''), 10) : undefined;
      const priceForDb = priceNum != null && !Number.isNaN(priceNum) && priceNum >= 0 ? priceNum : undefined;

      // Crear un horario por cada día
      await Promise.all(
        daysToInsert.map((d) =>
          createClassSchedule({
            teacher_id: teacherId,
            month,
            day: d,
            time,
            class_name: fullClassName,
            duration: parseInt(duration, 10) || 60,
            max_students: cupos,
            ...(priceForDb != null && { price: priceForDb }),
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
        details: '',
        nivel: '',
        categoria: '',
        precioEfectivo: '',
        precioMercadoPago: '',
      });
      setQuickClassDays([]);

      await loadStats();
      if (activeTab === "clases") {
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
      // Limpiar reservas vencidas de WhatsApp antes de cargar
      await deleteExpiredWhatsappReservations();

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

  const loadPackPurchases = async () => {
    setLoading(true);
    try {
      const data = await getAllPackPurchases();
      setPackPurchases(data || []);
    } catch (error) {
      console.error("Error al cargar packs:", error);
      alert("Error al cargar packs y cuponeras");
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
    } else if (activeTab === "creditos") {
      loadPackPurchases();
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [activeTab, selectedMonth, reservasFilter, isAuthenticated]);

  const detailModalSortedReservations = useMemo(
    () =>
      [...(detailModal.reservations || [])].sort((a, b) => {
        const dateA = a.fecha.split("/").reverse().join("-");
        const dateB = b.fecha.split("/").reverse().join("-");
        return dateA.localeCompare(dateB);
      }),
    [detailModal.reservations]
  );

  const handleConfirm = useCallback((id: string) => {
    setConfirmModal({ show: true, id, action: 'confirm' });
  }, []);

  const handleCancel = useCallback((id: string) => {
    setConfirmModal({ show: true, id, action: 'cancel' });
  }, []);

  const executeAction = async () => {
    try {
      if (confirmModal.action === 'confirm') {
        await confirmReservation(confirmModal.id);
        // Luego de confirmar, buscar si hay un pack activo para este alumno
        const confirmedReservation = reservations.find((r) => r.id === confirmModal.id);
        if (confirmedReservation && confirmedReservation.email) {
          // Asegurarnos de tener packs cargados aunque el usuario no haya entrado a la pestaña "Alumnos y Créditos"
          let packsParaBuscar = packPurchases;
          if (!packsParaBuscar || packsParaBuscar.length === 0) {
            const data = await getAllPackPurchases();
            packsParaBuscar = data || [];
            setPackPurchases(packsParaBuscar);
          }

          const email = confirmedReservation.email.toLowerCase().trim();
          const telefonoReserva = (confirmedReservation.telefono || '').replace(/\D/g, '');
          const nombreReserva = (confirmedReservation.nombre || '').toLowerCase().trim();

          let matchingPacks: PackPurchase[] = [];

          // 1) Intentar por email (principal)
          if (email) {
            matchingPacks = packsParaBuscar.filter((p) => {
              const packEmail = (p.alumno_email || '').toLowerCase().trim();
              const total = p.clases_incluidas;
              const usadas = p.clases_usadas;
              const tieneCupos = total === null ? true : usadas < total;

              const vieneDePack =
                confirmedReservation.clase?.toUpperCase().includes('PACK/CUPONERA') ?? false;

              if (vieneDePack) {
                return p.status === 'activo' && packEmail === email && tieneCupos;
              }

              return p.status === 'activo' && packEmail === email && tieneCupos;
            });
          }

          // 2) Si no encontramos por email, intentar por teléfono + nombre
          if (matchingPacks.length === 0 && telefonoReserva) {
            const candidatosTelefono = packsParaBuscar.filter((p) => {
              const packTel = (p.alumno_telefono || '').replace(/\D/g, '');
              const total = p.clases_incluidas;
              const usadas = p.clases_usadas;
              const tieneCupos = total === null ? true : usadas < total;
              const nombrePack = (p.alumno_nombre || '').toLowerCase().trim();

              const nombreCoincide =
                !!nombreReserva && !!nombrePack && nombreReserva === nombrePack;

              return (
                p.status === 'activo' &&
                packTel.length > 0 &&
                packTel === telefonoReserva &&
                tieneCupos &&
                nombreCoincide
              );
            });

            // Solo sugerimos si hay un único candidato claro por teléfono+nombre
            if (candidatosTelefono.length === 1) {
              matchingPacks = candidatosTelefono;
            }
          }

          if (matchingPacks.length > 0) {
            const packOrdenados =
              matchingPacks[0].created_at && matchingPacks[0].created_at !== null
                ? [...matchingPacks].sort((a, b) => {
                    const da = new Date(a.created_at as any).getTime();
                    const db = new Date(b.created_at as any).getTime();
                    return db - da;
                  })
                : matchingPacks;

            const packSeleccionado = packOrdenados[0];

            setPackConfirmModal({
              show: true,
              reservationId: confirmedReservation.id,
              pack: packSeleccionado,
            });
          }
        }
      } else {
        await cancelReservation(confirmModal.id);
        // Después de cancelar, corregir automáticamente cupos negativos si los hay
        await fixNegativeCupos();
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
            id="admin-password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLoginError('');
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
    { id: 'creditos', label: 'Alumnos y Créditos', icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden min-w-0 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase">
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
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold uppercase text-xs sm:text-base transition-all ${
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
                      className="bg-[#111] border border-white/20 rounded-xl p-5 sm:p-6 hover:border-naik-gold/50 transition-all h-full flex flex-col justify-between"
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

        {/* TAB: RESERVAS (con filtros) */}

        {/* TAB: RESERVAS (con filtros) */}
        {activeTab === 'reservas' && (
          <div className="space-y-4">
            {/* Filtros de estado + búsqueda */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
              <div className="flex flex-wrap gap-2">
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
              <div className="w-full md:w-80">
                <input
                  type="text"
                  placeholder="Buscar por alumno, email, profe, clase..."
                  value={reservasSearch}
                  onChange={(e) => setReservasSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-naik-gold focus:border-naik-gold"
                />
              </div>
            </div>

            {loading && (
              <div className="text-center py-12 text-gray-400">
                Cargando reservas...
              </div>
            )}

            {!loading && filteredReservations.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                {reservasSearch.trim()
                  ? 'No se encontraron reservas para ese término de búsqueda'
                  : reservasFilter === 'pendiente'
                  ? 'No hay reservas pendientes'
                  : reservasFilter === 'confirmada'
                  ? 'No hay reservas confirmadas'
                  : 'No hay reservas registradas'}
              </div>
            )}

            {!loading && filteredReservations.map((reservation) => (
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

        {/* TAB: ALUMNOS Y CRÉDITOS (packs/cuponeras) */}
        {activeTab === "creditos" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-xl font-black uppercase tracking-wide text-white">
                Alumnos y créditos
              </h2>
              <div className="w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Buscar por alumno, email o pack..."
                  value={packSearch}
                  onChange={(e) => setPackSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-naik-gold focus:border-naik-gold"
                />
              </div>
            </div>
            {loading && (
              <div className="text-center py-12 text-gray-400">
                Cargando packs y cuponeras...
              </div>
            )}

            {!loading && filteredPackPurchases.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                {packSearch.trim()
                  ? "No se encontraron alumnos para ese término de búsqueda"
                  : "Todavía no hay compras de packs o cuponeras registradas"}
              </div>
            )}

            {!loading &&
              filteredPackPurchases.map((pack) => {
                const usadas = pack.clases_usadas;
                const total = pack.clases_incluidas;
                const restantes =
                  total === null ? "∞" : Math.max(total - usadas, 0).toString();

                return (
                  <div
                    key={pack.id}
                    className="bg-[#111] border border-white/20 rounded-xl p-6 hover:border-naik-gold/50 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase mb-1">
                          Alumno
                        </p>
                        <p className="font-bold text-lg">
                          {pack.alumno_nombre}
                        </p>
                        <p className="text-sm text-gray-400">
                          {pack.alumno_email}
                        </p>
                        {pack.alumno_telefono && (
                          <p className="text-xs text-gray-500 mt-1">
                            Tel: {pack.alumno_telefono}
                          </p>
                        )}
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 uppercase mb-1">
                            Tipo de pack
                          </p>
                          <p className="text-sm font-bold">
                            {pack.pack_type} -{" "}
                            <span className="text-naik-gold">
                              {pack.pack_name}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase mb-1">
                            Clases
                          </p>
                          <p className="text-sm font-bold">
                            {total === null
                              ? "Ilimitadas"
                              : `${usadas}/${total}`}{" "}
                            {total !== null && (
                              <span className="text-xs text-gray-400 ml-1">
                                (restan {restantes})
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase mb-1">
                            Estado
                          </p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              pack.status === "activo"
                                ? "bg-green-500/20 text-green-400"
                                : pack.status === "completo"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {pack.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        disabled={pack.status !== "activo"}
                        onClick={async () => {
                          try {
                            const updated = await incrementPackUsage(pack.id, 1);
                            if (!updated) return;
                            setPackPurchases((prev) =>
                              prev.map((p) => (p.id === pack.id ? updated : p))
                            );

                            const total = updated.clases_incluidas;
                            const usadas = updated.clases_usadas;
                            const restantes =
                              total === null ? "∞" : Math.max(total - usadas, 0).toString();

                            alert(
                              total === null
                                ? `Se registró 1 uso. Lleva ${usadas} clases tomadas con este pack.`
                                : `Se registró 1 uso. Lleva ${usadas}/${total} clases (restan ${restantes}).`
                            );
                          } catch (error) {
                            console.error("Error al usar crédito del pack:", error);
                            alert("Error al usar un crédito del pack");
                          }
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold uppercase bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                      >
                        Usar 1 crédito
                      </button>

                      <button
                        disabled={pack.clases_usadas <= 0}
                        onClick={async () => {
                          if (pack.clases_usadas <= 0) {
                            alert("Este pack todavía no tiene clases usadas para devolver.");
                            return;
                          }
                          try {
                            const updated = await incrementPackUsage(pack.id, -1);
                            if (!updated) return;
                            setPackPurchases((prev) =>
                              prev.map((p) => (p.id === pack.id ? updated : p))
                            );

                            const total = updated.clases_incluidas;
                            const usadas = updated.clases_usadas;
                            const restantes =
                              total === null ? "∞" : Math.max(total - usadas, 0).toString();

                            alert(
                              total === null
                                ? `Se devolvió 1 crédito. Lleva ${usadas} clases tomadas con este pack.`
                                : `Se devolvió 1 crédito. Lleva ${usadas}/${total} clases (restan ${restantes}).`
                            );
                          } catch (error) {
                            console.error("Error al devolver crédito del pack:", error);
                            alert("Error al devolver un crédito del pack");
                          }
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold uppercase bg-transparent border border-yellow-400 text-yellow-300 hover:bg-yellow-500/10 disabled:border-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
                      >
                        Devolver 1 crédito
                      </button>

                      <button
                        onClick={() => {
                          if (!pack.alumno_telefono) {
                            alert(
                              "Este pack no tiene teléfono guardado. Para packs manuales podés cargar el teléfono desde Supabase."
                            );
                            return;
                          }

                          const cleanPhone = pack.alumno_telefono.replace(/\D/g, "");
                          const total = pack.clases_incluidas;
                          const usadas = pack.clases_usadas;
                          const restantes =
                            total === null ? "ilimitadas" : Math.max(total - usadas, 0).toString();

                          const mensaje = `Hola! Te escribimos de NAIK Dance.\n\nTe confirmamos que usaste una clase de tu ${pack.pack_type} (${pack.pack_name}).\n\nLlevás usadas ${usadas}${
                            total === null ? "" : ` de ${total}`
                          } clases, te quedan ${restantes}.\n\nGracias por entrenar con nosotros!`;

                          const url = `https://wa.me/54${cleanPhone}?text=${encodeURIComponent(
                            mensaje
                          )}`;
                          window.open(url, "_blank");
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold uppercase bg-[#25D366] hover:bg-[#1ebe5a] text-black transition-all"
                      >
                        WhatsApp saldo
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Modal de Detalles de Reservas por Profesor */}
      {detailModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto overflow-x-hidden">
          <div className="bg-[#111] border border-white/20 rounded-xl max-w-[min(95vw,56rem)] w-full p-4 sm:p-6 my-4 sm:my-8">
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
                {detailModalSortedReservations.map((reservation) => (
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
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto overflow-x-hidden px-2 sm:px-4">
          <div className="bg-[#111] border border-white/20 rounded-xl w-full max-w-4xl flex flex-col p-3 sm:p-4 md:p-6 my-6 sm:my-10">
            <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6 shrink-0">
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

            <div className="space-y-4 md:space-y-6 mt-2 md:mt-4">
              {/* Formulario para agregar / editar horario */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 md:p-6 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3 sm:mb-4">
                  <h4 className="text-base sm:text-lg font-bold uppercase text-naik-gold flex items-center gap-2">
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
                <div className="mb-4 md:mb-6 min-w-0">
                  <label className="block text-sm font-bold uppercase mb-2 sm:mb-3 text-white">
                    Seleccionar Día *
                  </label>
                  <div className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10 overflow-x-auto max-w-xl mx-auto">
                    <div className="grid grid-cols-7 gap-0.5 sm:gap-1 min-w-0 w-full" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
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
                              w-full min-w-0 h-7 sm:h-8 flex items-center justify-center rounded-lg text-[11px] sm:text-xs font-bold transition-all
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
                      id="schedule-time"
                      name="time"
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
                      id="schedule-class-name"
                      name="class_name"
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
                      id="schedule-duration"
                      name="duration"
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
                      id="schedule-max-students"
                      name="max_students"
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
<div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-x-hidden">
        <div className="bg-[#111] border border-white/20 rounded-xl max-w-[min(95vw,28rem)] w-full p-4 sm:p-6">
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

      {/* Modal: sugerir descuento automático de pack */}
      {packConfirmModal.show && packConfirmModal.pack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-x-hidden">
          <div className="bg-[#111] border border-naik-gold/40 rounded-xl max-w-[min(95vw,28rem)] w-full p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-white uppercase">
                Usar crédito de pack
              </h3>
              <button
                onClick={() =>
                  setPackConfirmModal({ show: false, reservationId: null, pack: null })
                }
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-300 mb-4 text-sm">
              Se encontró un pack activo para este alumno:
            </p>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6 text-sm">
              <p className="text-naik-gold font-bold mb-1">
                {packConfirmModal.pack.pack_type} - {packConfirmModal.pack.pack_name}
              </p>
              <p className="text-gray-300">
                Alumno: {packConfirmModal.pack.alumno_nombre} (
                {packConfirmModal.pack.alumno_email})
              </p>
              <p className="text-gray-300 mt-1">
                Usadas: {packConfirmModal.pack.clases_usadas}
                {packConfirmModal.pack.clases_incluidas === null
                  ? " / ilimitadas"
                  : ` / ${packConfirmModal.pack.clases_incluidas}`}
              </p>
            </div>

            <p className="text-gray-300 mb-6 text-sm">
              ¿Querés descontar <span className="font-bold text-naik-gold">1 crédito</span> de
              este pack para esta reserva?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setPackConfirmModal({ show: false, reservationId: null, pack: null })
                }
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl uppercase transition-all text-sm"
              >
                No, dejar así
              </button>
              <button
                onClick={async () => {
                  if (!packConfirmModal.pack) return;
                  try {
                    const updated = await incrementPackUsage(packConfirmModal.pack.id, 1);
                    if (!updated) return;

                    setPackPurchases((prev) =>
                      prev.map((p) => (p.id === updated.id ? updated : p))
                    );

                    // Ya se ve el nuevo uso reflejado en el tab de créditos,
                    // no hace falta mostrar un alert extra del navegador.
                  } catch (error) {
                    console.error("Error al usar crédito del pack desde modal:", error);
                    alert("Error al usar un crédito del pack");
                  } finally {
                    setPackConfirmModal({ show: false, reservationId: null, pack: null });
                  }
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl uppercase transition-all text-sm"
              >
                Sí, usar 1 crédito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar Disponibilidad */}
      {addAvailabilityModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto overflow-x-hidden">
          <div className="bg-[#111] border border-white/20 rounded-xl max-w-[min(95vw,36rem)] w-full p-4 sm:p-6 my-4 sm:my-8">
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
                  id="add-availability-teacher"
                  name="teacherId"
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
                  id="add-availability-cupos"
                  name="cupos"
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
                  <div className="grid grid-cols-7 gap-0.5 sm:gap-1 min-w-0 w-full" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
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
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto overflow-x-hidden">
          <div className="bg-[#111] border border-white/20 rounded-xl max-w-[min(95vw,36rem)] w-full p-4 sm:p-6 my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
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
                    details: '',
                    nivel: '',
                    categoria: '',
                    precioEfectivo: '',
                    precioMercadoPago: '',
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
                  id="quick-class-teacher"
                  name="teacherId"
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
                  <div className="grid grid-cols-7 gap-0.5 sm:gap-1 min-w-0 w-full" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
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
                    id="quick-class-name"
                    name="className"
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
                    id="quick-class-time"
                    name="time"
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
                    id="quick-class-duration"
                    name="duration"
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
                    id="quick-class-cupos"
                    name="cupos"
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

              {/* Nivel y categoría (pequeños) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5 text-gray-400">
                    Nivel
                  </label>
                  <input
                    id="quick-class-nivel"
                    name="nivel"
                    type="text"
                    value={quickClassModal.nivel}
                    onChange={(e) =>
                      setQuickClassModal({ ...quickClassModal, nivel: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500"
                    placeholder="Ej: Principiante, ALL LEVELS"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5 text-gray-400">
                    Categoría
                  </label>
                  <input
                    id="quick-class-categoria"
                    name="categoria"
                    type="text"
                    value={quickClassModal.categoria}
                    onChange={(e) =>
                      setQuickClassModal({ ...quickClassModal, categoria: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500"
                    placeholder="Ej: Juvenil, Infantil"
                  />
                </div>
              </div>

              {/* Precios */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5 text-gray-400">
                    Precio efectivo
                  </label>
                  <input
                    id="quick-class-precio-efectivo"
                    name="precioEfectivo"
                    type="text"
                    value={quickClassModal.precioEfectivo}
                    onChange={(e) =>
                      setQuickClassModal({ ...quickClassModal, precioEfectivo: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500"
                    placeholder="Ej: $15.000"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Se muestra en el nombre de la clase.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1.5 text-gray-400">
                    Precio Mercado Pago
                  </label>
                  <input
                    id="quick-class-precio-mp"
                    name="precioMercadoPago"
                    type="text"
                    value={quickClassModal.precioMercadoPago}
                    onChange={(e) =>
                      setQuickClassModal({ ...quickClassModal, precioMercadoPago: e.target.value })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500"
                    placeholder="Ej: 15000 (número)"
                  />
                </div>
              </div>

              {/* Detalle libre (opcional) */}
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 text-gray-400">
                  Otro detalle (opcional)
                </label>
                <textarea
                  id="quick-class-details"
                  name="details"
                  rows={2}
                  value={quickClassModal.details}
                  onChange={(e) =>
                    setQuickClassModal({ ...quickClassModal, details: e.target.value })
                  }
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none resize-y placeholder:text-gray-500"
                  placeholder="Ej: Solo 15 cupos, Sáb 28/3"
                />
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
        details: '',
        nivel: '',
        categoria: '',
        precioEfectivo: '',
        precioMercadoPago: '',
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
