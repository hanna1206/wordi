import { type NextRequest } from 'next/server';

import { updateSession } from '@/services/supabase/middleware';

export const middleware = async (request: NextRequest) => {
  return await updateSession(request);
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes)
     * - Static assets (images, fonts, etc.)
     * - manifest, icons, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|manifest|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|ico|json|xml)$).*)',
  ],
};
