export const isValidBannerUrl = (url: string): { valid: boolean; error?: string } => {
  if (!url) return { valid: true };

  try {
    const parsed = new URL(url);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Solo se permiten URLs con http:// o https://' };
    }

    if (/@/.test(url)) {
      return { valid: false, error: 'URL contiene caracteres no permitidos.' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'URL no válida. Debe comenzar con https://' };
  }
};
