// src/components/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Thin wrapper around next/image that applies the project's image
 * optimization defaults: modern formats (AVIF/WebP), a responsive `srcset`
 * via `sizes`, and lazy/async decoding. Use this anywhere we render imagery
 * (logos, avatars, uploaded media) so the optimizer only ships what the
 * client needs.
 */
export default function OptimizedImage({ src, alt, width, height, className, priority = false, sizes = '(max-width: 768px) 100vw, 768px' }: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      loading={priority ? undefined : 'lazy'}
      decoding="async"
      style={width && height ? undefined : { width: 'auto', height: 'auto' }}
    />
  );
}
