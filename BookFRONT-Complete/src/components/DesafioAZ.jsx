import React, { useState, useEffect } from 'react';
import { createDesafio, getDesafioPorUsuario, updateLetraDesafio } from '../services/api';

function DesafioAZ({ usuarioId }) {
  const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [livros, setLivros] = useState({});
  const [desafioId, setDesafioId] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const anoAtual = new Date().getFullYear();

  useEffect(() => {
    async function carregarDesafio() {
      if (!usuarioId) return;

      try {
        setErro('');
        let desafio = await getDesafioPorUsuario(usuarioId, anoAtual);

        if (!desafio) {
          desafio = await createDesafio({ ano: anoAtual, usuarioId });
        }

        setDesafioId(desafio.id);

        const livrosPorLetra = {};
        desafio.letras.forEach((item) => {
          livrosPorLetra[item.letra] = item.tituloLivro || '';
        });
        setLivros(livrosPorLetra);
      } catch (error) {
        setErro(error.message || 'Nao foi possivel carregar o desafio A-Z.');
      }
    }

    carregarDesafio();
  }, [usuarioId, anoAtual]);

  const handleChange = (letra, valor) => {
    setLivros({
      ...livros,
      [letra]: valor
    });
  };

  const handleSalvar = async () => {
    if (!desafioId) {
      setErro('Desafio nao carregado ainda.');
      return;
    }

    try {
      setErro('');
      setSalvando(true);
      await Promise.all(
        alfabeto.map((letra) => updateLetraDesafio(desafioId, {
          letra,
          tituloLivro: (livros[letra] || '').trim(),
          completado: !!(livros[letra] || '').trim()
        }))
      );
    } catch (error) {
      setErro(error.message || 'Nao foi possivel salvar o desafio A-Z.');
    } finally {
      setSalvando(false);
    }
  };

  const progresso = alfabeto.filter(letra => livros[letra]?.trim()).length;
  const porcentagem = Math.round((progresso / 26) * 100);

  return (
    <div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { width: 0; }
          to { width: ${porcentagem}%; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .letter-row-modern {
          animation: fadeInUp 0.5s ease-out;
          animation-fill-mode: both;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .letter-row-modern:hover {
          transform: translateX(8px);
          box-shadow: 0 8px 20px rgba(225, 29, 72, 0.15);
        }
        .letter-input-modern:focus {
          transform: scale(1.02);
          box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.2);
        }
        .save-btn-az {
          background: linear-gradient(135deg, #E11D48, #BE123C, #E11D48);
          background-size: 200% 100%;
          transition: all 0.4s;
        }
        .save-btn-az:hover {
          background-position: 100% 0;
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(225, 29, 72, 0.4);
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
        .progress-bar { animation: slideRight 1s ease-out; }
      `}</style>

      <div className="header-gradient" style={{
        color: 'white',
        padding: '40px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(225, 29, 72, 0.3)',
        marginBottom: '40px'
      }}>
        <div style={{
          fontSize: '60px',
          marginBottom: '10px',
          animation: 'bounce 2s infinite',
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
        }}>
          🔤
        </div>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold',
          margin: 0,
          fontFamily: 'Georgia, serif',
          textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
          letterSpacing: '2px'
        }}>
          Desafio A - Z
        </h1>
        <p style={{ fontSize: '18px', marginTop: '10px', opacity: 0.95 }}>
          📖 Um livro para cada letra do alfabeto
        </p>
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

        <div className="card" style={{
          background: 'linear-gradient(135deg, #FFFFFF, #FFFFFF)',
          borderRadius: '25px',
          padding: '40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          border: '2px solid #FFFFFF'
        }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '40px',
            background: 'white',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            border: '2px solid #FFFFFF'
          }}>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>🏆</div>
            <h3 style={{ color: '#E11D48', marginBottom: '15px', fontSize: '24px', fontWeight: 'bold' }}>
              Seu Progresso
            </h3>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#E11D48', marginBottom: '20px' }}>
              {progresso} <span style={{ fontSize: '28px', color: '#8B5A6F' }}>/ 26</span>
            </div>
            <div style={{ 
              background: '#FFFFFF',
              height: '30px',
              borderRadius: '15px',
              overflow: 'hidden',
              marginTop: '20px',
              border: '2px solid #FFC0D3',
              position: 'relative'
            }}>
              <div className="progress-bar" style={{
                background: 'linear-gradient(90deg, #E11D48, #FB7185, #E11D48)',
                height: '100%',
                width: `${porcentagem}%`,
                borderRadius: '13px',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shine 2s infinite'
                }}></div>
              </div>
            </div>
            <p style={{ marginTop: '15px', fontSize: '20px', color: '#E11D48', fontWeight: 'bold' }}>
              {porcentagem}% completo
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
            padding: '20px 0'
          }}>
            {alfabeto.map((letra, index) => (
              <div 
                key={letra} 
                className="letter-row-modern"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  background: 'white',
                  padding: '18px 22px',
                  borderRadius: '15px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                  border: livros[letra]?.trim() ? '2px solid #10B981' : '2px solid #FFFFFF',
                  animationDelay: `${index * 0.02}s`
                }}
              >
                <div style={{
                  background: livros[letra]?.trim() 
                    ? 'linear-gradient(135deg, #10B981, #059669)' 
                    : 'linear-gradient(135deg, #E11D48, #BE123C)',
                  color: 'white',
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                  flexShrink: 0
                }}>
                  {livros[letra]?.trim() ? '✓' : letra}
                </div>
                <input
                  type="text"
                  className="letter-input-modern"
                  placeholder="Título do livro..."
                  value={livros[letra] || ''}
                  onChange={(e) => handleChange(letra, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '2px solid #FFC0D3',
                    borderRadius: '10px',
                    outline: 'none',
                    fontSize: '15px',
                    transition: 'all 0.3s',
                    background: '#FFFFFF'
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button 
              className="btn save-btn-az" 
              onClick={handleSalvar}
              disabled={salvando}
              style={{ fontSize: '18px', padding: '18px 45px', fontWeight: 'bold' }}
            >
              {salvando ? 'Salvando...' : '💾 Salvar Desafio'}
            </button>
          </div>

          {progresso === 26 && (
            <div style={{
              marginTop: '40px',
              padding: '40px',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
              color: 'white'
            }}>
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '15px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                PARABÉNS!
              </h2>
              <p style={{ fontSize: '20px', opacity: 0.95 }}>
                Você completou o Desafio A-Z! 🏆
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DesafioAZ;
