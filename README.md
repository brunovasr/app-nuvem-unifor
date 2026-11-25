# Sistema de Controle de Biblioteca

**Aluno:** Bruno Vasconcelos Rocha — **Matrícula:** 2612659
**Curso:** Análise e Desenvolvimento de Sistemas — UNIFOR
**Disciplina:** Ambientes de Desenvolvimento de Software

Sistema web de controle de biblioteca: acervo, empréstimos, renovações, devoluções com multa por atraso e administração de usuários. Frontend em React, backend REST em Node.js/Express, banco SQLite, autenticação JWT e testes automatizados.

## Requisitos atendidos

Sistema escolhido: **Controle de Biblioteca** (acervo, empréstimos, devoluções com multa e administração de usuários). Equipe individual (1 pessoa) → mínimo de 6 transações; o sistema possui **10**.

| Requisito | Como foi atendido |
|---|---|
| Trabalho a escolher | Sistema de controle de biblioteca |
| Equipe e transações | 10 transações: cadastrar usuário, login, cadastrar livro, editar livro, excluir livro, emprestar livro, devolver livro (com multa), renovar empréstimo, alterar papel de usuário, excluir usuário |
| Frontend | HTML, CSS, JavaScript e **React** (Vite) em `frontend/` |
| Backend | **Node.js + Express**, Web Service **REST** com rotas em `/api/*` (`backend/src/app.js`) |
| Controle de acesso | **Autenticação** com JWT (senhas com bcrypt) e **autorização** por papel: `leitor` consulta o acervo e gerencia só os próprios empréstimos; `admin` (bibliotecário) gerencia acervo, todos os empréstimos e usuários. O primeiro usuário cadastrado vira admin |
| SGBD | **SQLite** (módulo nativo `node:sqlite`), esquema em `backend/src/db.js` |
| Controle de versão | Git/GitHub, com commits por etapa |
| Testes formais | 19 testes automatizados dos serviços (`node:test` + `supertest`) em `backend/test/` |

### Regras de negócio

- Prazo de empréstimo de 14 dias; uma renovação de 7 dias, não permitida em atraso.
- Limite de 3 empréstimos em aberto por usuário; não é possível pegar dois exemplares do mesmo livro.
- Multa de R$ 1,00 por dia de atraso, calculada na devolução.
- Livro com empréstimo em aberto não pode ser excluído nem ter o total de exemplares reduzido abaixo do emprestado; usuário com empréstimo em aberto não pode ser excluído.

### Rotas da API

| Método | Rota | Acesso |
|---|---|---|
| POST | `/api/auth/registrar`, `/api/auth/login` | público |
| GET | `/api/auth/eu` | autenticado |
| GET | `/api/livros?q=` | autenticado |
| POST | `/api/livros` | admin |
| PUT/DELETE | `/api/livros/:id` | admin |
| GET/POST | `/api/emprestimos` | autenticado (leitor vê só os seus) |
| PATCH | `/api/emprestimos/:id/devolver`, `/renovar` | dono do empréstimo ou admin |
| GET | `/api/admin/usuarios` | admin |
| PATCH | `/api/admin/usuarios/:id/papel` | admin |
| DELETE | `/api/admin/usuarios/:id` | admin |

### Como executar

Requer Node.js 22 ou superior.

```bash
npm run install:tudo   # instala dependências do backend e do frontend
npm test               # executa os testes formais da API
npm run build          # gera o frontend (frontend/dist)
JWT_SECRET=troque-isto npm start   # servidor em http://localhost:3000 (API + React)
```

Para desenvolvimento: `npm --prefix backend start` e, em outro terminal, `npm --prefix frontend run dev`.

Variáveis de ambiente: `PORT`, `JWT_SECRET` (obrigatório em produção) e `DB_FILE` (arquivo SQLite, padrão `biblioteca.sqlite`).

> **Implantação:** o frontend roda no Azure Static Web Apps e a API no Render (veja a seção "Publicação na nuvem" acima). Localmente, `npm start` serve API e frontend juntos.

## Estrutura do repositório

- `backend/` — API Node/Express, banco SQLite e testes (`backend/test/`)
- `frontend/` — aplicação React (Vite)
- `.github/workflows/` — fluxo de implantação do Azure Static Web Apps
- `docs/telas/` — prints do sistema; `docs/entrega/` — PDF e evidências
- `docs/img/` — prints da publicação na nuvem (atividade anterior)

## Publicação na nuvem (sistema completo online)

**Sistema online:** https://salmon-desert-024b56b10.4.azurestaticapps.net

| Parte | Plataforma | Endereço |
|---|---|---|
| Frontend (React) | Microsoft Azure — Static Web Apps, com implantação contínua via GitHub Actions | https://salmon-desert-024b56b10.4.azurestaticapps.net |
| API REST (Node + SQLite) | Render — Web Service gratuito (`render.yaml`) | https://biblioteca-unifor-api.onrender.com (`/api/saude`) |

- O frontend encontra a API pela URL em `frontend/public/config.js` (`window.API_URL`); a API libera o frontend por CORS (`CORS_ORIGIN`).
- **Contas de demonstração:** `bibliotecario@unifor.br` (bibliotecário) e `leitor@unifor.br` (leitor), com a senha definida em `SEED_SENHA` no Render.
- O disco do plano gratuito é temporário: a cada reinício o banco é recriado, e com `SEED_SENHA` definida o sistema cria as duas contas e 4 livros de exemplo.
- O serviço gratuito dorme após ~15 minutos sem uso; o primeiro acesso pode levar cerca de 50 segundos.
- **Prova da publicação:** `docs/telas/09-api-render-live.png` (API *Live* no Render) e `docs/telas/10-sistema-online-azure.png` (sistema aberto no link do Azure).
- Variáveis da API: `JWT_SECRET` (gerada pelo Render), `SEED_SENHA` e `CORS_ORIGIN`.

## Publicação na nuvem (atividade anterior)

O frontend é publicado no **Microsoft Azure** pelo **Azure Static Web Apps** (plano gratuito), com implantação contínua via GitHub Actions. URL pública: **https://salmon-desert-024b56b10.4.azurestaticapps.net**

![Assinatura ativa no Azure](docs/img/01-assinatura-azure.png)

![Recurso Static Web App no portal do Azure](docs/img/02-recurso-static-web-app.png)

![Repositório no GitHub](docs/img/03-repositorio-github.png)
