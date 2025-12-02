import { type NextRequest } from 'next/server';

import { updateSession } from '@/services/supabase/middleware';

export const middleware = async (request: NextRequest) => {
  return await updateSession(request);
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next (all Next.js internal files including chunks)
     * - api/ (API routes)
     * - favicon.ico (favicon file)
     * - Static assets (images, fonts, etc.)
     * - manifest, icons, etc.
     */
    '/((?!_next|api/|favicon.ico|manifest|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|ico|json|xml)$).*)',
  ],
};
