// Content of this file is copied from
// https://supabase.com/docs/guides/auth/server-side/nextjs

import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

import { environment } from '@/config/environment.config';
import { checkOnboardingComplete } from '@/modules/user-settings/user-settings.middleware';

export const updateSession = async (request: NextRequest) => {
  const { supabaseApiUrl, supabaseAnonKey } = environment;
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseApiUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/privacy-policy') &&
    !request.nextUrl.pathname.startsWith('/terms-of-service')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Check if authenticated user needs onboarding
  if (user && !request.nextUrl.pathname.startsWith('/onboarding')) {
    // Check cookie flag first - avoids DB query if user already onboarded
    const onboardingComplete =
      request.cookies.get('onboarding_complete')?.value === 'true';

    if (!onboardingComplete) {
      // Only query DB if cookie not set (first time or after logout)
      const isComplete = await checkOnboardingComplete(supabase, user.id);

      if (isComplete) {
        // Set cookie to avoid future DB queries
        supabaseResponse.cookies.set('onboarding_complete', 'true', {
          maxAge: 60 * 60 * 24 * 365, // 1 year
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
      } else {
        // Redirect to onboarding
        const url = request.nextUrl.clone();
        url.pathname = '/onboarding';
        return NextResponse.redirect(url);
      }
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
};
