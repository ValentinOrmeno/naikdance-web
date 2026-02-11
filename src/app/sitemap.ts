import { MetadataRoute } from 'next';
import { teachers } from '@/data/teachers';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://naikdance-web.vercel.app';
  
  // URLs principales (sin anclas #)
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  // URLs de cada profesor/staff
  const teacherRoutes = teachers.map((teacher) => ({
    url: `${baseUrl}/profesores/${teacher.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...teacherRoutes];
}
