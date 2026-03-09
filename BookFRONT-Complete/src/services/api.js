const DEFAULT_PROD_API_BASE_URL = 'https://book-2-m704.onrender.com';
const rawApiBaseUrl = process.env.REACT_APP_API_BASE_URL?.trim();
const normalizedApiBaseUrl = rawApiBaseUrl?.replace(/^['"]|['"]$/g, '');
const isProductionBuild = process.env.NODE_ENV === 'production';

const isBrowser = typeof window !== 'undefined';
const isLocalFrontend =
  isBrowser && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const isLocalApiUrl =
  !!normalizedApiBaseUrl &&
  /^(https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(normalizedApiBaseUrl);

const resolvedApiBaseUrl = (() => {
  if (normalizedApiBaseUrl) {
    if (isLocalApiUrl && (isProductionBuild || !isLocalFrontend)) {
      console.warn(
        `REACT_APP_API_BASE_URL=${normalizedApiBaseUrl} invalida para ambiente publicado. Usando ${DEFAULT_PROD_API_BASE_URL}.`
      );
      return DEFAULT_PROD_API_BASE_URL;
    }
    return normalizedApiBaseUrl;
  }

  return isLocalFrontend ? 'http://localhost:5165' : DEFAULT_PROD_API_BASE_URL;
})();

const API_BASE_URL = resolvedApiBaseUrl.replace(/\/+$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof body === 'object' && body?.message
      ? body.message
      : `Erro HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return body;
}

export async function getOrCreateUsuario(nome) {
  const usuarios = await request('/api/Usuarios');
  const usuarioExistente = usuarios.find(
    (usuario) => usuario.nome?.trim().toLowerCase() === nome.trim().toLowerCase()
  );

  if (usuarioExistente) {
    return usuarioExistente;
  }

  return request('/api/Usuarios', {
    method: 'POST',
    body: JSON.stringify({ nome: nome.trim() })
  });
}

export async function getUsuarioById(usuarioId) {
  try {
    return await request(`/api/Usuarios/${usuarioId}`);
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

export function getLivros(usuarioId) {
  return request(`/api/Livros?usuarioId=${usuarioId}`);
}

export function createLivro(payload) {
  return request('/api/Livros', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateLivro(livroId, payload) {
  return request(`/api/Livros/${livroId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteLivro(livroId) {
  return request(`/api/Livros/${livroId}`, {
    method: 'DELETE'
  });
}

export async function getMetaPorUsuario(usuarioId, ano) {
  try {
    return await request(`/api/MetaLeitura/usuario/${usuarioId}?ano=${ano}`);
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

export function createMeta(payload) {
  return request('/api/MetaLeitura', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateMeta(metaId, payload) {
  return request(`/api/MetaLeitura/${metaId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export async function getDesafioPorUsuario(usuarioId, ano) {
  try {
    return await request(`/api/DesafioAZ/usuario/${usuarioId}?ano=${ano}`);
  } catch (error) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

export function createDesafio(payload) {
  return request('/api/DesafioAZ', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateLetraDesafio(desafioId, payload) {
  return request(`/api/DesafioAZ/${desafioId}/letra`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function limparLetraDesafio(desafioId, letra) {
  return request(`/api/DesafioAZ/${desafioId}/letra/${letra}`, {
    method: 'DELETE'
  });
}

export function getCalendarioAnual(usuarioId, ano) {
  return request(`/api/Calendario/usuario/${usuarioId}/ano/${ano}`);
}

export function salvarMesCalendario(usuarioId, ano, mes, quantidadeLivros) {
  return request(`/api/Calendario/usuario/${usuarioId}/ano/${ano}/mes/${mes}`, {
    method: 'PUT',
    body: JSON.stringify({ quantidadeLivros })
  });
}

// Proxima Leitura
export async function getProximasLeituras(usuarioId) {
  try {
    return await request(`/api/ProximaLeitura?usuarioId=${usuarioId}`);
  } catch (error) {
    if (error.status === 404) {
      return [];
    }
    throw error;
  }
}

export function createProximaLeitura(payload) {
  return request('/api/ProximaLeitura', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function deleteProximaLeitura(id) {
  return request(`/api/ProximaLeitura/${id}`, {
    method: 'DELETE'
  });
}
