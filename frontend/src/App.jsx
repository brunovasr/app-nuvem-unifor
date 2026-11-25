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

  const sair = () => { localStorage.removeItem('token'); setUsuario(null); setAba('acervo'); };

  if (carregando) return <p>Carregando...</p>;
  if (!usuario) return <Autenticacao aoEntrar={setUsuario} />;

  const abas = [['acervo', 'Acervo'], ['emprestimos', 'Empréstimos'], ...(usuario.papel === 'admin' ? [['usuarios', 'Usuários']] : [])];
  return (
    <>
      <div className="topo">
        <h1>Biblioteca UNIFOR</h1>
        <span>{usuario.nome} ({usuario.papel === 'admin' ? 'bibliotecário' : 'leitor'}) <button onClick={sair}>Sair</button></span>
      </div>
      <nav className="abas">
        {abas.map(([id, nome]) => (
          <button key={id} className={aba === id ? 'ativa' : ''} onClick={() => { setErro(''); setAba(id); }}>{nome}</button>
        ))}
      </nav>
      {erro && <p className="erro">{erro}</p>}
      {aba === 'acervo' && <Livros key={versao} usuario={usuario} aoErro={setErro} aoMudar={mudou} />}
      {aba === 'emprestimos' && <Emprestimos usuario={usuario} aoErro={setErro} versao={versao} aoMudar={mudou} />}
      {aba === 'usuarios' && usuario.papel === 'admin' && <Usuarios eu={usuario} aoErro={setErro} />}
    </>
  );
}
