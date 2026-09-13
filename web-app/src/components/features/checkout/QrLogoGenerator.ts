/**
 * QR Ph Standard Vector Logo Generator
 *
 * Produces a geometrically accurate, scalable SVG Data URI of the Bangko Sentral ng Pilipinas
 * (BSP) QR Ph national QR standard emblem.
 *
 * Color Specification:
 * - Blue Top-Left Bracket: #203a70
 * - Red Bottom-Right Bracket: #ce2029
 * - Center Circle: #fcd116
 */
export function getVectorLogoDataUri(): string {
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <!-- Blue Top-Left L-Shape -->
      <path d="M 20 65 V 35 Q 20 20, 35 20 H 65 L 75 30 L 65 40 H 35 Q 30 40, 30 45 V 65 Z" fill="#203a70" />
      
      <!-- Red Bottom-Right L-Shape -->
      <path d="M 80 35 V 65 Q 80 80, 65 80 H 35 L 25 70 L 35 60 H 65 Q 70 60, 70 55 V 35 Z" fill="#ce2029" />
      
      <!-- Yellow Center Circle -->
      <circle cx="50" cy="50" r="16" fill="#fcd116" />
    </svg>
  `.trim();

  // encodeURIComponent produces a UTF-8 compatible Data URI that avoids Latin-1 / btoa limitations
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
}

