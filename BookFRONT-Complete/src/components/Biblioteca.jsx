import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteLivro, getLivros, updateLivro } from '../services/api';

function Biblioteca({ usuarioId }) {
  const navigate = useNavigate();
  const [livros, setLivros] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [processandoId, setProcessandoId] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [formEdicao, setFormEdicao] = useState({
    titulo: '',
    autor: '',
    genero: '',
    diasLeitura: 1,
    avaliacao: 1,
    coracoes: 1
  });

  useEffect(() => {
    async function carregarLivros() {
      if (!usuarioId) return;

      try {
        setErro('');
        setCarregando(true);
        const livrosApi = await getLivros(usuarioId);

        const livrosNormalizados = livrosApi.map((livro, index) => ({
          id: livro.id,
          numero: `#${String(index + 1).padStart(2, '0')}`,
          titulo: livro.titulo,
          autor: livro.autor,
          genero: livro.genero || '',
          capa: livro.imagemUrl || 'https://via.placeholder.com/300x450?text=Sem+Capa',
          diasLeitura: livro.tempoLeituraDias,
          avaliacao: livro.estrelas,
          favorito: livro.favorito,
          coracoes: livro.coracoes
        }));

        setLivros(livrosNormalizados);
      } catch (error) {
        setErro(error.message || 'Nao foi possivel carregar os livros.');
      } finally {
        setCarregando(false);
      }
    }

    carregarLivros();
  }, [usuarioId]);

  const renderStars = (rating) => '⭐'.repeat(rating);

  const iniciarEdicao = (livro) => {
    setEditandoId(livro.id);
    setFormEdicao({
      titulo: livro.titulo,
      autor: livro.autor,
      genero: livro.genero || '',
      diasLeitura: livro.diasLeitura || 1,
      avaliacao: livro.avaliacao || 1,
      coracoes: livro.coracoes || 1
    });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setFormEdicao({
      titulo: '',
      autor: '',
      genero: '',
      diasLeitura: 1,
      avaliacao: 1,
      coracoes: 1
    });
  };

  const salvarEdicao = async (livroId) => {
    try {
      setErro('');
      setProcessandoId(livroId);

      await updateLivro(livroId, {
        titulo: formEdicao.titulo.trim(),
        autor: formEdicao.autor.trim(),
        genero: formEdicao.genero.trim() || null,
        tempoLeituraDias: Number(formEdicao.diasLeitura),
        estrelas: Number(formEdicao.avaliacao),
        coracoes: Number(formEdicao.coracoes)
      });

      setLivros((prev) =>
        prev.map((livro) =>
          livro.id === livroId
            ? {
                ...livro,
                titulo: formEdicao.titulo.trim(),
                autor: formEdicao.autor.trim(),
                genero: formEdicao.genero.trim(),
                diasLeitura: Number(formEdicao.diasLeitura),
                avaliacao: Number(formEdicao.avaliacao),
                coracoes: Number(formEdicao.coracoes)
              }
            : livro
        )
      );
      cancelarEdicao();
    } catch (error) {
      setErro(error.message || 'Nao foi possivel editar o livro.');
    } finally {
      setProcessandoId(null);
    }
  };

  const alternarFavorito = async (livro) => {
    try {
      setErro('');
      setProcessandoId(livro.id);

      await updateLivro(livro.id, { favorito: !livro.favorito });
      setLivros((prev) =>
        prev.map((item) =>
          item.id === livro.id ? { ...item, favorito: !item.favorito } : item
        )
      );
    } catch (error) {
      setErro(error.message || 'Nao foi possivel atualizar favorito.');
    } finally {
      setProcessandoId(null);
    }
  };

  const excluirLivro = async (livro) => {
    const confirmou = window.confirm(`Excluir o livro "${livro.titulo}"?`);
    if (!confirmou) return;

    try {
      setErro('');
      setProcessandoId(livro.id);
      await deleteLivro(livro.id);
      setLivros((prev) => prev.filter((item) => item.id !== livro.id));
    } catch (error) {
      setErro(error.message || 'Nao foi possivel excluir o livro.');
    } finally {
      setProcessandoId(null);
    }
  };

  return (
    <div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .book-card-modern {
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .book-card-modern:hover {
          transform: translateY(-10px) scale(1.03);
          box-shadow: 0 20px 40px rgba(225, 29, 72, 0.3), 0 0 20px rgba(225, 29, 72, 0.2);
        }
        .book-cover-modern { transition: transform 0.4s; }
        .book-card-modern:hover .book-cover-modern { transform: scale(1.05); }
        .add-button {
          background: linear-gradient(135deg, #E11D48, #BE123C, #E11D48);
          background-size: 200% 100%;
          transition: all 0.4s;
        }
        .add-button:hover {
          background-position: 100% 0;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(225, 29, 72, 0.4);
        }
        .header-gradient {
          background: linear-gradient(135deg, #BE123C 0%, #E11D48 50%, #FB7185 100%);
          position: relative;
          overflow: hidden;
        }
        .header-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shine 3s infinite;
        }
      `}</style>

      <div className="header-gradient" style={{
        color: 'white',
        padding: '40px',
        borderRadius: '0',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(225, 29, 72, 0.3)',
        marginBottom: '40px'
      }}>
        <div style={{
          fontSize: '60px',
          marginBottom: '10px',
          animation: 'float 3s infinite',
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
        }}>
          📚
        </div>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          margin: 0,
          fontFamily: 'Georgia, serif',
          textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
          letterSpacing: '2px'
        }}>
          Minha Biblioteca
        </h1>
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

        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFFFFF, #FFFFFF)',
            padding: '15px 30px',
            borderRadius: '15px',
            border: '2px solid #FFC0D3'
          }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#E11D48' }}>
              📖 {livros.length} {livros.length === 1 ? 'Livro' : 'Livros'}
            </span>
          </div>

          <button
            className="btn add-button"
            onClick={() => navigate('/cadastro-livro')}
            style={{
              fontSize: '18px',
              padding: '15px 35px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 'bold'
            }}
          >
            <span style={{ fontSize: '24px' }}>➕</span>
            Adicionar Livro
          </button>
        </div>

        <div className="books-grid">
          {carregando && <p style={{ color: '#8B5A6F' }}>Carregando livros...</p>}

          {livros.map((livro, index) => {
            const processando = processandoId === livro.id;
            const editando = editandoId === livro.id;

            return (
              <div
                key={livro.id}
                className="book-card-modern"
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                  animationDelay: `${index * 0.1}s`,
                  border: '2px solid transparent',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {livro.favorito && (
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'linear-gradient(135deg, #E11D48, #BE123C)',
                    color: 'white',
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    zIndex: 2,
                    boxShadow: '0 4px 12px rgba(225, 29, 72, 0.4)',
                    animation: 'float 2s infinite'
                  }}>
                    ❤️
                  </div>
                )}

                <div style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '15px',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.15)'
                }}>
                  <img
                    src={livro.capa}
                    alt={livro.titulo}
                    className="book-cover-modern"
                    style={{
                      width: '100%',
                      height: '350px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>

                {!editando && (
                  <div style={{ textAlign: 'left' }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #E11D48, #BE123C)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {livro.numero}
                    </span>

                    <h3 style={{ color: '#4A1D34', fontSize: '18px', fontWeight: 'bold', marginBottom: '6px', marginTop: '10px' }}>
                      {livro.titulo}
                    </h3>

                    <p style={{ color: '#8B5A6F', fontSize: '14px', marginBottom: '10px' }}>
                      por {livro.autor}
                    </p>

                    {!!livro.genero && (
                      <p style={{ color: '#8B5A6F', fontSize: '13px', marginBottom: '8px' }}>
                        Gênero: {livro.genero}
                      </p>
                    )}

                    <div style={{
                      background: '#FFFFFF',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      display: 'inline-block'
                    }}>
                      <span style={{ color: '#E11D48', fontSize: '13px', fontWeight: '600' }}>
                        ⏱️ {livro.diasLeitura} dias de leitura
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '5px', fontSize: '20px', marginBottom: '8px' }}>
                      {renderStars(livro.avaliacao)}
                    </div>

                    <div style={{ display: 'flex', gap: '4px', fontSize: '18px', marginBottom: '14px' }}>
                      {'💗'.repeat(livro.coracoes || 0)}
                    </div>
                  </div>
                )}

                {editando && (
                  <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                    <label className="input-label" style={{ fontSize: '14px', marginBottom: '2px' }}>Título do livro</label>
                    <input
                      className="input-field"
                      value={formEdicao.titulo}
                      onChange={(e) => setFormEdicao((prev) => ({ ...prev, titulo: e.target.value }))}
                      placeholder="Ex: É Assim Que Acaba"
                    />

                    <label className="input-label" style={{ fontSize: '14px', marginBottom: '2px' }}>Nome do autor(a)</label>
                    <input
                      className="input-field"
                      value={formEdicao.autor}
                      onChange={(e) => setFormEdicao((prev) => ({ ...prev, autor: e.target.value }))}
                      placeholder="Ex: Colleen Hoover"
                    />

                    <label className="input-label" style={{ fontSize: '14px', marginBottom: '2px' }}>Gênero</label>
                    <input
                      className="input-field"
                      value={formEdicao.genero}
                      onChange={(e) => setFormEdicao((prev) => ({ ...prev, genero: e.target.value }))}
                      placeholder="Ex: Romance"
                    />

                    <label className="input-label" style={{ fontSize: '14px', marginBottom: '2px' }}>Tempo de leitura (dias)</label>
                    <input
                      className="input-field"
                      type="number"
                      min="1"
                      value={formEdicao.diasLeitura}
                      onChange={(e) => setFormEdicao((prev) => ({ ...prev, diasLeitura: Number(e.target.value) || 1 }))}
                    />

                    <label className="input-label" style={{ fontSize: '14px', marginBottom: '2px' }}>Avaliação em estrelas (1 a 5)</label>
                    <input
                      className="input-field"
                      type="number"
                      min="1"
                      max="5"
                      value={formEdicao.avaliacao}
                      onChange={(e) => setFormEdicao((prev) => ({ ...prev, avaliacao: Number(e.target.value) || 1 }))}
                    />

                    <label className="input-label" style={{ fontSize: '14px', marginBottom: '2px' }}>Nível de favoritos/corações (1 a 5)</label>
                    <input
                      className="input-field"
                      type="number"
                      min="1"
                      max="5"
                      value={formEdicao.coracoes}
                      onChange={(e) => setFormEdicao((prev) => ({ ...prev, coracoes: Number(e.target.value) || 1 }))}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {!editando && (
                    <button className="btn btn-secondary" disabled={processando} onClick={() => iniciarEdicao(livro)}>
                      Editar
                    </button>
                  )}

                  {editando && (
                    <>
                      <button className="btn" disabled={processando} onClick={() => salvarEdicao(livro.id)}>
                        Salvar
                      </button>
                      <button className="btn btn-secondary" disabled={processando} onClick={cancelarEdicao}>
                        Cancelar
                      </button>
                    </>
                  )}

                  <button className="btn btn-secondary" disabled={processando} onClick={() => alternarFavorito(livro)}>
                    {livro.favorito ? 'Não favorito' : 'Favorito'}
                  </button>

                  <button className="btn btn-secondary" disabled={processando} onClick={() => excluirLivro(livro)}>
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {!carregando && livros.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'linear-gradient(135deg, #FFFFFF, #FFFFFF)',
            borderRadius: '25px',
            border: '3px dashed #FFC0D3'
          }}>
            <div style={{ fontSize: '100px', marginBottom: '20px' }}>📚</div>
            <p style={{ fontSize: '24px', marginBottom: '15px', color: '#E11D48', fontWeight: 'bold' }}>
              Sua biblioteca está vazia
            </p>
            <button
              className="btn add-button"
              onClick={() => navigate('/cadastro-livro')}
              style={{ fontSize: '18px', padding: '15px 40px' }}
            >
              Adicionar Primeiro Livro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Biblioteca;
