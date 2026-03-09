import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { getOrCreateUsuario, getUsuarioById } from './services/api';

import TelaInicial from './components/TelaInicial';
import Navbar from './components/Navbar';
import Biblioteca from './components/Biblioteca';
import CalendarioAnual from './components/CalendarioAnual';
import DesafioAZ from './components/DesafioAZ';
import MetaLeitura from './components/MetaLeitura';
import ProximaMeta from './components/ProximaMeta';
import Avaliacao from './components/Avaliacao';
import CadastroLivro from './components/CadastroLivro';

function App() {
  const usuarioSalvo = localStorage.getItem('bookshelf_usuario');
  const [usuario, setUsuario] = useState(() => {
    if (!usuarioSalvo) return null;

    try {
      const usuarioJson = JSON.parse(usuarioSalvo);
      if (usuarioJson?.id && usuarioJson?.nome) {
        return usuarioJson;
      }
    } catch (_error) {
      return { id: null, nome: usuarioSalvo };
    }

    return null;
  });
  const [erroLogin, setErroLogin] = useState('');
  const [validandoUsuario, setValidandoUsuario] = useState(true);
  const usuarioInicialRef = useRef(usuario);

  useEffect(() => {
    async function validarUsuarioSalvo() {
      const usuarioInicial = usuarioInicialRef.current;

      if (!usuarioInicial?.id) {
        setValidandoUsuario(false);
        return;
      }

      try {
        setErroLogin('');
        const usuarioApi = await getUsuarioById(usuarioInicial.id);

        if (usuarioApi?.id) {
          const usuarioNormalizado = { id: usuarioApi.id, nome: usuarioApi.nome };
          setUsuario(usuarioNormalizado);
          localStorage.setItem('bookshelf_usuario', JSON.stringify(usuarioNormalizado));
        } else if (usuarioInicial?.nome) {
          const recriado = await getOrCreateUsuario(usuarioInicial.nome);
          const usuarioNormalizado = { id: recriado.id, nome: recriado.nome };
          setUsuario(usuarioNormalizado);
          localStorage.setItem('bookshelf_usuario', JSON.stringify(usuarioNormalizado));
        } else {
          setUsuario(null);
          localStorage.removeItem('bookshelf_usuario');
        }
      } catch (error) {
        setErroLogin(error.message || 'Nao foi possivel validar usuario.');
        setUsuario(null);
        localStorage.removeItem('bookshelf_usuario');
      } finally {
        setValidandoUsuario(false);
      }
    }

    validarUsuarioSalvo();
  }, []);

  const handleNomeSubmit = async (nome) => {
    try {
      setErroLogin('');
      const usuarioApi = await getOrCreateUsuario(nome);
      const usuarioNormalizado = { id: usuarioApi.id, nome: usuarioApi.nome };
      setUsuario(usuarioNormalizado);
      localStorage.setItem('bookshelf_usuario', JSON.stringify(usuarioNormalizado));
    } catch (error) {
      setErroLogin(error.message || 'Nao foi possivel entrar.');
    }
  };

  if (validandoUsuario) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Carregando...</div>;
  }

  if (!usuario?.id) {
    return <TelaInicial onNomeSubmit={handleNomeSubmit} erro={erroLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/biblioteca" />} />
          <Route path="/biblioteca" element={<Biblioteca usuarioId={usuario.id} />} />
          <Route path="/calendario" element={<CalendarioAnual usuarioId={usuario.id} />} />
          <Route path="/alfabeto" element={<DesafioAZ usuarioId={usuario.id} />} />
          <Route path="/meta" element={<MetaLeitura usuarioId={usuario.id} />} />
          <Route path="/proxima-meta" element={<ProximaMeta usuarioId={usuario.id} />} />
          <Route path="/avaliacao" element={<Avaliacao />} />
          <Route path="/cadastro-livro" element={<CadastroLivro usuarioId={usuario.id} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
