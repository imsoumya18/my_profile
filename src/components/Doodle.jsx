// Small hand-drawn-style line icons, scattered as low-opacity background
// decoration — a personal touch nodding to ML work and the "Beyond Code" side
// (trekking, reading, photography) without competing with real content.
const PATHS = {
  mountain: 'M4 42 L20 14 L28 26 L38 8 L46 42 Z M35 15 l3 -7 l3 7',
  compass: 'M24 6a18 18 0 1 0 0.1 0z M24 24l7 -13 -4 13 -3 13 -4-13z',
  camera: 'M6 15h7l3-5h16l3 5h7v23H6z M24 19a7.5 7.5 0 1 0 0.1 0z',
  coffee: 'M9 15h23v13a8 8 0 0 1-8 8H17a8 8 0 0 1-8-8z M32 17h4a5 5 0 0 1 0 10h-4 M14 8c1-2 3-2 3-4 M21 8c1-2 3-2 3-4 M28 8c1-2 3-2 3-4',
  book: 'M5 10c6-3 13-3 19 0c6-3 13-3 19 0v26c-6-3-13-3-19 0c-6-3-13-3-19 0z M24 10v26',
  brackets: 'M18 8L6 24l12 16 M30 8l12 16-12 16',
  footprints: 'M10 6c3 0 4 3 4 6s-1 6-4 6-4-3-4-6 1-6 4-6z M18 18c3 0 4 3 4 6s-1 6-4 6-4-3-4-6 1-6 4-6z M10 30c3 0 4 3 4 6s-1 6-4 6-4-3-4-6 1-6 4-6z',
  chip: 'M14 14h20v20h-20z M8 18h6 M8 24h6 M8 30h6 M34 18h6 M34 24h6 M34 30h6 M18 8v6 M24 8v6 M30 8v6 M18 34v6 M24 34v6 M30 34v6',
  neuralnet: 'M8,14 L24,18 M8,14 L24,30 M8,24 L24,18 M8,24 L24,30 M8,34 L24,18 M8,34 L24,30 M24,18 L40,24 M24,30 L40,24 M5.5,14 a2.5,2.5 0 1,0 5,0 a2.5,2.5 0 1,0 -5,0 M5.5,24 a2.5,2.5 0 1,0 5,0 a2.5,2.5 0 1,0 -5,0 M5.5,34 a2.5,2.5 0 1,0 5,0 a2.5,2.5 0 1,0 -5,0 M21.5,18 a2.5,2.5 0 1,0 5,0 a2.5,2.5 0 1,0 -5,0 M21.5,30 a2.5,2.5 0 1,0 5,0 a2.5,2.5 0 1,0 -5,0 M37.5,24 a2.5,2.5 0 1,0 5,0 a2.5,2.5 0 1,0 -5,0',
  trophy: 'M16 8h16v9c0 6.5-4.5 12-8 12s-8-5.5-8-12z M16 10c-4 0-6 2-6 5s2 6 6 7 M32 10c4 0 6 2 6 5s-2 6-6 7 M24 29v7 M16 40c0-2 1.5-4 8-4s8 2 8 4 M18 40h12',
  terminal: 'M6 16h36v22a2 2 0 0 1-2 2h-32a2 2 0 0 1-2-2z M6 16v-4a2 2 0 0 1 2-2h32a2 2 0 0 1 2 2v4 M11 12.5h.01 M16 12.5h.01 M21 12.5h.01 M13 24l6 5-6 5 M24 34h10',
  aperture: 'M24,8 a16,16 0 1,0 0.01,0 M24,10 L24,18 M35.8,17 L29,21.5 M35.8,31 L29,26.5 M24,38 L24,30 M12.2,31 L19,26.5 M12.2,17 L19,21.5',
}

export default function Doodle({ type, size = 56, rotate = 0, opacity = 0.16, color = '#241c10', className = '' }) {
  const d = PATHS[type]
  if (!d) return null
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={{ transform: `rotate(${rotate}deg)`, opacity, color }}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}
