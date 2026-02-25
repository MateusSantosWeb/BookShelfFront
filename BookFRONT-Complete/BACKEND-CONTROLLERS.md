# 🎯 Controllers ASP.NET para BookShelf

Este arquivo contém os Controllers completos para integrar com o frontend React.

## 📋 Configuração Inicial

### 1. Program.cs

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar CORS para React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// IMPORTANTE: Usar CORS
app.UseCors("AllowReact");

app.UseAuthorization();
app.MapControllers();

app.Run();
```

## 📚 Models

### Livro.cs

```csharp
namespace BookShelf.Models
{
    public class Livro
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Autor { get; set; }
        public string Capa { get; set; }
        public int DiasLeitura { get; set; }
        public int Avaliacao { get; set; }        // 1-5 estrelas
        public int Favorito { get; set; }         // 1-5 corações
        public int Intensidade { get; set; }      // 1-5 fogos
        public int Emocao { get; set; }           // 1-5 emojis
        public DateTime DataCadastro { get; set; }
        public string? Genero { get; set; }
    }
}
```

### CalendarioAnual.cs

```csharp
namespace BookShelf.Models
{
    public class CalendarioAnual
    {
        public int Id { get; set; }
        public int Mes { get; set; }              // 1-12
        public int QuantidadeLivros { get; set; }
        public int Ano { get; set; }
    }
}
```

### DesafioAZ.cs

```csharp
namespace BookShelf.Models
{
    public class DesafioAZ
    {
        public int Id { get; set; }
        public string Letra { get; set; }         // A-Z
        public string? TituloLivro { get; set; }
        public bool Completo { get; set; }
    }
}
```

### MetaLeitura.cs

```csharp
namespace BookShelf.Models
{
    public class MetaLeitura
    {
        public int Id { get; set; }
        public int Ano { get; set; }
        public int MetaAnual { get; set; }
        public int LivrosLidos { get; set; }
    }
}
```

## 🎮 Controllers

### LivrosController.cs

```csharp
using Microsoft.AspNetCore.Mvc;
using BookShelf.Models;
using BookShelf.Data;

namespace BookShelf.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LivrosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LivrosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/livros
        [HttpGet]
        public ActionResult<IEnumerable<Livro>> GetLivros()
        {
            var livros = _context.Livros
                .OrderByDescending(l => l.DataCadastro)
                .ToList();
            
            return Ok(livros);
        }

        // GET: api/livros/5
        [HttpGet("{id}")]
        public ActionResult<Livro> GetLivro(int id)
        {
            var livro = _context.Livros.Find(id);

            if (livro == null)
            {
                return NotFound();
            }

            return Ok(livro);
        }

        // POST: api/livros
        [HttpPost]
        public ActionResult<Livro> CadastrarLivro([FromBody] Livro livro)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            livro.DataCadastro = DateTime.Now;
            _context.Livros.Add(livro);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetLivro), new { id = livro.Id }, livro);
        }

        // PUT: api/livros/5
        [HttpPut("{id}")]
        public IActionResult AtualizarLivro(int id, [FromBody] Livro livro)
        {
            if (id != livro.Id)
            {
                return BadRequest();
            }

            _context.Entry(livro).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Livros.Any(l => l.Id == id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/livros/5
        [HttpDelete("{id}")]
        public IActionResult DeletarLivro(int id)
        {
            var livro = _context.Livros.Find(id);
            
            if (livro == null)
            {
                return NotFound();
            }

            _context.Livros.Remove(livro);
            _context.SaveChanges();

            return NoContent();
        }

        // GET: api/livros/favoritos
        [HttpGet("favoritos")]
        public ActionResult<IEnumerable<Livro>> GetFavoritos()
        {
            var favoritos = _context.Livros
                .Where(l => l.Favorito >= 4)
                .OrderByDescending(l => l.Favorito)
                .ToList();

            return Ok(favoritos);
        }
    }
}
```

### CalendarioController.cs

```csharp
using Microsoft.AspNetCore.Mvc;
using BookShelf.Models;
using BookShelf.Data;

namespace BookShelf.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CalendarioController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CalendarioController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/calendario
        [HttpGet]
        public ActionResult GetCalendario([FromQuery] int? ano)
        {
            int anoAtual = ano ?? DateTime.Now.Year;

            var dados = _context.CalendarioAnual
                .Where(c => c.Ano == anoAtual)
                .OrderBy(c => c.Mes)
                .ToDictionary(c => c.Mes, c => c.QuantidadeLivros);

            // Preencher meses faltantes com 0
            var resultado = new Dictionary<string, int>();
            var meses = new[] { "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                               "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" };

            for (int i = 1; i <= 12; i++)
            {
                resultado[meses[i - 1]] = dados.ContainsKey(i) ? dados[i] : 0;
            }

            return Ok(resultado);
        }

        // POST: api/calendario
        [HttpPost]
        public ActionResult SalvarCalendario([FromBody] Dictionary<string, int> calendario)
        {
            var meses = new[] { "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                               "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" };
            
            int anoAtual = DateTime.Now.Year;

            foreach (var item in calendario)
            {
                int mesNumero = Array.IndexOf(meses, item.Key) + 1;
                
                var registro = _context.CalendarioAnual
                    .FirstOrDefault(c => c.Ano == anoAtual && c.Mes == mesNumero);

                if (registro != null)
                {
                    registro.QuantidadeLivros = item.Value;
                }
                else
                {
                    _context.CalendarioAnual.Add(new CalendarioAnual
                    {
                        Ano = anoAtual,
                        Mes = mesNumero,
                        QuantidadeLivros = item.Value
                    });
                }
            }

            _context.SaveChanges();
            return Ok();
        }

        // GET: api/calendario/total
        [HttpGet("total")]
        public ActionResult GetTotalAno([FromQuery] int? ano)
        {
            int anoAtual = ano ?? DateTime.Now.Year;

            var total = _context.CalendarioAnual
                .Where(c => c.Ano == anoAtual)
                .Sum(c => c.QuantidadeLivros);

            return Ok(new { total });
        }
    }
}
```

### DesafioAZController.cs

```csharp
using Microsoft.AspNetCore.Mvc;
using BookShelf.Models;
using BookShelf.Data;

namespace BookShelf.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DesafioAZController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DesafioAZController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/desafioaz
        [HttpGet]
        public ActionResult GetDesafio()
        {
            var desafio = _context.DesafioAZ
                .OrderBy(d => d.Letra)
                .ToDictionary(d => d.Letra, d => d.TituloLivro ?? "");

            // Preencher letras faltantes
            var alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var resultado = new Dictionary<string, string>();

            foreach (char letra in alfabeto)
            {
                string letraStr = letra.ToString();
                resultado[letraStr] = desafio.ContainsKey(letraStr) ? desafio[letraStr] : "";
            }

            return Ok(resultado);
        }

        // POST: api/desafioaz
        [HttpPost]
        public ActionResult SalvarDesafio([FromBody] Dictionary<string, string> desafio)
        {
            foreach (var item in desafio)
            {
                var registro = _context.DesafioAZ
                    .FirstOrDefault(d => d.Letra == item.Key);

                if (registro != null)
                {
                    registro.TituloLivro = item.Value;
                    registro.Completo = !string.IsNullOrWhiteSpace(item.Value);
                }
                else
                {
                    _context.DesafioAZ.Add(new DesafioAZ
                    {
                        Letra = item.Key,
                        TituloLivro = item.Value,
                        Completo = !string.IsNullOrWhiteSpace(item.Value)
                    });
                }
            }

            _context.SaveChanges();
            return Ok();
        }

        // GET: api/desafioaz/progresso
        [HttpGet("progresso")]
        public ActionResult GetProgresso()
        {
            var completos = _context.DesafioAZ
                .Count(d => d.Completo);

            return Ok(new { completos, total = 26, porcentagem = (completos * 100) / 26 });
        }
    }
}
```

### MetaController.cs

```csharp
using Microsoft.AspNetCore.Mvc;
using BookShelf.Models;
using BookShelf.Data;

namespace BookShelf.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MetaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MetaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/meta
        [HttpGet]
        public ActionResult GetMeta([FromQuery] int? ano)
        {
            int anoAtual = ano ?? DateTime.Now.Year;

            var meta = _context.MetaLeitura
                .FirstOrDefault(m => m.Ano == anoAtual);

            if (meta == null)
            {
                meta = new MetaLeitura
                {
                    Ano = anoAtual,
                    MetaAnual = 0,
                    LivrosLidos = 0
                };
            }

            // Contar livros por gênero
            var generos = _context.Livros
                .Where(l => l.DataCadastro.Year == anoAtual)
                .GroupBy(l => l.Genero)
                .Select(g => new { genero = g.Key, quantidade = g.Count() })
                .ToDictionary(g => g.genero ?? "Sem Gênero", g => g.quantidade);

            return Ok(new
            {
                meta = meta.MetaAnual,
                livrosLidos = meta.LivrosLidos,
                generos
            });
        }

        // POST: api/meta
        [HttpPost]
        public ActionResult SalvarMeta([FromBody] MetaLeitura novaMeta)
        {
            int anoAtual = DateTime.Now.Year;

            var meta = _context.MetaLeitura
                .FirstOrDefault(m => m.Ano == anoAtual);

            if (meta != null)
            {
                meta.MetaAnual = novaMeta.MetaAnual;
                _context.SaveChanges();
            }
            else
            {
                _context.MetaLeitura.Add(new MetaLeitura
                {
                    Ano = anoAtual,
                    MetaAnual = novaMeta.MetaAnual,
                    LivrosLidos = 0
                });
                _context.SaveChanges();
            }

            return Ok();
        }

        // PUT: api/meta/atualizar-lidos
        [HttpPut("atualizar-lidos")]
        public ActionResult AtualizarLivrosLidos()
        {
            int anoAtual = DateTime.Now.Year;

            var meta = _context.MetaLeitura
                .FirstOrDefault(m => m.Ano == anoAtual);

            if (meta != null)
            {
                meta.LivrosLidos = _context.Livros
                    .Count(l => l.DataCadastro.Year == anoAtual);
                
                _context.SaveChanges();
            }

            return Ok();
        }
    }
}
```

## 🗄️ DbContext

### ApplicationDbContext.cs

```csharp
using Microsoft.EntityFrameworkCore;
using BookShelf.Models;

namespace BookShelf.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Livro> Livros { get; set; }
        public DbSet<CalendarioAnual> CalendarioAnual { get; set; }
        public DbSet<DesafioAZ> DesafioAZ { get; set; }
        public DbSet<MetaLeitura> MetaLeitura { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurações adicionais se necessário
            modelBuilder.Entity<Livro>()
                .Property(l => l.Titulo)
                .IsRequired()
                .HasMaxLength(200);

            modelBuilder.Entity<Livro>()
                .Property(l => l.Autor)
                .IsRequired()
                .HasMaxLength(200);
        }
    }
}
```

## 📝 Configuração do DbContext no Program.cs

```csharp
// Adicionar antes de builder.Build()
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

## ⚙️ appsettings.json

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BookShelfDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

## 🚀 Migrations

Execute no Package Manager Console:

```
Add-Migration InitialCreate
Update-Database
```

Pronto! Agora seu backend está configurado e pronto para integrar com o React! 🎉
