import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLivro } from '../services/api';

function CadastroLivro({ usuarioId }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    genero: '',
    tempoLeitura: '',
    imagemUrl: '',
    favorito: 0,
    intensidade: 0,
    emocao: 0,
    avaliacao: 0
  });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuarioId) {
      setErro('Usuario invalido para cadastrar livro.');
      return;
    }

    if (
      !formData.titulo.trim()
      || !formData.autor.trim()
      || !formData.tempoLeitura
      || formData.avaliacao < 1
      || formData.favorito < 1
      || formData.intensidade < 1
      || formData.emocao < 1
    ) {
      setErro('Preencha todos os campos obrigatorios e selecione as avaliacoes de 1 a 5.');
      return;
    }

    try {
      setErro('');
      setSalvando(true);

      await createLivro({
        titulo: formData.titulo.trim(),
        autor: formData.autor.trim(),
        imagemUrl: formData.imagemUrl.trim() || null,
        genero: formData.genero.trim() || null,
        tempoLeituraDias: Number(formData.tempoLeitura),
        estrelas: formData.avaliacao,
        coracoes: formData.favorito,
        fogos: formData.intensidade,
        humor: formData.emocao,
        favorito: formData.favorito > 0,
        usuarioId
      });

      alert('Livro cadastrado com sucesso!');
      navigate('/biblioteca');
    } catch (error) {
      setErro(error.message || 'Nao foi possivel cadastrar o livro.');
    } finally {
      setSalvando(false);
    }
  };

  const EmojiSelector = ({ value, onChange, emojis, label }) => (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="reaction-group">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            type="button"
            className={`emoji-btn ${value === index + 1 ? 'active' : ''}`}
            onClick={() => onChange(index + 1)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );

  const StarSelector = ({ value, onChange }) => (
    <div className="input-group">
      <label className="input-label">Avaliação</label>
      <div style={{ display: 'flex', gap: '8px', fontSize: '32px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '32px',
              filter: value >= star ? 'none' : 'grayscale(100%)',
              opacity: value >= star ? 1 : 0.3,
              transition: 'all 0.2s'
            }}
            onClick={() => onChange(star)}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            ⭐
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div className="header-title">
        BookShelf
      </div>

      <div className="container">
        <div className="card">
          <h2 style={{ 
            color: '#E11D48',
            fontSize: '28px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            Adicionar Novo Livro
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px',
              marginBottom: '30px'
            }}>
              <div>
                <div className="input-group">
                  <label className="input-label">Título</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.titulo}
                    onChange={(e) => handleChange('titulo', e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Autor(a)</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.autor}
                    onChange={(e) => handleChange('autor', e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Tempo de Leitura (dias)</label>
                  <input
                    type="number"
                    min="1"
                    className="input-field"
                    value={formData.tempoLeitura}
                    onChange={(e) => handleChange('tempoLeitura', e.target.value)}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Genero</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.genero}
                    onChange={(e) => handleChange('genero', e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Imagem (URL)</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://..."
                    value={formData.imagemUrl}
                    onChange={(e) => handleChange('imagemUrl', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <EmojiSelector
                  label="Favorito ❤️"
                  value={formData.favorito}
                  onChange={(val) => handleChange('favorito', val)}
                  emojis={['💗', '💗', '💗', '💗', '💗']}
                />

                <EmojiSelector
                  label="Intensidade 🔥"
                  value={formData.intensidade}
                  onChange={(val) => handleChange('intensidade', val)}
                  emojis={['🔥', '🔥', '🔥', '🔥', '🔥']}
                />

                <EmojiSelector
                  label="Emoção 😊"
                  value={formData.emocao}
                  onChange={(val) => handleChange('emocao', val)}
                  emojis={['😢', '😐', '🙂', '😊', '😍']}
                />

                <StarSelector
                  value={formData.avaliacao}
                  onChange={(val) => handleChange('avaliacao', val)}
                />
              </div>
            </div>

            {!!erro && (
              <p style={{ color: '#BE123C', textAlign: 'center', fontWeight: 600 }}>
                {erro}
              </p>
            )}

            <div style={{ 
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              marginTop: '40px'
            }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/biblioteca')}
              >
                Cancelar
              </button>
              <button type="submit" className="btn" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Criar Livro'}
              </button>
            </div>
          </form>
        </div>

        <div style={{
          marginTop: '30px',
          background: '#FFFFFF',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#8B5A6F', fontSize: '14px' }}>
            💡 <strong>Dica:</strong> Preencha todos os campos com atenção para ter um registro completo da sua leitura!
          </p>
        </div>
      </div>
    </div>
  );
}

export default CadastroLivro;
