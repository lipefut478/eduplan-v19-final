import { toast } from './toast';
import { messageFromSupabaseError } from './messages';

type SupabaseResult<T> = { data: T | null; error: { message?: string; code?: string } | null };

export async function dbQuery<T>(
  fn: () => Promise<SupabaseResult<T>>,
): Promise<T | null> {
  try {
    const { data, error } = await fn();
    if (error) { toast.error(messageFromSupabaseError(error)); return null; }
    return data;
  } catch {
    toast.error('Erro inesperado. Verifique sua conexão.');
    return null;
  }
}
