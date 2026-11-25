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
    <>
      <h1>{modoCadastro ? 'Criar conta' : 'Entrar'}</h1>
      <form onSubmit={enviar}>
        {modoCadastro && <input placeholder="Nome" value={form.nome} onChange={mudar('nome')} required />}
        <input type="email" placeholder="E-mail" value={form.email} onChange={mudar('email')} required />
        <input type="password" placeholder="Senha (mín. 6)" value={form.senha} onChange={mudar('senha')} required />
        <button>{modoCadastro ? 'Cadastrar' : 'Entrar'}</button>
      </form>
      {erro && <p className="erro">{erro}</p>}
      <button type="button" onClick={() => setModoCadastro(!modoCadastro)}>
        {modoCadastro ? 'Já tenho conta' : 'Criar uma conta'}
      </button>
    </>
  );
}
