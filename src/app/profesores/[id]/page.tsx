import TeacherBooking from '@/components/TeacherBooking';
import { getTeacherById, teachers } from '@/data/teachers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const teacher = getTeacherById(id);
  
  if (!teacher) {
    return {
      title: 'Profesor no encontrado | Naik Dance Studio',
    };
  }

  const title = `${teacher.name} - ${teacher.style} | Naik Dance Studio`;
  const description = `Reservá una clase con ${teacher.name}, especialista en ${teacher.style}. ${teacher.classes.join(' · ')}. Academia de danza urbana en Moreno, Buenos Aires.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [teacher.image],
      url: `https://naikdance-web.vercel.app/profesores/${teacher.id}`,
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [teacher.image],
    },
  };
}

export async function generateStaticParams() {
  return teachers.map((teacher) => ({
    id: teacher.id,
  }));
}

export default async function TeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const teacher = getTeacherById(id);
  
  if (!teacher) {
    notFound();
  }

  return <TeacherBooking teacher={teacher} />;
}
