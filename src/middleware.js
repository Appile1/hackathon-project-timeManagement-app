import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/signin",
  "/signup",
  "/",
  "/generate",
]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const currentUrl = new URL(req.url);
  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  return NextResponse.next(); // Continue to the next middleware or route handler
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
