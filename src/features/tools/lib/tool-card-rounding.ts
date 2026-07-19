/**
 * Computes the Tailwind corner-rounding classes for a `ToolCard` at `index`
 * within a grid of `total` cards, matching the outer corners of a
 * 2-col-desktop / 1-col-mobile grid so each card's corner radius lines up
 * with the container's rounded outer edge (the container uses
 * `overflow-hidden`, so a card that should sit at an outer corner but isn't
 * rounded there gets visibly clipped into a sharp corner).
 *
 * Unlike a fixed-size grid, the tool catalog's item count changes at
 * runtime (search/category filtering), so corners are computed from
 * `(index, total)` instead of hardcoded per position. When `total` is odd,
 * the last card is alone in the final row — it spans both desktop columns
 * (`sm:col-span-2`) and owns both of its own bottom corners, instead of
 * leaving a missing corner where an absent second card would have been.
 *
 * @param {number} index - Zero-based position of the card in the filtered list.
 * @param {number} total - Total number of cards currently rendered.
 * @returns {string} Space-separated Tailwind classes for `ToolCard`'s `roundedClassName` prop.
 */
export function getToolCardRounding(index: number, total: number): string {
  if (total <= 0) return ''
  if (total === 1) return 'rounded-[14px]'

  const isOdd = total % 2 === 1
  const isFirst = index === 0
  const isLast = index === total - 1
  const classes: string[] = []

  if (isFirst) classes.push('rounded-tl-[14px]', 'rounded-tr-[14px]')
  if (isLast) classes.push('rounded-bl-[14px]', 'rounded-br-[14px]')

  if (isOdd && isLast) {
    classes.push('sm:col-span-2')
    return classes.join(' ')
  }

  if (isFirst) classes.push('sm:rounded-tr-none')
  if (index === 1) classes.push('sm:rounded-tr-[14px]')
  if (!isOdd) {
    if (index === total - 2) classes.push('sm:rounded-bl-[14px]')
    if (isLast) classes.push('sm:rounded-bl-none')
  }

  return classes.join(' ')
}
