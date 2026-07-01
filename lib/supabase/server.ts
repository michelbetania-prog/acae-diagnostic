/**
 * Supabase server adapter placeholder for the MVP.
 * Install `@supabase/ssr` and `@supabase/supabase-js`, then replace this
 * with `createServerClient` wired to Next cookies for production auth.
 */
export function createClient(): never {
  throw new Error("Supabase client is not installed. Run npm install @supabase/ssr @supabase/supabase-js and wire this adapter.");
}
