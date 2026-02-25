import React, { useState, useEffect } from 'react';
import { createProximaLeitura, getProximasLeituras, deleteProximaLeitura } from '../services/api';

/**
 * Componente ProximaMeta
 * 
 * Design: Rose Ivory (#FFF5F7) + Ruby (#E11D48)
 * Mantém consistência visual com MetaLeitura
 * 
 * Funcionalidades:
 * - Listar próximos livros a ler
 * - Adicionar novo livro à lista (com imagem e complemento)
 * - Remover livro da lista
 * - Definir prioridade de leitura
 */

function ProximaMeta({ usuarioId }) {
  const [livros, setLivros] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [complemento, setComplemento] = useState('');
  const [prioridade, setPrioridade] = useState(1);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Carregar lista de próximas leituras
  useEffect(() => {
    carregarLivros();
  }, [usuarioId]);

  const carregarLivros = async () => {
    try {
      setErro('');
      setCarregando(true);
      const dados = await getProximasLeituras(usuarioId);
      setLivros(Array.isArray(dados) ? dados : []);
    } catch (error) {
      setErro(error.message || 'Erro ao carregar próximas leituras');
    } finally {
      setCarregando(false);
    }
  };

  const handleAdicionar = async () => {
    if (!titulo.trim()) {
      setErro('Preencha o título do livro');
      return;
    }

    try {
      setErro('');
      setSalvando(true);
      
      await createProximaLeitura({
        titulo: titulo.trim(),
        imageUrl: imageUrl.trim() || null,
        complemento: complemento.trim() || null,
        prioridade,
        usuarioId
      });

      setTitulo('');
      setImageUrl('');
      setComplemento('');
      setPrioridade(1);
      await carregarLivros();
    } catch (error) {
      setErro(error.message || 'Erro ao adicionar livro');
    } finally {
      setSalvando(false);
    }
  };

  const handleRemover = async (id) => {
    if (!confirm('Deseja remover este livro da lista?')) return;

    try {
      setErro('');
      await deleteProximaLeitura(id);
      await carregarLivros();
    } catch (error) {
      setErro(error.message || 'Erro ao remover livro');
    }
  };

  const getPrioridadeLabel = (prioridade) => {
    const labels = {
      1: '🔴 Alta',
      2: '🟡 Média',
      3: '🟢 Baixa'
    };
    return labels[prioridade] || 'Sem prioridade';
  };

  const getPrioridadeCor = (prioridade) => {
    const cores = {
      1: { bg: '#FEE2E2', text: '#991B1B' },
      2: { bg: '#FEF3C7', text: '#92400E' },
      3: { bg: '#DCFCE7', text: '#166534' }
    };
    return cores[prioridade] || { bg: '#F3F4F6', text: '#374151' };
  };

  const livrosOrdenados = [...livros].sort((a, b) => a.prioridade - b.prioridade);

  return (
    <div>
      <div className="header-title">
        Próxima Meta
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

        {/* Formulário de Adição */}
        <div className="card">
          <h2 style={{ color: '#E11D48', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
            Adicionar Novo Livro
          </h2>
          
          <div style={{ marginBottom: '30px' }}>
            <label className="input-label">Título do Livro *</label>
            <input
              type="text"
              placeholder="Ex: O Senhor dos Anéis"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="input-field"
              style={{ marginBottom: '15px' }}
            />

            <label className="input-label">URL da Imagem (Capa)</label>
            <input
              type="url"
              placeholder="Ex: https://exemplo.com/capa.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="input-field"
              style={{ marginBottom: '15px' }}
            />

            <label className="input-label">Complemento (Série, Edição, etc)</label>
            <textarea
              placeholder="Ex: Livro 1 da série, edição de bolso..."
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              className="input-field"
              style={{ marginBottom: '15px', minHeight: '80px', resize: 'vertical' }}
            />

            <label className="input-label">Prioridade de Leitura</label>
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(parseInt(e.target.value))}
              className="input-field"
              style={{ marginBottom: '15px' }}
            >
              <option value={1}>🔴 Alta - Ler em breve</option>
              <option value={2}>🟡 Média - Próximos meses</option>
              <option value={3}>🟢 Baixa - Quando tiver tempo</option>
            </select>

            <button 
              onClick={handleAdicionar}
              disabled={salvando}
              className="btn"
              style={{ width: '100%' }}
            >
              {salvando ? 'Adicionando...' : '+ Adicionar Livro'}
            </button>
          </div>
        </div>

        {/* Lista de Livros */}
        <div className="card" style={{ marginTop: '30px' }}>
          <h2 style={{ color: '#E11D48', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
            Sua Lista ({livros.length} livros)
          </h2>

          {carregando ? (
            <p style={{ textAlign: 'center', color: '#8B5A6F' }}>Carregando...</p>
          ) : livrosOrdenados.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#8B5A6F' }}>
              Nenhum livro na lista ainda. Adicione livros acima para começar sua próxima meta de leitura.
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              {livrosOrdenados.map((livro) => {
                const corPrioridade = getPrioridadeCor(livro.prioridade);
                return (
                  <div
                    key={livro.id}
                    style={{
                      background: 'white',
                      border: '1px solid #E5D4D8',
                      borderRadius: '15px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Imagem da Capa */}
                    {livro.imageUrl && (
                      <div style={{
                        width: '100%',
                        height: '200px',
                        overflow: 'hidden',
                        backgroundColor: '#F3F4F6'
                      }}>
                        <img 
                          src={livro.imageUrl} 
                          alt={livro.titulo}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Conteúdo */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Prioridade Badge */}
                      <div style={{ marginBottom: '12px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: corPrioridade.bg,
                            color: corPrioridade.text
                          }}
                        >
                          {getPrioridadeLabel(livro.prioridade)}
                        </span>
                      </div>

                      {/* Título */}
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#1F2937',
                        marginBottom: '8px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {livro.titulo}
                      </h3>

                      {/* Complemento */}
                      {livro.complemento && (
                        <p style={{
                          fontSize: '13px',
                          color: '#6B7280',
                          marginBottom: '12px',
                          fontStyle: 'italic',
                          lineHeight: '1.4'
                        }}>
                          {livro.complemento}
                        </p>
                      )}

                      {/* Botão Remover */}
                      <button
                        onClick={() => handleRemover(livro.id)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontSize: '14px',
                          marginTop: 'auto'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FECACA';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FEE2E2';
                        }}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Resumo */}
        {livrosOrdenados.length > 0 && (
          <div className="card" style={{ marginTop: '30px', background: '#FFF5F7' }}>
            <h3 style={{ color: '#E11D48', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              📊 Resumo da Lista
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              textAlign: 'center'
            }}>
              <div>
                <p style={{ fontSize: '14px', color: '#8B5A6F', marginBottom: '8px' }}>Alta Prioridade</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#DC2626' }}>
                  {livrosOrdenados.filter((l) => l.prioridade === 1).length}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#8B5A6F', marginBottom: '8px' }}>Média Prioridade</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#D97706' }}>
                  {livrosOrdenados.filter((l) => l.prioridade === 2).length}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#8B5A6F', marginBottom: '8px' }}>Baixa Prioridade</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#16A34A' }}>
                  {livrosOrdenados.filter((l) => l.prioridade === 3).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProximaMeta;
