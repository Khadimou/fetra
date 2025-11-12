'use client';

type VideoEmbedProps = {
  src: string;
  poster?: string;
  title?: string;
  aspect?: '16:9' | '9:16';
};

function parseYouTubeStartTime(value: string | null): number | undefined {
  if (!value) return undefined;

  // Numeric seconds
  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  // Patterns like 1h2m3s or 2m10s etc.
  const timePattern = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/i;
  const match = value.match(timePattern);
  if (!match) return undefined;

  const [, hours, minutes, seconds] = match;
  const h = hours ? Number(hours) * 3600 : 0;
  const m = minutes ? Number(minutes) * 60 : 0;
  const s = seconds ? Number(seconds) : 0;

  const total = h + m + s;
  return total > 0 ? total : undefined;
}

export default function VideoEmbed({ src, poster, title = "Vidéo", aspect = '16:9' }: VideoEmbedProps) {
  // Détecte si c'est une URL YouTube
  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  const aspectPadding = aspect === '9:16' ? '177.78%' : '56.25%';
  
  if (isYouTube) {
    // Convertit l'URL YouTube en embed
    let embedUrl = src;
    try {
      const normalizedSrc = src.startsWith('http') ? src : `https://${src}`;
      const url = new URL(normalizedSrc);
      let videoId: string | null = null;

      if (url.hostname === 'youtu.be') {
        videoId = url.pathname.split('/').filter(Boolean)[0] || null;
      } else if (url.pathname.startsWith('/watch')) {
        videoId = url.searchParams.get('v');
      } else if (url.pathname.includes('/embed/')) {
        videoId = url.pathname.split('/').filter(Boolean).pop() || null;
      } else if (url.pathname.startsWith('/shorts/')) {
        const segments = url.pathname.split('/').filter(Boolean);
        videoId = segments[1] || null;
      } else if (url.hostname.includes('youtube.com')) {
        // Fallback for other youtube URLs (e.g., /live/<id>)
        const segments = url.pathname.split('/').filter(Boolean);
        if (segments.length > 0) {
          videoId = segments.pop() || null;
        }
      }

      if (videoId) {
        const params = new URLSearchParams({
          rel: '0',
          modestbranding: '1',
          playsinline: '1'
        });

        const startTime = parseYouTubeStartTime(url.searchParams.get('t') || url.searchParams.get('start'));
        if (startTime !== undefined) {
          params.set('start', String(startTime));
        }

        if (url.searchParams.get('autoplay') === '1') {
          params.set('autoplay', '1');
          params.set('mute', '1');
          params.set('loop', '1');
          params.set('playlist', videoId);
        }

        embedUrl = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
      }
    } catch (error) {
      console.warn('Impossible de parser l’URL YouTube fournie pour VideoEmbed:', error);
    }
    
    return (
      <div className="relative w-full" style={{ paddingBottom: aspectPadding }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-xl"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }
  
  // Sinon, vidéo locale classique
  return (
    <video
      controls
      playsInline
      preload="auto"
      poster={poster}
      className="w-full h-auto rounded-xl"
      style={{ maxHeight: '600px' }}
    >
      <source src={src} type="video/mp4" />
      Votre navigateur ne supporte pas la lecture de vidéos.
    </video>
  );
}

