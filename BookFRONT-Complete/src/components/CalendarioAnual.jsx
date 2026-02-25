import React, { useState, useEffect } from 'react';
import { getCalendarioAnual, salvarMesCalendario } from '../services/api';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function CalendarioAnual({ usuarioId }) {
  const [quantidades, setQuantidades] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const anoAtual = new Date().getFullYear();

  useEffect(() => {
    async function carregarCalendario() {
      if (!usuarioId) return;

      try {
        const calendario = await getCalendarioAnual(usuarioId, anoAtual);
        const quantidadesPorMes = {};

        calendario.meses.forEach((mesApi) => {
          const nomeMes = MESES[mesApi.mes - 1];
          if (nomeMes) {
            quantidadesPorMes[nomeMes] = mesApi.quantidadeLivros;
          }
        });

        setQuantidades(quantidadesPorMes);
      } catch (error) {
        setErro(error.message || 'Nao foi possivel carregar o calendario.');
      }
    }

    carregarCalendario();
  }, [usuarioId, anoAtual]);

  const handleChange = (mes, valor) => {
    setQuantidades({
      ...quantidades,
      [mes]: valor
    });
  };

  const handleSalvar = async () => {
    if (!usuarioId) {
      setErro('Usuario invalido para salvar calendario.');
      return;
    }

    try {
      setErro('');
      setSalvando(true);
      await Promise.all(
        MESES.map((mes, index) => {
          const quantidadeLivros = Number(quantidades[mes] || 0);
          return salvarMesCalendario(usuarioId, anoAtual, index + 1, quantidadeLivros);
        })
      );
    } catch (error) {
      setErro(error.message || 'Nao foi possivel salvar o calendario.');
    } finally {
      setSalvando(false);
    }
  };

  const totalLivros = Object.values(quantidades).reduce((acc, val) => acc + (parseInt(val) || 0), 0);

  return (
    <div>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .month-card-modern {
          animation: fadeInUp 0.6s ease-out;
          animation-fill-mode: both;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .month-card-modern:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 12px 30px rgba(225, 29, 72, 0.2);
        }

        .month-input-modern:focus {
          transform: scale(1.05);
          box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.2), 0 0 20px rgba(225, 29, 72, 0.1);
        }

        .save-btn {
          background: linear-gradient(135deg, #E11D48, #BE123C, #E11D48);
          background-size: 200% 100%;
          transition: all 0.4s;
        }

        .save-btn:hover {
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
          animation: 'pulse 2s infinite',
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
        }}>
          📅
        </div>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold',
          margin: 0,
          fontFamily: 'Georgia, serif',
          textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
          letterSpacing: '2px'
        }}>
          Calendário Anual
        </h1>
        <p style={{
          fontSize: '18px',
          marginTop: '10px',
          opacity: 0.95
        }}>
          📊 Acompanhe sua leitura mês a mês
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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '25px',
            padding: '20px 0'
          }}>
            {MESES.map((mes, index) => (
              <div 
                key={index} 
                className="month-card-modern"
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '25px',
                  textAlign: 'center',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                  border: '2px solid #FFFFFF',
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <div style={{
                  fontSize: '32px',
                  marginBottom: '12px'
                }}>
                  {['📖', '📚', '📕', '📗', '📘', '📙', '📖', '📚', '📕', '📗', '📘', '📙'][index]}
                </div>
                <div style={{
                  color: '#E11D48',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  marginBottom: '15px',
                  fontFamily: 'Georgia, serif'
                }}>
                  {mes}
                </div>
                <input
                  type="number"
                  min="0"
                  className="month-input-modern"
                  placeholder="0"
                  value={quantidades[mes] || ''}
                  onChange={(e) => handleChange(mes, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #FFC0D3',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#E11D48',
                    outline: 'none',
                    transition: 'all 0.3s',
                    background: '#FFFFFF'
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '40px',
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <button 
              className="btn save-btn" 
              onClick={handleSalvar}
              disabled={salvando}
              style={{
                fontSize: '18px',
                padding: '18px 45px',
                fontWeight: 'bold'
              }}
            >
              {salvando ? 'Salvando...' : '💾 Salvar Calendário'}
            </button>
          </div>

          <div style={{ 
            marginTop: '50px', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #E11D48, #BE123C)',
            padding: '35px',
            borderRadius: '20px',
            boxShadow: '0 8px 25px rgba(225, 29, 72, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.3
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '50px', marginBottom: '15px' }}>🎯</div>
              <h3 style={{ 
                color: 'white', 
                marginBottom: '15px',
                fontSize: '24px',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}>
                Total do Ano
              </h3>
              <div style={{ 
                fontSize: '72px', 
                fontWeight: 'bold', 
                color: 'white',
                textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                marginBottom: '10px',
                animation: 'pulse 2s infinite'
              }}>
                {totalLivros}
              </div>
              <p style={{ 
                fontSize: '24px',
                color: 'white',
                opacity: 0.95,
                fontWeight: '300'
              }}>
                {totalLivros === 1 ? 'livro' : 'livros'} lidos
              </p>
            </div>
          </div>

          {totalLivros > 0 && (
            <div style={{
              marginTop: '30px',
              padding: '25px',
              background: 'linear-gradient(135deg, #FFFFFF, #FFFFFF)',
              borderRadius: '15px',
              textAlign: 'center',
              border: '2px dashed #FFC0D3'
            }}>
              <p style={{ 
                fontSize: '18px',
                color: '#8B5A6F',
                margin: 0,
                fontWeight: '500'
              }}>
                🎉 <strong style={{ color: '#E11D48' }}>Parabéns!</strong> Você está construindo um ótimo histórico de leitura!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarioAnual;
