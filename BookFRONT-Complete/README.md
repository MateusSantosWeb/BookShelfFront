# 📚 BookShelf - Frontend React

Aplicação React para gerenciamento de biblioteca pessoal de livros, com design **exatamente** igual aos prints fornecidos.

## 🎨 Cores do Projeto

- **Ruby (Principal):** `#E11D48` - Headers, botões, destaques
- **Rose Ivory (Secundária):** `#FFF5F7` / `#FFE4E9` - Backgrounds e cards

## ✨ Funcionalidades

1. **Tela Inicial** - Entrada do nome do usuário
2. **Biblioteca** - Grid de livros com capas, avaliações e favoritos
3. **Calendário Anual** - Rastreamento de leitura por mês
4. **Desafio A-Z** - Checklist de livros por letra do alfabeto
5. **Meta de Leitura** - Definição e acompanhamento de meta anual
6. **Sistema de Avaliação** - Guia de avaliação com estrelas
7. **Cadastro de Livro** - Formulário com emojis de reação

## 🌐 Deploy (Pronto)

O projeto já está preparado para hospedagem SPA (React Router):

- `public/_redirects` para fallback de rotas
- `netlify.toml` para deploy no Netlify
- `vercel.json` para deploy no Vercel
- `.env.production` para URL da API em produção

### Passos obrigatórios

1. Ajuste `REACT_APP_API_BASE_URL` em `.env.production` para a URL pública da sua API.
2. Rode `npm run build`.
3. Publique a pasta `build/` (ou conecte o repositório no Vercel/Netlify).

## 🚀 Como Rodar

### 1. Instalar Dependências

```bash
cd bookshelf-react
npm install
```

### 2. Rodar o Projeto

```bash
npm start
```

O app vai abrir em: `http://localhost:3000`

## 🔌 Integração com Backend ASP.NET

### Configuração do CORS no ASP.NET

Adicione no `Program.cs` ou `Startup.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Depois de builder.Build()
app.UseCors("AllowReact");
```

### Endpoints da API Necessários

Crie estes Controllers no seu projeto ASP.NET:

#### 1. LivrosController.cs

```csharp
[ApiController]
[Route("api/[controller]")]
public class LivrosController : ControllerBase
{
    // GET: api/livros
    [HttpGet]
    public IActionResult GetLivros()
    {
        // Retornar lista de livros do banco
        return Ok(livros);
    }

    // POST: api/livros
    [HttpPost]
    public IActionResult CadastrarLivro([FromBody] Livro livro)
    {
        // Salvar livro no banco
        return Ok(livro);
    }

    // GET: api/livros/{id}
    [HttpGet("{id}")]
    public IActionResult GetLivro(int id)
    {
        // Retornar livro específico
        return Ok(livro);
    }

    // PUT: api/livros/{id}
    [HttpPut("{id}")]
    public IActionResult AtualizarLivro(int id, [FromBody] Livro livro)
    {
        // Atualizar livro
        return Ok();
    }

    // DELETE: api/livros/{id}
    [HttpDelete("{id}")]
    public IActionResult DeletarLivro(int id)
    {
        // Deletar livro
        return Ok();
    }
}
```

#### 2. CalendarioController.cs

```csharp
[ApiController]
[Route("api/[controller]")]
public class CalendarioController : ControllerBase
{
    // GET: api/calendario
    [HttpGet]
    public IActionResult GetCalendario()
    {
        return Ok(calendario);
    }

    // POST: api/calendario
    [HttpPost]
    public IActionResult SalvarCalendario([FromBody] Dictionary<string, int> calendario)
    {
        return Ok();
    }
}
```

#### 3. DesafioAZController.cs

```csharp
[ApiController]
[Route("api/[controller]")]
public class DesafioAZController : ControllerBase
{
    // GET: api/desafioaz
    [HttpGet]
    public IActionResult GetDesafio()
    {
        return Ok(desafio);
    }

    // POST: api/desafioaz
    [HttpPost]
    public IActionResult SalvarDesafio([FromBody] Dictionary<string, string> desafio)
    {
        return Ok();
    }
}
```

#### 4. MetaController.cs

```csharp
[ApiController]
[Route("api/[controller]")]
public class MetaController : ControllerBase
{
    // GET: api/meta
    [HttpGet]
    public IActionResult GetMeta()
    {
        return Ok(meta);
    }

    // POST: api/meta
    [HttpPost]
    public IActionResult SalvarMeta([FromBody] Meta meta)
    {
        return Ok();
    }
}
```

### Conectar React ao Backend

Nos componentes React, descomente as linhas de fetch e configure a URL da sua API:

```javascript
// Exemplo em Biblioteca.jsx
useEffect(() => {
  fetch('https://localhost:7000/api/livros')  // Sua URL do backend
    .then(res => res.json())
    .then(data => setLivros(data))
    .catch(err => console.error(err));
}, []);
```

## 📁 Estrutura do Projeto

```
bookshelf-react/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Avaliacao.jsx
│   │   ├── Biblioteca.jsx
│   │   ├── CadastroLivro.jsx
│   │   ├── CalendarioAnual.jsx
│   │   ├── DesafioAZ.jsx
│   │   ├── MetaLeitura.jsx
│   │   ├── Navbar.jsx
│   │   └── TelaInicial.jsx
│   ├── App.css
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

## 🎯 Próximos Passos

1. ✅ Rodar o frontend React
2. ⚙️ Configurar CORS no ASP.NET
3. 🔌 Criar os Controllers da API
4. 🔗 Conectar os componentes com a API
5. 💾 Testar integração completa

## 📝 Modelo de Dados

### Livro

```typescript
{
  id: number,
  titulo: string,
  autor: string,
  capa: string,
  diasLeitura: number,
  avaliacao: number,      // 1-5 estrelas
  favorito: number,       // 1-5 corações
  intensidade: number,    // 1-5 fogos
  emocao: number,         // 1-5 (triste a feliz)
  dataCadastro: Date
}
```

## 🛠️ Tecnologias

- React 18
- React Router DOM 6
- CSS3 (sem frameworks)
- Fetch API para requisições

## 💡 Observações

- O design está **exatamente** como nos prints fornecidos
- Todas as cores seguem a paleta Rose Ivory + Ruby
- Layout 100% responsivo
- Código limpo e comentado
- Pronto para integração com ASP.NET

## 📧 Suporte

Se precisar de ajuda com a integração, verifique:
- Console do navegador para erros
- Network tab para ver requisições
- CORS configurado corretamente
- URLs da API corretas
# BookFRONT
# BookFRONT
