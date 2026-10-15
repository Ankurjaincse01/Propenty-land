import dbConnect from "@/lib/mongoose";
import { getSettings } from "@/models/SiteSettings";
import { DEFAULT_SETTINGS, SiteSettingsData } from "@/lib/defaults";

/**
 * Load site settings for server components.
 * Falls back to safe defaults when the database is not reachable so the
 * marketing pages still render during local setup / first deploy.
 */
export async function loadSettings(): Promise<SiteSettingsData> {
  try {
    await dbConnect();
    const settings = await getSettings();
    const plain = JSON.parse(JSON.stringify(settings));
    return {
      ...DEFAULT_SETTINGS,
      ...plain,
      socialLinks: plain.socialLinks || {},
      seoDefaults: plain.seoDefaults || DEFAULT_SETTINGS.seoDefaults,
    };
  } catch (err) {
    console.warn("[settings] using defaults:", (err as Error).message);
    return DEFAULT_SETTINGS;
  }
}
