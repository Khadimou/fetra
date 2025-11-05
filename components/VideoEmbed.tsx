'use client';

type VideoEmbedProps = {
  src: string;
  poster?: string;
  title?: string;
};

export default function VideoEmbed({ src, poster, title = "Vidéo" }: VideoEmbedProps) {
  // Détecte si c'est une URL YouTube
  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  
  if (isYouTube) {
    // Convertit l'URL YouTube en embed
    let embedUrl = src;
    if (src.includes('watch?v=')) {
      const videoId = src.split('watch?v=')[1].split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (src.includes('youtu.be/')) {
      const videoId = src.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    
    return (
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-xl"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

