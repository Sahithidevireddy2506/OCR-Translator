import React from 'react';

export default function UserNotRegisteredError() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
          <svg
            className="w-8 h-8 text-orange-600"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Access Denied
        </h1>

        <p className="text-slate-600 mb-8">
          You are not registered to use this application. Please contact the administrator.
        </p>

        <div className="p-4 bg-slate-50 rounded-md text-sm text-left">
          <p className="mb-2">If you believe this is an error, you can:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600">
            <li>Verify you are logged in with the correct account</li>
            <li>Contact the app administrator for access</li>
            <li>Try logging out and back in again</li>
          </ul>
        </div>
      </div>
    </div>
  );
}