# Integração do Campo Próxima Meta

## 📋 O que foi adicionado

Este projeto agora contém a implementação completa do novo componente **Próxima Meta** (ProximaLeitura).

### ✨ Mudanças Realizadas

1. **Novo Componente:** `src/components/ProximaMeta.jsx`
   - Página completa para gerenciar próximas leituras
   - Design consistente com Ruby (#E11D48) e Rose Ivory (#FFF5F7)
   - Funcionalidades: listar, adicionar e remover livros

2. **Rota Adicionada:** `/proxima-meta`
   - Integrada em `src/App.jsx`
   - Passa `usuarioId` como prop

3. **Menu Atualizado:** `src/components/Navbar.jsx`
   - Novo item "Próxima Meta" com ícone 📖
   - Mantém o design original com gradiente Ruby

4. **API Integrada:** `src/services/api.js`
   - `getProximasLeituras(usuarioId)` - Listar livros
   - `createProximaLeitura(payload)` - Criar novo
   - `deleteProximaLeitura(id)` - Remover livro

## 🔧 Endpoints Esperados (Backend)

```
GET    /api/ProximaLeitura?usuarioId={id}  → Listar todos do usuário
POST   /api/ProximaLeitura                  → Criar novo
DELETE /api/ProximaLeitura/{id}             → Remover
```

## 📝 Modelo de Dados

```javascript
{
  id: number,
  titulo: string (obrigatório, max 200),
  autor: string (obrigatório, max 200),
  imageUrl?: string (opcional, max 500),
  complemento?: string (opcional, max 500),
  prioridade: number (1=Alta, 2=Média, 3=Baixa),
  usuarioId?: number
}
```

## 🚀 Como Usar

### 1. Instalar Dependências
```bash
npm install
# ou
pnpm install
```

### 2. Configurar Variáveis de Ambiente
Edite `.env` ou `.env.production`:
```
REACT_APP_API_BASE_URL=https://seu-backend.com
```

### 3. Acessar a Página
- URL: `http://localhost:3000/proxima-meta`
- Ou clique em "Próxima Meta" no menu

### 4. Implementar Backend
Crie os endpoints em `ProximaLeituraController.cs`:
- GET para listar
- POST para criar
- DELETE para remover

## 🎨 Design

- **Cores:** Ruby (#E11D48) + Rose Ivory (#FFF5F7)
- **Prioridades:** 🔴 Alta (vermelho), 🟡 Média (amarelo), 🟢 Baixa (verde)
- **Layout:** Grid responsivo (1-3 colunas)
- **Estilo:** Consistente com MetaLeitura

## 📱 Responsividade

- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 3 colunas

## ✅ Checklist

- [x] Componente criado
- [x] Rota adicionada
- [x] Menu atualizado
- [x] API integrada
- [ ] Backend implementado
- [ ] Testes realizados
- [ ] Enviado para produção

## 🔗 Arquivos Modificados

```
src/
├── components/
│   ├── ProximaMeta.jsx          (NOVO)
│   ├── Navbar.jsx               (MODIFICADO)
│   └── ...
├── services/
│   └── api.js                   (MODIFICADO)
├── App.jsx                      (MODIFICADO)
└── ...
```

## 📚 Documentação Completa

Veja `PROXIMA_META_SETUP.md` para:
- Troubleshooting
- Customizações
- Exemplos de API

---

**Última atualização:** 25 de Fevereiro de 2026
