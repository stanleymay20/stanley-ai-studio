/**
 * Convert various video URLs (YouTube, Vimeo, Loom) into embeddable iframe URLs.
 * Returns null if the URL cannot be embedded (falls back to external link).
 */
export const getEmbedUrl = (url: string | null | undefined): string | null => {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();

  try {
    // Normalize: add protocol if missing
    const normalized = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    const u = new URL(normalized);
    const host = u.hostname.replace(/^www\./, '');

    // YouTube
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (u.pathname === '/watch') {
        const id = u.searchParams.get('v');
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
      if (u.pathname.startsWith('/embed/')) return normalized;
      if (u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.split('/')[2];
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
    }
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    // Vimeo
    if (host === 'vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
    if (host === 'player.vimeo.com') {
      return normalized;
    }

    // Loom
    if (host === 'loom.com') {
      if (u.pathname.startsWith('/share/')) {
        const id = u.pathname.split('/')[2];
        if (id) return `https://www.loom.com/embed/${id}`;
      }
      if (u.pathname.startsWith('/embed/')) return normalized;
    }

    // Direct video file
    if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(u.pathname)) {
      return normalized;
    }

    return null;
  } catch {
    return null;
  }
};

export const isDirectVideoFile = (url: string): boolean => {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
};
