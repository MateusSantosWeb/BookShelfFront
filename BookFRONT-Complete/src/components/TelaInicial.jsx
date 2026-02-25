import React, { useState, useEffect } from 'react';

function TelaInicial({ onNomeSubmit, erro }) {
  const [nome, setNome] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nome.trim()) {
      setCarregando(true);
      try {
        await onNomeSubmit(nome);
      } finally {
        setCarregando(false);
      }
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #BE123C 0%, #E11D48 50%, #FB7185 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efeito de livros flutuantes */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        fontSize: '100px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '50px',
        padding: '50px',
        animation: 'float 20s infinite linear'
      }}>
        📚 📖 📕 📗 📘 📙 📚 📖 📕 📗 📘 📙
        📚 📖 📕 📗 📘 📙 📚 📖 📕 📗 📘 📙
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        @keyframes slideUp {
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
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .welcome-container {
          animation: slideUp 0.8s ease-out;
        }

        .logo-text {
          background: linear-gradient(135deg, #FFD700, #FFA500, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 8px rgba(0,0,0,0.2);
          animation: pulse 3s infinite;
        }

        .input-glow:focus {
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3);
        }

        .btn-glow:hover {
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 8px 20px rgba(0,0,0,0.3);
          transform: translateY(-3px) scale(1.05);
        }

        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: sparkle 2s infinite;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div 
        className="welcome-container"
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          padding: '70px 90px',
          borderRadius: '30px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4), 0 0 100px rgba(225, 29, 72, 0.3)',
          textAlign: 'center',
          maxWidth: '700px',
          width: '90%',
          position: 'relative',
          border: '3px solid rgba(225, 29, 72, 0.2)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.8s'
        }}
      >
        {/* Sparkles decorativos */}
        <div className="sparkle" style={{ top: '20px', left: '30px', animationDelay: '0s' }}></div>
        <div className="sparkle" style={{ top: '50px', right: '40px', animationDelay: '0.5s' }}></div>
        <div className="sparkle" style={{ bottom: '30px', left: '50px', animationDelay: '1s' }}></div>
        <div className="sparkle" style={{ bottom: '60px', right: '30px', animationDelay: '1.5s' }}></div>

        {/* Ícone de livro gigante */}
        <div style={{ 
          fontSize: '90px',
          marginBottom: '20px',
          filter: 'drop-shadow(0 10px 20px rgba(225, 29, 72, 0.3))'
        }}>
          📚
        </div>

        {/* Título principal */}
        <h1 className="logo-text" style={{ 
          fontSize: '56px', 
          fontWeight: 'bold',
          margin: '0 0 15px 0',
          fontFamily: 'Georgia, serif',
          letterSpacing: '2px'
        }}>
          BookShelf
        </h1>

        <div style={{
          background: 'linear-gradient(135deg, #E11D48, #BE123C)',
          color: 'white',
          padding: '20px 50px',
          borderRadius: '20px',
          marginBottom: '50px',
          boxShadow: '0 10px 30px rgba(225, 29, 72, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
            animation: 'shimmer 3s infinite'
          }}></div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '600',
            margin: 0,
            position: 'relative',
            zIndex: 1
          }}>
            ✨ Bem-vinda à Sua Biblioteca! ✨
          </h2>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>

        <p style={{
          fontSize: '18px',
          color: '#8B5A6F',
          marginBottom: '35px',
          lineHeight: '1.6'
        }}>
          Organize suas leituras, acompanhe suas metas e <br/>
          descubra novos mundos através dos livros 📖
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '35px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              color: '#E11D48',
              fontWeight: '600',
              marginBottom: '12px',
              textAlign: 'left'
            }}>
              👤 Qual é o seu nome?
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome aqui..."
              className="input-field input-glow"
              style={{
                fontSize: '22px',
                padding: '20px 30px',
                textAlign: 'center',
                border: '3px solid #FFFFFF',
                transition: 'all 0.3s',
                fontWeight: '500'
              }}
              autoFocus
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-glow"
            disabled={!nome.trim() || carregando}
            style={{
              fontSize: '20px',
              padding: '18px 60px',
              background: nome.trim() && !carregando
                ? 'linear-gradient(135deg, #E11D48, #BE123C)' 
                : '#ccc',
              transition: 'all 0.3s',
              cursor: nome.trim() && !carregando ? 'pointer' : 'not-allowed',
              border: 'none',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}
          >
            {carregando ? 'Conectando...' : nome.trim() ? '🚀 Entrar na Minha BookShelf' : '📝 Digite seu nome'}
          </button>
          {!!erro && (
            <p style={{ color: '#BE123C', marginTop: '16px', fontWeight: 600 }}>
              {erro}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default TelaInicial;
