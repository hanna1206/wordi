'use client';

import { useEffect, useRef } from 'react';

import * as Sentry from '@sentry/nextjs';
import { usePathname } from 'next/navigation';

interface FeedbackWidget {
  removeFromDom: () => void;
}

export const FeedbackWidget = () => {
  const pathname = usePathname();
  const widgetRef = useRef<FeedbackWidget | null>(null);

  // Define which pages should show the feedback widget
  const allowedPaths = [
    '/words',
    '/user',
    '/onboarding',
    '/',
    // Add more paths as needed
  ];

  // Check if current page should show feedback widget
  const shouldShowFeedback = allowedPaths.some((path) =>
    pathname.startsWith(path),
  );

  useEffect(() => {
    const feedback = Sentry.getFeedback();

    if (shouldShowFeedback && feedback) {
      // Create and show the widget
      const widget = feedback.createWidget();
      widgetRef.current = widget;
    } else if (widgetRef.current) {
      // Remove the widget if it exists and shouldn't be shown
      widgetRef.current.removeFromDom();
      widgetRef.current = null;
    }

    // Cleanup function
    return () => {
      if (widgetRef.current) {
        widgetRef.current.removeFromDom();
        widgetRef.current = null;
      }
    };
  }, [pathname, shouldShowFeedback]);

  // This component doesn't render anything visible
  return null;
};
