# Ambientes de Desenvolvimento de Software — evidências

**Aluno:** Bruno Vasconcelos Rocha — **Matrícula:** 2612659
**Disciplina:** Ambientes de Desenvolvimento de Software (UNIFOR)
**Projeto usado como base:** Sistema de Controle de Biblioteca (React + Node/Express + SQLite)

Cada item do enunciado é apresentado com a ferramenta usada no projeto e o print que comprova.

## 1. Ambiente de gestão — Trello

Quadro **"Gestão do projeto Biblioteca UNIFOR"** com as listas Backlog, Em desenvolvimento, Em testes e Concluído, usado para controlar as tarefas do projeto.

![Quadro no Trello](01-trello-quadro-gestao.jpg)

## 2. Ambiente de design de interfaces (UI/UX) — Figma

Arquivo **"Design biblioteca UNIFOR"** no **Figma** com o protótipo das quatro telas do sistema (Login, Acervo, Empréstimos e Usuários), em quadros de 1100 × 700 px, no visual branco e azul da aplicação.

![Protótipo das telas no Figma](02-figma-telas-prototipo.jpg)

![Tela de acervo no Figma](02-figma-tela-acervo.jpg)

## 3. Ambiente de desenvolvimento — IDE

Projeto `app-nuvem-unifor` aberto no **Visual Studio Code**, com as pastas `backend/`, `frontend/` e `docs/` no Explorador, controle de versão Git (branch `main`) na barra inferior e a extensão Claude Code instalada.

![Projeto aberto no VS Code](03-vscode-projeto-aberto.png)

## 4. Ambiente de gestão de banco de dados — cliente SQLite

Banco `biblioteca.sqlite` (SQLite) aberto no **sqlite-web**, cliente web de banco de dados: lista de tabelas, conteúdo da tabela `livros` e estrutura da tabela `usuarios`.

![Tabelas do banco](04-sqlite-web-tabelas.png)

![Conteúdo da tabela livros](04-sqlite-web-livros.png)

![Estrutura da tabela usuarios](04-sqlite-web-estrutura-usuarios.png)

## 5. Ambiente de testes

**Testes formais da API (`node:test` + `supertest`):** 19 testes, todos aprovados (`npm test`).

![Testes formais no terminal](05-testes-formais-terminal.png)

**Teste de interface com Selenium:** o script está em `e2e/teste_selenium.py` (login, acervo, empréstimo e listagem de empréstimos). Os prints gerados pela execução ficam em `docs/ambientes/selenium/`.

Execução (`pip install selenium` e `python e2e/teste_selenium.py`, com o servidor local rodando em `http://localhost:3000`): todas as etapas aprovadas.

![Saída do teste Selenium no terminal](05-selenium-terminal.png)

![Selenium — tela de login](selenium/01-login.png)

![Selenium — acervo após o login do bibliotecário](selenium/02-acervo.png)

![Selenium — empréstimo de Dom Casmurro realizado](selenium/03-emprestimo-realizado.png)

![Selenium — aba de empréstimos](selenium/04-emprestimos.png)

## 6. Ambiente de execução e servidores web

- **Servidor local (Node.js/Express):** `npm start` serve a API REST e o frontend React em `http://localhost:3000`.

  ![Aplicação em execução — login](06-app-local-login.png)

  ![Aplicação em execução — acervo](06-app-local-acervo.png)

- **Servidores na nuvem:** API REST no **Render** e frontend no **Azure Static Web Apps** (prints em `docs/telas/`).

  ![API no Render](../telas/09-api-render-live.png)

  ![Sistema online no Azure](../telas/10-sistema-online-azure.png)

## Observação

Os prints do terminal (testes) foram gerados a partir da saída real de `npm test`, e os do sqlite-web e da aplicação local foram capturados com a aplicação em execução, usando o banco de demonstração criado por `SEED_SENHA`.
