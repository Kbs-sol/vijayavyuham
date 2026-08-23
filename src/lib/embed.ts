// ============================================================
// Universal embed resolver for the Gallery.
// ------------------------------------------------------------
// The admin pastes ANY hosting link (Cloudinary image or video,
// a YouTube URL, or a direct image/video URL). We detect the type
// and produce a normalized descriptor the view can render safely.
// ============================================================

export type EmbedKind = 'image' | 'video' | 'youtube' | 'iframe' | 'unknown';

export interface Embed {
  kind: EmbedKind;
  src: string;        // the media/iframe src to use
  thumbnail?: string; // best-effort poster/thumbnail
  provider?: string;  // 'youtube' | 'cloudinary' | 'vimeo' | ...
}

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg|bmp)(\?|#|$)/i;
const VIDEO_EXT = /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i;

function youTubeId(url: string): string | null {
  // handles youtu.be/ID, youtube.com/watch?v=ID, /embed/ID, /shorts/ID
  const patterns = [
    /youtu\.be\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/watch\?[^#]*\bv=([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/,
    /youtube\.com\/live\/([A-Za-z0-9_-]{6,})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

export function resolveEmbed(rawUrl: string): Embed {
  const url = (rawUrl || '').trim();
  if (!url) return { kind: 'unknown', src: '' };

  // YouTube
  const yt = youTubeId(url);
  if (yt) {
    return {
      kind: 'youtube',
      provider: 'youtube',
      src: `https://www.youtube-nocookie.com/embed/${yt}`,
      thumbnail: `https://img.youtube.com/vi/${yt}/hqdefault.jpg`,
    };
  }

  // Vimeo
  const vm = vimeoId(url);
  if (vm) {
    return { kind: 'iframe', provider: 'vimeo', src: `https://player.vimeo.com/video/${vm}` };
  }

  const isCloudinary = /res\.cloudinary\.com/i.test(url);

  // Explicit video file (incl. Cloudinary /video/ delivery)
  if (VIDEO_EXT.test(url) || (isCloudinary && /\/video\//i.test(url))) {
    return { kind: 'video', provider: isCloudinary ? 'cloudinary' : undefined, src: url };
  }

  // Explicit image file (incl. Cloudinary /image/ delivery)
  if (IMAGE_EXT.test(url) || (isCloudinary && /\/image\//i.test(url))) {
    return { kind: 'image', provider: isCloudinary ? 'cloudinary' : undefined, src: url };
  }

  // Cloudinary without a clear extension -> treat as image by default
  if (isCloudinary) return { kind: 'image', provider: 'cloudinary', src: url };

  // Fallback: assume it's an image URL (most pasted links are images)
  return { kind: 'image', src: url };
}
