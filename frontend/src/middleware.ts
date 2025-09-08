import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  // We are storing token in localStorage on client; cookies are not available here.
  // To keep a simple guard, allow public pages and protect /dashboard client-side.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};


