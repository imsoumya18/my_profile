// Not in lucide-react — traced from Tabler Icons' "brand-leetcode" (MIT),
// kept in the same stroke/viewBox convention as lucide so it drops into the
// Contact icon map like any other.
export default function LeetCodeIcon({ size = 17, strokeWidth = 1.5, style, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      <path d="M12 13h7.5" />
      <path d="M9.424 7.268l4.999 -4.999" />
      <path d="M16.633 16.644l-2.402 2.415a3.189 3.189 0 0 1 -4.524 0l-3.77 -3.787a3.223 3.223 0 0 1 0 -4.544l3.77 -3.787a3.189 3.189 0 0 1 4.524 0l2.302 2.313" />
    </svg>
  )
}
