import type { MetadataRoute } from 'next';
import { getAllCharacters } from '@/data/characters';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://olimpo.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, priority: 1.0, changeFrequency: 'monthly' },
    { url: `${siteUrl}/personajes`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${siteUrl}/arboles`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${siteUrl}/arboles/olimpicos`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${siteUrl}/arboles/titanes`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${siteUrl}/arboles/heroes`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${siteUrl}/arboles/sisifo`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${siteUrl}/glosario`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${siteUrl}/linea-temporal`, priority: 0.7, changeFrequency: 'monthly' },
  ];

  const characterRoutes: MetadataRoute.Sitemap = getAllCharacters().map((char) => ({
    url: `${siteUrl}/personaje/${char.id}`,
    priority: 0.6,
    changeFrequency: 'monthly' as const,
  }));

  return [...staticRoutes, ...characterRoutes];
}
