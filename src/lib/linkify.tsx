import type { ReactNode } from "react";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

/** Splits plain text on URLs and renders them as clickable new-tab links. */
export function linkify(text: string): ReactNode[] {
  // A single capturing group makes String.split() return the URLs
  // themselves interleaved at odd indices, so parity alone tells us
  // which parts are links, no restateful regex.test() re-scan needed.
  return text.split(URL_PATTERN).map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-80"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
}
