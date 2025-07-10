export function PlacementLogo() {
    return (
      <svg
        width="240"
        height="160"
        viewBox="0 0 240 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Window Container */}
        <rect x="40" y="20" width="160" height="120" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
        
        {/* Window Header */}
        <rect x="40" y="20" width="160" height="24" rx="8" fill="#E6EEFF" />
        <circle cx="56" cy="32" r="4" fill="#94A3B8" />
        <circle cx="72" cy="32" r="4" fill="#94A3B8" />
        <circle cx="88" cy="32" r="4" fill="#94A3B8" />
        
        {/* User Avatars */}
        <circle cx="80" cy="80" r="20" fill="#BFDBFE" />
        <circle cx="120" cy="80" r="20" fill="#93C5FD" />
        <circle cx="160" cy="80" r="20" fill="#3B82F6" />
        
        {/* Decorative Element */}
        <path
          d="M200 40C220 40 220 80 200 80"
          stroke="#3B82F6"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  
  