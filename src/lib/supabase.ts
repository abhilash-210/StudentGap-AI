import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

export const SUPABASE_KEYS = {
  URL: 'gapfinder_supabase_url',
  ANON_KEY: 'gapfinder_supabase_anon_key',
};

/**
 * Returns current Supabase connection configuration, checking process.env first,
 * then falling back to localStorage if set dynamically in the UI.
 */
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem(SUPABASE_KEYS.URL);
    const localKey = localStorage.getItem(SUPABASE_KEYS.ANON_KEY);
    if (localUrl) url = localUrl;
    if (localKey) anonKey = localKey;
  }

  return { url: url.trim(), anonKey: anonKey.trim() };
}

/**
 * Checks whether Supabase credentials have been configured.
 */
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('http'));
}

/**
 * Returns the initialized Supabase client singleton, or null if unconfigured.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey || !url.startsWith('http')) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: typeof window !== 'undefined',
        autoRefreshToken: true,
      },
    });
  }

  return cachedClient;
}

/**
 * Saves dynamic Supabase credentials to localStorage and clears cache.
 */
export function saveSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    if (url && anonKey) {
      localStorage.setItem(SUPABASE_KEYS.URL, url.trim());
      localStorage.setItem(SUPABASE_KEYS.ANON_KEY, anonKey.trim());
    } else {
      localStorage.removeItem(SUPABASE_KEYS.URL);
      localStorage.removeItem(SUPABASE_KEYS.ANON_KEY);
    }
  }
  cachedClient = null;
}

/**
 * Tests connection to the configured Supabase instance.
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Supabase URL and Anon Key are missing or incomplete.' };
    }

    // Ping auth or public query
    const { error } = await client.from('courses').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, try basic auth health
      const { error: authErr } = await client.auth.getSession();
      if (authErr) {
        return { success: false, message: `Connection error: ${error.message}` };
      }
    }

    return { success: true, message: 'Successfully connected to Supabase PostgreSQL!' };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, message: `Failed to reach Supabase: ${msg}` };
  }
}
