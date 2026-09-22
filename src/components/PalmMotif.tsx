export function PalmIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M24 44V22" strokeLinecap="round" />
      <path d="M24 22c-4-6-11-8-16-6 3-5 11-6 16-1" strokeLinecap="round" />
      <path d="M24 22c4-6 11-8 16-6-3-5-11-6-16-1" strokeLinecap="round" />
      <path d="M24 20c-2-7 0-13 4-16-6 0-9 6-9 12" strokeLinecap="round" />
      <path d="M22 44h8" strokeLinecap="round" />
    </svg>
  );
}

export function SchoolCrest({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="var(--primary)" />
      <path d="M32 10 20 24h24L32 10Z" fill="var(--gold)" />
      <path d="M18 28h28v22H18z" fill="var(--clay)" opacity="0.92" />
      <path d="M24 50V36h6v14zM34 50V36h6v14z" fill="var(--card)" opacity="0.85" />
      <path d="M18 28l4-5 4 5 4-5 4 5 4-5 4 5" stroke="var(--card)" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

export function LandmarkArt({ className = "h-32 w-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 120" className={className} aria-hidden="true">
      {/* Diriyah style mud-brick skyline + Kingdom Tower silhouette */}
      <g fill="var(--clay)" opacity="0.28">
        <path d="M0 120V70h30l10-12 10 12h28v50z" />
        <path d="M76 120V58h44l8-10 8 10h34v62z" />
        <path d="M300 120V40h22l-11-18-11 18z" opacity="0.5" />
      </g>
      <g fill="var(--primary)" opacity="0.35">
        <path d="M200 120V26c0-6 12-6 12 0v94z" />
        <path d="M188 120V44h10v76zM214 120V44h10v76z" />
        <path d="M188 52h36v8h-36z" />
      </g>
      <g stroke="var(--gold)" strokeWidth="2" fill="none" opacity="0.45">
        <path d="M0 118h400" />
        <path d="M120 118l8-10 8 10M340 118l8-10 8 10" />
      </g>
    </svg>
  );
}
