const defaultTenantSlug =
  process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG ?? "demo";

export function detectTenantSlug(hostname?: string): string {
  if (!hostname) {
    if (typeof window === "undefined") {
      return defaultTenantSlug;
    }
    hostname = window.location.hostname;
  }

  const cleanHost = hostname.toLowerCase().trim();
  const parts = cleanHost.split(".");

  if (parts.length >= 3) {
    return parts[0];
  }

  if (parts.length === 2 && parts[1] === "localhost") {
    return parts[0];
  }

  return defaultTenantSlug;
}
