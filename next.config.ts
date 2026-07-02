import type { NextConfig } from "next";
import { fileURLToPath } from "url";
import path from "path";

// Pin the workspace root to this folder — the site lives in a subdirectory of
// a larger repo, and without this Turbopack infers the wrong root and warns.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
