import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIMARY_HOSTNAME = "fetrabeauty.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");

  const url = request.nextUrl.clone();

  // If already on primary hostname with HTTPS, continue
  if (host === PRIMARY_HOSTNAME && proto === "https") {
    return NextResponse.next();
  }

  // Redirect to primary hostname with HTTPS
  url.hostname = PRIMARY_HOSTNAME;
  url.protocol = "https";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets|favicon.ico).*)"]
};

