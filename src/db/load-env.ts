import { config } from "dotenv";

// Loaded as a side-effect import so it runs before any other import in the
// importing file. Plain function calls placed "before" other imports don't
// actually run first — TypeScript/ESM hoists all import statements above
// other top-level code, so a module that throws on a missing env var (like
// db/index.ts) would otherwise evaluate before these config() calls do.
config({ path: ".env.local" });
config();
