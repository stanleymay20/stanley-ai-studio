/** Public portfolio links accept web URLs and local files, never executable schemes. */
export function publicUrl(value: string | null | undefined): string | null {
  const text = value?.trim();
  if (!text) return null;
  if (text.startsWith("/") && !text.startsWith("//")) return text;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}
