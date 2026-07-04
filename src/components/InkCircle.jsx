// Hand-drawn circle marks — imperfect, slightly different each time, ending in a
// small overshoot tail where the "pen" crosses back over itself, like a real annotation.
const PATHS = [
  'M 13.3,21.1 C 15.8,16.3 20.6,12.9 27.9,10.5 C 35.3,8.1 48.1,6.2 57.3,6.7 C 66.5,7.2 77.9,9.6 83.1,13.5 C 88.3,17.3 88.6,24.7 88.8,30.0 C 88.9,35.3 89.4,41.7 84.2,45.2 C 79.0,48.6 66.8,49.6 57.7,50.7 C 48.5,51.8 36.7,53.9 29.2,51.9 C 21.7,50.0 15.2,44.3 12.6,39.1 C 9.9,34.0 10.7,25.9 13.3,21.1 C 4,25.5 9,28 15,25.5',
  'M 11.9,22.5 C 15.0,17.9 20.8,14.0 28.4,11.4 C 36.0,8.9 48.8,6.6 57.3,7.2 C 65.9,7.7 74.3,10.7 79.5,14.5 C 84.6,18.4 88.3,25.1 88.3,30.0 C 88.3,34.9 84.7,39.6 79.5,43.8 C 74.4,48.1 65.4,54.7 57.2,55.6 C 49.0,56.5 38.4,52.1 30.5,49.3 C 22.6,46.6 12.7,43.6 9.6,39.1 C 6.5,34.7 8.7,27.1 11.9,22.5 C 3,23 8,26.5 16,24',
  'M 12.3,21.4 C 14.7,16.4 20.8,9.6 28.3,7.4 C 35.7,5.2 48.2,6.6 56.9,8.0 C 65.5,9.3 73.8,12.0 80.0,15.6 C 86.2,19.3 93.5,25.2 93.9,30.0 C 94.3,34.8 88.5,40.5 82.4,44.3 C 76.2,48.2 66.1,52.1 57.0,53.2 C 47.9,54.4 34.8,53.9 27.6,51.3 C 20.5,48.8 16.7,42.7 14.2,37.7 C 11.6,32.8 10.0,26.5 12.3,21.4 C 5,26 11,29 17,26',
]

// Wraps its children with an imperfect hand-drawn circle, evenly padded so the
// mark centers on the content regardless of text length.
export default function InkCircle({ children, color = '#d6870f', variant = 0, padX = 16, padY = 10, strokeWidth = 4 }) {
  return (
    <span className="relative inline-flex" style={{ padding: `${padY}px ${padX}px` }}>
      <span className="relative z-10">{children}</span>
      <svg
        className="absolute inset-0"
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ overflow: 'visible' }}
      >
        <path d={PATHS[variant % PATHS.length]} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      </svg>
    </span>
  )
}
