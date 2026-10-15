import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Block common malicious scanners targeting sensitive files or CMS paths
  const blockedPatterns = [
    /\/\.env/i,
    /\/\.git/i,
    /\/\.aws/i,
    /\/\.config/i,
    /\/wp-admin/i,
    /\/wp-login/i,
    /\/xmlrpc\.php/i,
    /\.php$/i,
    /\.bak$/i,
    /\.sql$/i,
  ];

  if (blockedPatterns.some((pattern) => pattern.test(pathname))) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  // 2. Protect sensitive /api/admin/* endpoints at the Edge (except public login endpoint)
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth/login")) {
    const authHeader = request.headers.get("authorization");
    const cookieToken = request.cookies.get("gl_token")?.value;
    if (!authHeader && !cookieToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin credentials required." },
        { status: 401 }
      );
    }
  }

  const response = NextResponse.next();

  // 3. Inject strict HTTP Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for static files & images
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
