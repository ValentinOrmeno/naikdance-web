import TeacherBooking from '@/components/TeacherBooking';
import { getTeacherById } from '@/data/teachers';
import { notFound } from 'next/navigation';

export default async function TeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = getTeacherById(id);
  
  if (!teacher) {
    notFound();
  }

  return <TeacherBooking teacher={teacher} />;
}
