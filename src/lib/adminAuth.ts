import { supabase } from '@/integrations/supabase/client';

export async function invokeAdminAuth<T extends Record<string, unknown>>(
  body: Record<string, unknown>,
): Promise<T> {
  const { data, error } = await supabase.functions.invoke('admin-auth', { body });

  if (error) {
    let message = error.message;
    if ('context' in error && error.context instanceof Response) {
      const payload: unknown = await error.context.clone().json().catch(() => null);
      if (
        payload &&
        typeof payload === 'object' &&
        'error' in payload &&
        typeof payload.error === 'string'
      ) {
        message = payload.error;
      }
    }
    throw new Error(message);
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Admin authentication returned an invalid response');
  }
  return data as T;
}
