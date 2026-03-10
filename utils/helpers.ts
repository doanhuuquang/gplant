// Utility helper functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/**
 * Resolves a file URL.
 * - External URLs (http/https) are returned as-is.
 * - Internal paths (e.g. "/uploads/media/abc.jpg") get the API base URL prepended.
 * - Nullish / empty values return an empty string.
 */
export function getFileUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path}`;
}

export function parseTimeSpan(timespan: string) {
  // Format: d.hh:mm:ss.ffffff
  const regex = /^(\d+)\.(\d{2}):(\d{2}):(\d{2})\.(\d{1,7})$/;
  const match = timespan.match(regex);
  if (!match) return null;
  const [days, hours, minutes, seconds, fraction] = match;
  // .NET TimeSpan fractions are in 100-nanosecond units, but here we treat as milliseconds
  // Pad fraction to 3 digits for ms
  const ms = Math.round(parseInt(fraction.padEnd(7, "0").slice(0, 3)));
  return {
    days: parseInt(days, 10),
    hours: parseInt(hours, 10),
    minutes: parseInt(minutes, 10),
    seconds: parseInt(seconds, 10),
    milliseconds: ms,
  };
}

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export function classNames(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncates a string showing the beginning and end with "..." in the middle.
 * e.g. "Hôm nay tôi sẽ đi chơi và tạm biệt!" → "Hôm nay tôi sẽ...và tạm biệt!"
 */
export function truncateMiddle(text: string, maxLen: number = 30): string {
  if (text.length <= maxLen) return text;
  const head = Math.ceil(maxLen / 2);
  const tail = Math.floor(maxLen / 2);
  return `${text.slice(0, head)}...${text.slice(-tail)}`;
}
