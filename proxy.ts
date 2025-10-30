import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_HOSTNAMES = ["fetrabeauty.com", "www.fetrabeauty.com"];

export default function proxy(request: NextRequest) {
  // Skip all processing in development
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // Skip for localhost and development URLs
  const host = request.headers.get("host") || "";
  if (host.includes("localhost") || host.includes("127.0.0.1") || host.includes(":3000")) {
    return NextResponse.next();
  }

  const hostOnly = host.split(":")[0];
  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");

  // If already on allowed hostname with HTTPS, continue
  if (ALLOWED_HOSTNAMES.includes(hostOnly) && proto === "https") {
    return NextResponse.next();
  }

  // Redirect to www.fetrabeauty.com with HTTPS (production only)
  const url = request.nextUrl.clone();
  url.hostname = "www.fetrabeauty.com";
  url.protocol = "https";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets|favicon.ico).*)"]
};

