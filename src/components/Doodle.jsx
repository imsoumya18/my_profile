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
