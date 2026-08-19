/**
 * Splits a rich-text HTML string at the middle paragraph boundary so an
 * in-article ad can be injected between the two halves. Falls back to
 * rendering the whole thing unsplit (empty second half) for short posts —
 * an ad wedged after a single paragraph reads as spammy, not useful.
 */
export function splitHtmlForAd(html: string): [string, string] {
  const closings = [...html.matchAll(/<\/p>/gi)];
  if (closings.length < 4) return [html, ""];

  const mid = closings[Math.floor(closings.length / 2)];
  const idx = mid.index! + mid[0].length;
  return [html.slice(0, idx), html.slice(idx)];
}
