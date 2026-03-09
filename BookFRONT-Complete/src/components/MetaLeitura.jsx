import React, { useState, useEffect } from 'react';
import { createMeta, getMetaPorUsuario, updateMeta } from '../services/api';

function MetaLeitura({ usuarioId }) {
  const [meta, setMeta] = useState(0);
  const [livrosLidos, setLivrosLidos] = useState(0);
  const [metaId, setMetaId] = useState(null);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [generos, setGeneros] = useState({
    Romance: 0,
    'Dark Romance': 0,
    'Máfia': 0
  });
  const anoAtual = new Date().getFullYear();

  useEffect(() => {
    async function carregarMeta() {
      if (!usuarioId) return;

      try {
        setErro('');
        const metaApi = await getMetaPorUsuario(usuarioId, anoAtual);

        if (!metaApi) {
          setMetaId(null);
          setMeta(0);
          setLivrosLidos(0);
          return;
        }

        setMetaId(metaApi.id);
        setMeta(metaApi.quantidadeObejetivo ?? metaApi.quantidadeObjetivo ?? 0);
        setLivrosLidos(metaApi.quantidadeLida || 0);
        setGeneros(
          metaApi.generosMaisLidos && Object.keys(metaApi.generosMaisLidos).length > 0
            ? metaApi.generosMaisLidos
            : { Romance: 0, 'Dark Romance': 0, 'Máfia': 0 }
        );
      } catch (error) {
        setErro(error.message || 'Nao foi possivel carregar a meta de leitura.');
      }
    }

    carregarMeta();
  }, [usuarioId, anoAtual]);

  const handleSalvarMeta = async () => {
    if (!usuarioId || meta < 1) {
      setErro('Informe uma meta valida para salvar.');
      return;
    }

    try {
      setErro('');
      setSalvando(true);

      if (metaId) {
        await updateMeta(metaId, { quantidadeObejetivo: meta });
      } else {
        const criada = await createMeta({
          ano: anoAtual,
          quantidadeObejetivo: meta,
          usuarioId
        });
        setMetaId(criada.id);
      }

      alert(`Meta de ${meta} livros definida!`);
    } catch (error) {
      setErro(error.message || 'Nao foi possivel salvar a meta de leitura.');
    } finally {
      setSalvando(false);
    }
  };

  const generoMaisLido = Object.entries(generos).reduce((a, b) => 
    generos[a[0]] > generos[b[0]] ? a : b
  )[0];

  return (
    <div>
      <div className="header-title">
        Meta De Leitura
      </div>

      <div className="container">
        {!!erro && (
          <div style={{
            background: '#FECACA',
            border: '1px solid #F87171',
            color: '#7F1D1D',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px'
          }}>
            {erro}
          </div>
        )}

        <div className="card">
          <div className="meta-container">
            <div style={{ marginBottom: '30px' }}>
              <label className="input-label">Defina sua meta anual de livros</label>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
                <input
                  type="number"
                  min="1"
                  className="input-field"
                  style={{ maxWidth: '200px', textAlign: 'center', fontSize: '24px' }}
                  placeholder="0"
                  value={meta || ''}
                  onChange={(e) => setMeta(parseInt(e.target.value) || 0)}
                />
                <button className="btn" onClick={handleSalvarMeta} disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Definir Meta'}
                </button>
              </div>
            </div>

            <div className="progress-circle">
              {livrosLidos}/{meta || 0}
            </div>

            <p style={{ fontSize: '18px', color: '#8B5A6F', marginBottom: '40px' }}>
              {meta > 0 ? `${Math.round((livrosLidos / meta) * 100)}% da meta alcançada` : 'Defina uma meta para começar'}
            </p>

            <div style={{ 
              background: '#FFFFFF',
              padding: '30px',
              borderRadius: '15px',
              marginBottom: '30px'
            }}>
              <h3 className="input-label" style={{ textAlign: 'center', marginBottom: '20px' }}>
                Livros por Gênero
              </h3>
              <div className="genres-grid">
                {Object.entries(generos).map(([genero, quantidade]) => (
                  <div key={genero} className="genre-item">
                    <div>{genero}</div>
                    <div style={{ fontSize: '32px', marginTop: '10px' }}>{quantidade}</div>
                  </div>
                ))}
              </div>

              {Object.values(generos).some(v => v > 0) && (
                <div style={{ 
                  marginTop: '30px',
                  textAlign: 'center',
                  padding: '20px',
                  background: 'white',
                  borderRadius: '10px'
                }}>
                  <p style={{ color: '#E11D48', fontWeight: 'bold', fontSize: '18px' }}>
                    🏆 Gênero mais lido: {generoMaisLido}
                  </p>
                </div>
              )}
            </div>

            <div style={{
              background: 'white',
              padding: '20px',
              borderRadius: '15px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
            }}>
              <h3 className="input-label" style={{ marginBottom: '15px' }}>
                📚 Lista de Livros Lidos
              </h3>
              <p style={{ color: '#8B5A6F', fontSize: '14px' }}>
                Os livros serão adicionados automaticamente quando você marcar como concluído na biblioteca
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetaLeitura;
