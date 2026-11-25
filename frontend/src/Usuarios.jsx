import { useEffect, useState } from 'react';
import { chamar } from './api.js';

export default function Usuarios({ eu, aoErro }) {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('');
  const executar = (fn) => { aoErro(''); return fn().catch((e) => aoErro(e.message)); };
  const carregar = () => executar(async () => setUsuarios(await chamar('GET', '/api/admin/usuarios')));
  useEffect(() => { carregar(); }, []);

  const alternarPapel = (u) => executar(async () => {
    await chamar('PATCH', `/api/admin/usuarios/${u.id}/papel`, { papel: u.papel === 'admin' ? 'leitor' : 'admin' });
    await carregar();
  });
  const excluir = (u) => executar(async () => { await chamar('DELETE', `/api/admin/usuarios/${u.id}`); await carregar(); });

  const termo = filtro.trim().toLowerCase();
  const visiveis = usuarios.filter((u) => !termo || u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo));

  return (
    <>
      <h2>Usuários</h2>
      <p className="subtitulo">Gerencie os acessos e papéis da comunidade acadêmica.</p>

      <div className="barra">
        <form className="busca" onSubmit={(e) => { e.preventDefault(); setFiltro(busca); }}>
          <input placeholder="Buscar por nome ou e-mail" value={busca} onChange={(e) => setBusca(e.target.value)} />
          <button className="primario">Buscar</button>
        </form>
        <small>{usuarios.length} {usuarios.length === 1 ? 'usuário cadastrado' : 'usuários cadastrados'}</small>
      </div>

      <div className="tabela-caixa">
        <table>
          <thead>
            <tr><th>Nome</th><th>E-mail</th><th>Papel</th><th></th></tr>
          </thead>
          <tbody>
            {visiveis.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.nome}</strong></td>
                <td>{u.email}</td>
                <td><span className={`distintivo ${u.papel === 'admin' ? 'admin' : ''}`}>{u.papel === 'admin' ? 'Bibliotecário' : 'Leitor'}</span></td>
                <td className="acoes-celula">
                  {u.id !== eu.id && (
                    <>
                      <button onClick={() => alternarPapel(u)}>{u.papel === 'admin' ? 'Tornar leitor' : 'Tornar bibliotecário'}</button>
                      <button className="perigo" onClick={() => excluir(u)}>Excluir</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {!visiveis.length && <tr><td colSpan="4" className="vazio">Nenhum usuário encontrado.</td></tr>}
          </tbody>
        </table>
      </div>

      <p className="aviso">Leitores acessam o acervo. Bibliotecários também gerenciam livros, empréstimos e usuários.</p>
    </>
  );
}
