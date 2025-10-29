export default function Logo({ variant = 'default' }: { variant?: 'default' | 'large' }) {
  const sizeClasses = variant === 'large' 
    ? 'text-4xl md:text-5xl' 
    : 'text-2xl md:text-3xl';
    
  return (
    <div className="flex items-center gap-3">
      {/* Small decorative icon - leaf from original logo */}
      <svg 
        className="w-7 h-7 md:w-8 md:h-8 text-fetra-olive flex-shrink-0" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
      >
        <path 
          d="M12 3C7 3 3 7 3 12c0 2 1 4 2 5 1 2 3 3 5 4 0-2 1-4 2-5 1-2 2-3 3-4 1 1 2 2 3 4 1 1 2 3 2 5 2-1 4-2 5-4 1-1 2-3 2-5 0-5-4-9-9-9zm0 0c-1 2-2 4-2 6s1 4 2 6c1-2 2-4 2-6s-1-4-2-6z" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="currentColor"
          fillOpacity="0.1"
        />
      </svg>
      
      {/* FETRA text logo */}
      <span 
        className={`${sizeClasses} font-serif font-bold tracking-[0.2em] text-fetra-olive relative`}
        style={{
          fontFamily: "'Playfair Display', 'Georgia', serif",
          letterSpacing: '0.15em',
          fontWeight: 600
        }}
      >
        FETRA
        <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-fetra-pink"></span>
      </span>
    </div>
  );
}

