export function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ig-g" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#f58529" />
          <stop offset=".5" stopColor="#dd2a7b" />
          <stop offset="1" stopColor="#8134af" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="url(#ig-g)" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="url(#ig-g)" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="#dd2a7b" />
    </svg>
  );
}

export function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z"
      />
    </svg>
  );
}

export function MessengerIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ms-g" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#00B2FF" />
          <stop offset="1" stopColor="#A334FA" />
        </linearGradient>
      </defs>
      <path
        fill="url(#ms-g)"
        d="M12 1C5.8 1 1 5.6 1 11.5c0 3.2 1.4 6 3.7 7.9V23l3.4-1.9c1.2.3 2.5.5 3.9.5 6.2 0 11-4.6 11-10.6S18.2 1 12 1zm1.1 14.2-2.8-3-5.4 3 6-6.4 2.8 3 5.4-3-6 6.4z"
      />
    </svg>
  );
}

export function ZaloIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="1" y="2" width="22" height="20" rx="6" fill="#0068FF" />
      <text x="12" y="16.2" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">
        Zalo
      </text>
    </svg>
  );
}
