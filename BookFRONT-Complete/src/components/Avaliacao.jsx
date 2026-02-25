import React from 'react';

function Avaliacao() {
  const avaliacoes = [
    {
      estrelas: 1,
      descricao: 'Muito ruim, penei para terminar mas deveria ter abandonado'
    },
    {
      estrelas: 2,
      descricao: 'Não gostei, nem um pouco, não recomendo, mas talvez algm goste'
    },
    {
      estrelas: 3,
      descricao: 'É um livro Ok, não me agradou muito mas reconheço q tem bom aspecto'
    },
    {
      estrelas: 4,
      descricao: 'Muito Bom, curti muito e recomendo, mas algum detalhe poderia ser diferente'
    },
    {
      estrelas: 5,
      descricao: 'Gostei de tudo, recomendo de olhos fechados'
    }
  ];

  const renderStars = (num) => {
    return '⭐'.repeat(num);
  };

  return (
    <div>
      <div className="header-title">
        Avaliação
      </div>

      <div className="container">
        <div className="card">
          <div style={{ 
            background: '#FFFFFF',
            padding: '40px',
            borderRadius: '15px',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <div style={{ 
              fontSize: '80px',
              marginBottom: '20px'
            }}>
              📖
            </div>
            <h2 style={{ 
              color: '#E11D48',
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '15px'
            }}>
              Como funciona a avaliação?
            </h2>
            <p style={{ 
              color: '#8B5A6F',
              fontSize: '16px',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Este é o sistema de validação do BookShelf. Use as estrelas para avaliar seus livros de forma padronizada e clara.
            </p>
          </div>

          <div className="validation-system">
            <h3 className="validation-title">
              Sistema de Validação
            </h3>

            <div style={{ marginTop: '30px' }}>
              {avaliacoes.map((avaliacao, index) => (
                <div key={index} className="star-definition">
                  <div className="stars" style={{ fontSize: '24px' }}>
                    {renderStars(avaliacao.estrelas)}
                  </div>
                  <div className="star-text">
                    {avaliacao.descricao}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '40px',
              padding: '25px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FFC0D3 100%)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{ 
                color: '#E11D48',
                fontWeight: 'bold',
                fontSize: '16px',
                marginBottom: '10px'
              }}>
                💡 Dica
              </p>
              <p style={{ color: '#4A1D34', fontSize: '14px' }}>
                Seja consistente com suas avaliações! Isso vai te ajudar a lembrar melhor dos livros e encontrar padrões nas suas leituras.
              </p>
            </div>
          </div>

          <div style={{
            marginTop: '40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: 'white',
              padding: '25px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>❤️</div>
              <p style={{ color: '#E11D48', fontWeight: 'bold' }}>Favorito</p>
              <p style={{ color: '#8B5A6F', fontSize: '14px', marginTop: '5px' }}>
                Marque seus livros preferidos
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '25px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔥</div>
              <p style={{ color: '#E11D48', fontWeight: 'bold' }}>Intensidade</p>
              <p style={{ color: '#8B5A6F', fontSize: '14px', marginTop: '5px' }}>
                Quão envolvente foi?
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '25px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>😊</div>
              <p style={{ color: '#E11D48', fontWeight: 'bold' }}>Emoção</p>
              <p style={{ color: '#8B5A6F', fontSize: '14px', marginTop: '5px' }}>
                Como você se sentiu?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Avaliacao;
