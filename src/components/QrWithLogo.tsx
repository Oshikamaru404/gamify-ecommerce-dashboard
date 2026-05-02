import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface QrWithLogoProps {
  /** Data encoded in the QR (URI or address). */
  value: string;
  /** Optional URL of a logo to draw at the center. */
  logoUrl?: string;
  /** QR pixel size (square). Default 240. */
  size?: number;
  /** Logo size relative to QR (0–0.3). Default 0.22. */
  logoRatio?: number;
  /** Alt text for accessibility. */
  alt?: string;
  className?: string;
}

/**
 * Renders a QR code with high error-correction (level H — ~30% redundancy)
 * and overlays a small logo in the center. The high ECC means up to ~25% of
 * the modules can be obscured without breaking scanability, so a centered
 * logo of ~22% width is safe across all major wallet scanners.
 */
export const QrWithLogo = ({
  value,
  logoUrl,
  size = 240,
  logoRatio = 0.22,
  alt = 'QR code',
  className,
}: QrWithLogoProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      // 1) Draw QR with maximum error-correction so center can be covered.
      await QRCode.toCanvas(canvas, value, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: size,
        color: { dark: '#000000', light: '#ffffff' },
      });

      // 2) Overlay logo (with white rounded background so it stays readable).
      if (logoUrl) {
        try {
          const img = await loadImage(logoUrl);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const logoSize = Math.round(size * logoRatio);
            const pad = Math.round(logoSize * 0.18);
            const boxSize = logoSize + pad * 2;
            const x = (size - boxSize) / 2;
            const y = (size - boxSize) / 2;
            const radius = Math.round(boxSize * 0.18);

            // White rounded backdrop
            ctx.fillStyle = '#ffffff';
            roundedRect(ctx, x, y, boxSize, boxSize, radius);
            ctx.fill();

            // Logo
            ctx.drawImage(img, x + pad, y + pad, logoSize, logoSize);
          }
        } catch {
          // Logo failed to load — leave plain QR.
        }
      }

      if (!cancelled) {
        setDataUrl(canvas.toDataURL('image/png'));
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [value, logoUrl, size, logoRatio]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {dataUrl ? (
        <img src={dataUrl} alt={alt} width={size} height={size} className={className} />
      ) : (
        <div
          className={className}
          style={{ width: size, height: size, background: '#fff' }}
          aria-label={alt}
        />
      )}
    </>
  );
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
