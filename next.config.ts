import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Menu item photos uploaded to Supabase Storage (see src/lib/storage.ts)
    // are served from https://<project-ref>.supabase.co/storage/v1/object/public/...
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
};

export default nextConfig;
