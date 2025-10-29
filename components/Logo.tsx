export default function Logo({ variant = 'default' }: { variant?: 'default' | 'large' }) {
  const sizeClasses = variant === 'large' 
    ? 'text-4xl md:text-5xl' 
    : 'text-3xl';
    
  const beautySize = variant === 'large'
    ? 'text-sm md:text-base'
    : 'text-[0.5rem] md:text-xs';
    
  return (
    <div className="flex items-center gap-3">
      {/* Small decorative icon - leaf */}
      <svg 
        className="w-8 h-8 md:w-9 md:h-9 text-fetra-olive flex-shrink-0" 
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
      
      {/* FETRA BEAUTY text logo - stacked */}
      <div className="flex flex-col items-start leading-none">
        <span 
          className={`${sizeClasses} font-serif font-bold tracking-[0.15em] text-fetra-olive`}
          style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            letterSpacing: '0.15em',
            fontWeight: 700,
            lineHeight: 1
          }}
        >
          FETRA
        </span>
        <span 
          className={`${beautySize} font-sans tracking-[0.3em] text-fetra-pink font-semibold mt-0.5 ml-0.5`}
          style={{
            letterSpacing: '0.35em',
            fontWeight: 600,
            lineHeight: 1
          }}
        >
          BEAUTY
        </span>
      </div>
    </div>
  );
}

