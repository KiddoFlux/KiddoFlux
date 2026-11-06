/**
 * Palette constants for places where Tailwind classes can't reach (SVG fills,
 * Animated styles). Keep in sync with `theme.extend.colors` in tailwind.config.js.
 */
export const colors = {
  mint: '#effbf5',
  navy: '#084887',
  peach: '#efa48b',
  ink: '#2d2e2e',
  steel: '#508ca4',
  sage: '#c2cfb2',
  // Tyre tints, used only by the loading wheel illustration.
  tyre: '#1d1e1e',
  tread: '#5b5e5e',
} as const;

export type ColorName = keyof typeof colors;
