import React, { useState, useEffect } from 'react';
import sadpage from './assets/2sadpage.svg';

export const OfflineFallbackWrapper = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <>
      <main className="min-h-screen bg-[#202124] px-8 pt-[clamp(64px,22vh,176px)] font-[Arial,sans-serif] text-[#bdc1c6] max-sm:px-7 max-sm:pt-[18vh]">
            <section className="mx-auto w-full max-w-133">
              <img
                className="mb-11 block h-10.5 w-8.5 opacity-[0.72] max-sm:mb-9.5"
                src={sadpage}
                alt=""
              />
              <h1 className="mb-1 text-[22px] font-normal" id="offline-title">
                No internet.
              </h1>
              <p className="mt-2 text-[15px] mb-5">
                You are currently offline. Please check your internet connection and try again.
              </p>
              <code className='mt-10'>NO_CONNECTION_DETECTED</code>
              <p className="mt-10 text-[10px]">While you wait, why not <a href="/fallbackR.html" className="text-blue-600 underline">play a game</a>?</p>
              <div className="mt-13 flex justify-end max-sm:mt-10">
                <button
                  className="min-h-8 cursor-pointer rounded-full border-0 bg-blue-700 px-3 text-[13px] text-white hover:bg-blue-500"
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Reload
                </button>
              </div>
            </section>
          </main>
      </>
    );
  }

  return <>{children}</>;
};
