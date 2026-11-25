import { useState } from 'react';
import { chamar } from './api.js';

export default function Autenticacao({ aoEntrar }) {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [erro, setErro] = useState('');

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    try {
      const url = modoCadastro ? '/api/auth/registrar' : '/api/auth/login';
      const { token, usuario } = await chamar('POST', url, form);
      localStorage.setItem('token', token);
      aoEntrar(usuario);
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className="entrada">
      <aside className="entrada-lateral">
        <div className="marca-lateral">
          <strong>UNIFOR</strong>
          <span>BIBLIOTECA UNIVERSITÁRIA</span>
        </div>
        <div>
          <h2>Conhecimento que abre caminhos.</h2>
          <p>Seu acervo, seus empréstimos e novas descobertas em um só lugar.</p>
        </div>
        <div className="rodape-lateral">Sistema de Controle de Biblioteca</div>
      </aside>

      <main className="entrada-form">
        <div className="caixa">
          <span className="etiqueta">BEM-VINDO À BIBLIOTECA</span>
          <h1>{modoCadastro ? 'Crie sua conta' : 'Acesse sua conta'}</h1>
          <p className="subtitulo">
            {modoCadastro ? 'Cadastre-se para pegar livros emprestados.' : 'Entre para gerenciar sua experiência na biblioteca.'}
          </p>

          <form onSubmit={enviar}>
            {modoCadastro && (
              <div className="campo">
                <label htmlFor="nome">Nome</label>
                <input id="nome" placeholder="Seu nome completo" value={form.nome} onChange={mudar('nome')} required />
              </div>
            )}
            <div className="campo">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" placeholder="seu.email@unifor.br" value={form.email} onChange={mudar('email')} required />
            </div>
            <div className="campo">
              <label htmlFor="senha">Senha</label>
              <input id="senha" type="password" placeholder={modoCadastro ? 'Mínimo de 6 caracteres' : 'Digite sua senha'} value={form.senha} onChange={mudar('senha')} required />
            </div>
            <button className="primario">{modoCadastro ? 'Cadastrar' : 'Entrar'}</button>
          </form>
          {erro && <p className="erro">{erro}</p>}

          <p className="troca">
            {modoCadastro ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}
            <button type="button" className="link" onClick={() => { setErro(''); setModoCadastro(!modoCadastro); }}>
              {modoCadastro ? 'Entrar' : 'Criar uma conta'}
            </button>
          </p>
          <p className="nota">Acesso exclusivo à comunidade acadêmica UNIFOR.</p>
        </div>
      </main>
    </div>
  );
}
