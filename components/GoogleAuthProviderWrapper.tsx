"use client";

import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "demo-client-id.apps.googleusercontent.com";

export function GoogleAuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
