import { useEffect, useState } from 'react';
import { chamar } from './api.js';

export default function Usuarios({ eu, aoErro }) {
  const [usuarios, setUsuarios] = useState([]);
  const executar = (fn) => fn().catch((e) => aoErro(e.message));
  const carregar = () => executar(async () => setUsuarios(await chamar('GET', '/api/admin/usuarios')));
  useEffect(() => { carregar(); }, []);

  const alternarPapel = (u) => executar(async () => {
    await chamar('PATCH', `/api/admin/usuarios/${u.id}/papel`, { papel: u.papel === 'admin' ? 'leitor' : 'admin' });
    await carregar();
  });
  const excluir = (u) => executar(async () => { await chamar('DELETE', `/api/admin/usuarios/${u.id}`); await carregar(); });

  return (
    <>
      <h2>Usuários</h2>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            <span>{u.nome} <small>{u.email} — {u.papel}</small></span>
            {u.id !== eu.id && (
              <span className="acoes">
                <button onClick={() => alternarPapel(u)}>{u.papel === 'admin' ? 'Tornar leitor' : 'Tornar admin'}</button>
                <button onClick={() => excluir(u)}>Excluir</button>
              </span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
