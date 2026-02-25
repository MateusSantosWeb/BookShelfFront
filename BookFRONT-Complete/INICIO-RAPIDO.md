# 🚀 GUIA DE INÍCIO RÁPIDO - BookShelf React

## ⚡ Instalação Rápida

### 1️⃣ Extrair o projeto
Extraia a pasta `bookshelf-react` para onde você quiser.

### 2️⃣ Instalar Node.js
Se não tiver, baixe em: https://nodejs.org/

### 3️⃣ Instalar dependências
```bash
cd bookshelf-react
npm install
```

### 4️⃣ Rodar o projeto
```bash
npm start
```

✅ O projeto vai abrir automaticamente em: `http://localhost:3000`

---

## 🔗 Conectar com seu Backend ASP.NET

### Passo 1: Configurar CORS

No seu `Program.cs` do ASP.NET, adicione:

```csharp
// ANTES de builder.Build()
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// DEPOIS de app = builder.Build()
app.UseCors("AllowReact");
```

### Passo 2: Criar os Controllers

Veja o arquivo `BACKEND-CONTROLLERS.md` com todos os controllers prontos!

### Passo 3: Conectar nos componentes React

Em cada componente (Biblioteca.jsx, CalendarioAnual.jsx, etc.), descomente as linhas de `fetch`:

```javascript
// ANTES (comentado):
// fetch('https://localhost:7000/api/livros')
//   .then(res => res.json())
//   .then(data => setLivros(data));

// DEPOIS (descomentado com sua URL):
fetch('https://localhost:5001/api/livros')  // Coloque a URL do seu backend
  .then(res => res.json())
  .then(data => setLivros(data))
  .catch(err => console.error(err));
```

---

## 📱 Telas Disponíveis

1. **/** - Tela inicial (entrada do nome)
2. **/biblioteca** - Grid de livros
3. **/calendario** - Calendário anual
4. **/alfabeto** - Desafio A-Z
5. **/meta** - Meta de leitura
6. **/avaliacao** - Sistema de avaliação
7. **/cadastro-livro** - Cadastrar novo livro

---

## 🎨 Design

✅ Cores **exatamente** como nos prints
✅ Layout **idêntico** à documentação
✅ Ruby (#E11D48) + Rose Ivory (#FFF5F7)
✅ 100% Responsivo

---

## 🆘 Problemas Comuns

### ❌ Erro de CORS
**Solução:** Verifique se adicionou `app.UseCors("AllowReact")` no Program.cs

### ❌ Página em branco
**Solução:** Abra o Console (F12) e veja os erros

### ❌ API não responde
**Solução:** Verifique se o backend ASP.NET está rodando e na porta correta

---

## 📞 Estrutura dos Arquivos

```
bookshelf-react/
├── src/
│   ├── components/          ← Todos os componentes
│   ├── App.jsx             ← Rotas principais
│   ├── App.css             ← Estilos (cores Ruby + Rose Ivory)
│   └── index.js            ← Entrada do app
├── public/
│   └── index.html
├── package.json
├── README.md               ← Documentação completa
└── BACKEND-CONTROLLERS.md  ← Controllers ASP.NET prontos
```

---

## ✅ Checklist de Integração

- [ ] Node.js instalado
- [ ] `npm install` executado
- [ ] `npm start` funcionando
- [ ] Backend ASP.NET rodando
- [ ] CORS configurado
- [ ] Controllers criados
- [ ] URLs da API atualizadas nos componentes
- [ ] Teste completo feito

---

**🎉 Pronto! Seu BookShelf está funcionando!**

Qualquer dúvida, consulte o README.md ou BACKEND-CONTROLLERS.md
