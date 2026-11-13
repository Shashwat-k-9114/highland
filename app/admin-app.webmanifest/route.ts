/** Installable manifest so the admin can be added to a phone's home screen and open like an app. */
export function GET() {
  return Response.json(
    {
      name: 'Highland Capitals Admin',
      short_name: 'Highland Admin',
      description: 'Leads and traffic for Highland Capitals.',
      id: '/admin',
      start_url: '/admin',
      scope: '/admin',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#14110D',
      theme_color: '#14110D',
      icons: [
        { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        { src: '/apple-icon', sizes: '180x180', type: 'image/png', purpose: 'any' },
      ],
    },
    { headers: { 'Content-Type': 'application/manifest+json', 'Cache-Control': 'public, max-age=86400' } },
  );
}
