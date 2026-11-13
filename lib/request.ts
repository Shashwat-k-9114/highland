import 'server-only';
import { parseUA } from './analytics';

export function requestContext(req: Request) {
  const h = req.headers;
  const ua = h.get('user-agent') || '';
  let city = h.get('x-vercel-ip-city') || '';
  try { city = decodeURIComponent(city); } catch { /* keep raw */ }
  return {
    ua,
    country: (h.get('x-vercel-ip-country') || h.get('cf-ipcountry') || '').toUpperCase().slice(0, 2),
    city: city.slice(0, 60),
    device: parseUA(ua).device,
  };
}

export const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
