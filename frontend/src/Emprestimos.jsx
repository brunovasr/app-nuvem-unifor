import { useEffect, useState } from 'react';
import { chamar } from './api.js';

const data = (iso) => new Date(iso).toLocaleDateString('pt-BR');
const reais = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Emprestimos({ usuario, aoErro, versao, aoMudar }) {
  const [lista, setLista] = useState([]);
  const executar = (fn) => { aoErro(''); return fn().catch((e) => aoErro(e.message)); };
  const carregar = () => executar(async () => setLista(await chamar('GET', '/api/emprestimos')));
  useEffect(() => { carregar(); }, [versao]);

  const acao = (e, rota) => executar(async () => { await chamar('PATCH', `/api/emprestimos/${e.id}/${rota}`); await carregar(); aoMudar(); });

  return (
    <>
      <h2>{usuario.papel === 'admin' ? 'Todos os empréstimos' : 'Meus empréstimos'}</h2>
      <ul>
        {lista.map((e) => (
          <li key={e.id} className={e.data_devolucao ? 'feita' : ''}>
            <span>
              {e.titulo}
              {usuario.papel === 'admin' && <small> · {e.usuario_nome}</small>}
              <small> · devolver até {data(e.data_prevista)}</small>
              {e.atrasado && <small className="erro"> · ATRASADO (multa {reais(e.multa_prevista_centavos)})</small>}
              {e.data_devolucao && <small> · devolvido em {data(e.data_devolucao)}{e.multa_centavos > 0 && ` (multa ${reais(e.multa_centavos)})`}</small>}
            </span>
            {!e.data_devolucao && (
              <span className="acoes">
                <button onClick={() => acao(e, 'renovar')}>Renovar</button>
                <button onClick={() => acao(e, 'devolver')}>Devolver</button>
              </span>
            )}
          </li>
        ))}
        {!lista.length && <li>Nenhum empréstimo.</li>}
      </ul>
    </>
  );
}
