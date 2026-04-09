import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const clerkMiddleware = ClerkExpressRequireAuth();

export const requireAuth = (req, res, next) => {
  // TEST BYPASS
  if (process.env.NODE_ENV === "test") {
    req.auth = { clerkId: "test-clerk-id" };
    return next();
  }

  return clerkMiddleware(req, res, next);
};