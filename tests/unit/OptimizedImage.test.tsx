// tests/unit/OptimizedImage.test.tsx
// Unit test for the OptimizedImage wrapper. `next/image` is mocked because
// its real implementation relies on the Next.js optimizer, which is not
// available under vitest/jsdom.
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next/image', () => ({
  default: ({ src, alt, priority, loading, decoding, sizes, className }: { src: string; alt: string; priority?: boolean; loading?: string; decoding?: string; sizes?: string; className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} data-priority={priority ? 'true' : 'false'} data-loading={loading ?? ''} data-decoding={decoding ?? ''} data-sizes={sizes ?? ''} className={className} />
  )
}));

import OptimizedImage from '@/components/OptimizedImage';

describe('OptimizedImage', () => {
  it('passes source and alt through to next/image', () => {
    render(<OptimizedImage src="/logo.svg" alt="brand" width={28} height={28} />);
    const img = screen.getByAltText('brand') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('/logo.svg');
  });

  it('defaults to lazy loading and async decoding for non-priority images', () => {
    render(<OptimizedImage src="/logo.svg" alt="brand" width={28} height={28} />);
    const img = screen.getByAltText('brand');
    expect(img).toHaveAttribute('data-loading', 'lazy');
    expect(img).toHaveAttribute('data-decoding', 'async');
    expect(img).toHaveAttribute('data-priority', 'false');
  });

  it('uses eager loading and priority when flagged', () => {
    render(<OptimizedImage src="/logo.svg" alt="brand" width={28} height={28} priority />);
    const img = screen.getByAltText('brand');
    expect(img).toHaveAttribute('data-priority', 'true');
    expect(img).toHaveAttribute('data-loading', '');
  });

  it('forwards a custom sizes attribute', () => {
    render(<OptimizedImage src="/logo.svg" alt="brand" width={28} height={28} sizes="(max-width: 480px) 50vw, 100px" />);
    const img = screen.getByAltText('brand');
    expect(img).toHaveAttribute('data-sizes', '(max-width: 480px) 50vw, 100px');
  });
});
