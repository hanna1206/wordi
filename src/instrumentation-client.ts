// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://492e6535052ab7221a7715f7bb1dbd5b@o4509629134864384.ingest.de.sentry.io/4509629142859856',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Enable logs
  _experiments: {
    enableLogs: true,
  },

  integrations: [
    Sentry.feedbackIntegration({
      colorScheme: 'system',
      triggerLabel: 'Send Feedback',
      formTitle: 'Feedback',
      formDescription: 'Please describe the issue you are experiencing.',
      formSuccessMessage: 'Thank you for your feedback!',
      formError: 'An error occurred while submitting the feedback.',
      submitButtonLabel: 'Submit',
    }),
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
