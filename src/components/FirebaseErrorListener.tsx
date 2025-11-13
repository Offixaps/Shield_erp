
'use client';

import * as React from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

/**
 * This component listens for 'permission-error' events and throws them,
 * allowing Next.js's development error overlay to catch and display them.
 * It should be placed at the root of your component tree.
 */
export default function FirebaseErrorListener() {
  React.useEffect(() => {
    const handleError = (error: Error) => {
      // Throw the error so the Next.js overlay can catch it
      throw error;
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null; // This component does not render anything
}
