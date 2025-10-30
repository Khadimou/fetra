import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_HOSTNAMES = ["fetrabeauty.com", "www.fetrabeauty.com"];

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");

  // If already on allowed hostname with HTTPS, continue
  if (ALLOWED_HOSTNAMES.includes(host) && proto === "https") {
    return NextResponse.next();
  }

  // Redirect to www.fetrabeauty.com with HTTPS
  const url = request.nextUrl.clone();
  url.hostname = "www.fetrabeauty.com";
  url.protocol = "https";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets|favicon.ico).*)"]
};

