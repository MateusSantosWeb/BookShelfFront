import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar com Menu Hamburger
 * 
 * Design: Menu responsivo com três barrinhas (hamburger)
 * Cores: Ruby (#E11D48) + Rose Ivory (#FFF5F7)
 */

function Navbar() {
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  const menuItems = [
    { path: '/biblioteca', label: 'Biblioteca', icon: '📚' },
    { path: '/calendario', label: 'Calendário', icon: '📅' },
    { path: '/alfabeto', label: 'Alfabeto', icon: '🔤' },
    { path: '/avaliacao', label: 'Avaliação', icon: '⭐' },
    { path: '/meta', label: 'Meta', icon: '🎯' },
    { path: '/proxima-meta', label: 'Próxima Meta', icon: '📖' }
  ];

  const fecharMenu = () => {
    setMenuAberto(false);
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .navbar-header {
          animation: slideDown 0.5s ease-out;
        }

        .menu-mobile {
          animation: slideIn 0.3s ease-out;
        }

        .hamburger-btn {
          display: none;
          flex-direction: column;
          cursor: pointer;
          gap: 6px;
          background: none;
          border: none;
          padding: 8px;
        }

        .hamburger-btn span {
          width: 28px;
          height: 3px;
          background: white;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger-btn.ativo span:nth-child(1) {
          transform: rotate(45deg) translate(10px, 10px);
        }

        .hamburger-btn.ativo span:nth-child(2) {
          opacity: 0;
        }

        .hamburger-btn.ativo span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -7px);
        }

        @media (max-width: 768px) {
          .hamburger-btn {
            display: flex;
          }

          .menu-desktop {
            display: none;
          }

          .menu-mobile {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #BE123C 0%, #E11D48 50%, #FB7185 100%);
            padding: 20px 0;
            z-index: 999;
            box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
          }

          .menu-mobile ul {
            display: flex;
            flex-direction: column;
            gap: 0;
          }

          .menu-mobile li {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .menu-mobile a {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px !important;
            width: 100%;
          }
        }
      `}</style>

      {/* Header */}
      <nav className="navbar-header" style={{
        background: 'linear-gradient(135deg, #BE123C 0%, #E11D48 50%, #FB7185 100%)',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(225, 29, 72, 0.4)',
        position: 'relative',
        zIndex: 1000
      }}>
        {/* Logo */}
        <Link to="/biblioteca" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            fontSize: '28px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            transition: 'transform 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'rotate(-10deg) scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'rotate(0) scale(1)'}
          >
            📚
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '1px'
          }}>
            BookShelf
          </div>
        </Link>

        {/* Menu Desktop */}
        <ul className="menu-desktop" style={{
          display: 'flex',
          gap: '20px',
          listStyle: 'none',
          margin: 0,
          padding: 0
        }}>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: location.pathname === item.path 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'transparent',
                  transition: 'all 0.3s ease',
                  border: location.pathname === item.path 
                    ? '1px solid rgba(255, 255, 255, 0.3)' 
                    : '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Botão Hamburger */}
        <button 
          className={`hamburger-btn ${menuAberto ? 'ativo' : ''}`}
          onClick={() => setMenuAberto(!menuAberto)}
          style={{ cursor: 'pointer' }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Menu Mobile */}
      {menuAberto && (
        <div className="menu-mobile">
          <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  onClick={fecharMenu}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '16px',
                    background: location.pathname === item.path 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = location.pathname === item.path 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : 'transparent';
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;
