export const MESSAGES = {
  errors: {
    network:          'Sem conexão com o servidor. Tente novamente.',
    unauthorized:     'Sua sessão expirou. Faça login novamente.',
    forbidden:        'Você não tem permissão para fazer isso.',
    notFound:         'Não encontramos o que você procura.',
    serverError:      'Algo deu errado do nosso lado. Já estamos verificando.',
    rateLimit:        'Muitas tentativas. Aguarde um momento.',
    aiQuotaExceeded:  'Você atingiu o limite de uso da IA por hoje.',
    aiUnavailable:    'Assistente IA indisponível. Tente novamente mais tarde.',
    validation:       'Verifique os campos destacados.',
    unknown:          'Ocorreu um erro inesperado.',
    saveFailure:      'Não foi possível salvar. Verifique sua conexão.',
    loadFailure:      'Não foi possível carregar os dados.',
    deleteFailure:    'Não foi possível excluir. Tente novamente.',
  },
  success: {
    saved:    'Salvo com sucesso!',
    deleted:  'Excluído com sucesso!',
    updated:  'Atualizado com sucesso!',
    created:  'Criado com sucesso!',
    copied:   'Copiado!',
    exported: 'Arquivo exportado com sucesso!',
    aiDone:   'Treino gerado pela IA com sucesso!',
  },
  loading: {
    saving:     'Salvando...',
    loading:    'Carregando...',
    deleting:   'Excluindo...',
    aiThinking: 'A IA está criando seu treino...',
    exporting:  'Gerando arquivo...',
  },
} as const;

// Helper para mapear HTTP status codes em mensagens amigáveis
export function messageFromStatus(status: number): string {
  if (status === 401) return MESSAGES.errors.unauthorized;
  if (status === 403) return MESSAGES.errors.forbidden;
  if (status === 404) return MESSAGES.errors.notFound;
  if (status === 429) return MESSAGES.errors.rateLimit;
  if (status >= 500)  return MESSAGES.errors.serverError;
  return MESSAGES.errors.unknown;
}

// Helper para mapear erros do Supabase em mensagens amigáveis
export function messageFromSupabaseError(error: { message?: string; code?: string } | null): string {
  if (!error) return MESSAGES.errors.unknown;
  const msg = error.message?.toLowerCase() ?? '';
  if (msg.includes('network') || msg.includes('fetch')) return MESSAGES.errors.network;
  if (msg.includes('jwt') || msg.includes('session') || msg.includes('auth')) return MESSAGES.errors.unauthorized;
  if (msg.includes('permission') || msg.includes('policy')) return MESSAGES.errors.forbidden;
  return error.message ?? MESSAGES.errors.unknown;
}
