import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

const built = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, lastModified: built, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/privacy`, lastModified: built, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/terms`, lastModified: built, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
