import { loadSettings } from "@/lib/settings";
import { ok, routeHandler } from "@/lib/http";

export const dynamic = "force-dynamic";

export const GET = routeHandler(async () => {
  const settings = await loadSettings();
  return ok(settings);
});

