import { useEffect, useState } from 'react';
import { chamar } from './api.js';
import Autenticacao from './Autenticacao.jsx';
import Livros from './Livros.jsx';
import Emprestimos from './Emprestimos.jsx';
import Usuarios from './Usuarios.jsx';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(Boolean(localStorage.getItem('token')));
  const [erro, setErro] = useState('');
  const [aba, setAba] = useState('acervo');
  const [versao, setVersao] = useState(0); // força recarregar listas após empréstimo/devolução
  const mudou = () => setVersao((v) => v + 1);

  // Restaura a sessão a partir do token salvo.
  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    chamar('GET', '/api/auth/eu')
      .then(setUsuario)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setCarregando(false));
  }, []);

  const sair = () => { localStorage.removeItem('token'); setUsuario(null); setAba('acervo'); setErro(''); };

  if (carregando) return <p className="carregando">Carregando...</p>;
  if (!usuario) return <Autenticacao aoEntrar={setUsuario} />;

  const admin = usuario.papel === 'admin';
  const abas = [['acervo', 'Acervo'], ['emprestimos', 'Empréstimos'], ...(admin ? [['usuarios', 'Usuários']] : [])];
  return (
    <div className="app">
      <header className="cabecalho">
        <div className="marca">
          <h1>Biblioteca UNIFOR</h1>
          <small>Sistema de Controle de Biblioteca</small>
        </div>
        <div className="sessao">
          <div>
            <strong>{usuario.nome}</strong>
            <small>{admin ? 'Bibliotecário' : 'Leitor'}</small>
          </div>
          <button onClick={sair}>Sair</button>
        </div>
      </header>
      <nav className="abas">
        {abas.map(([id, nome]) => (
          <button key={id} className={aba === id ? 'ativa' : ''} onClick={() => { setErro(''); setAba(id); }}>{nome}</button>
        ))}
      </nav>
      <main className="conteudo">
        {erro && <p className="erro">{erro}</p>}
        {aba === 'acervo' && <Livros key={versao} usuario={usuario} aoErro={setErro} aoMudar={mudou} />}
        {aba === 'emprestimos' && <Emprestimos usuario={usuario} aoErro={setErro} versao={versao} aoMudar={mudou} />}
        {aba === 'usuarios' && admin && <Usuarios eu={usuario} aoErro={setErro} />}
      </main>
      <footer className="rodape"><span>Biblioteca UNIFOR</span></footer>
    </div>
  );
}
