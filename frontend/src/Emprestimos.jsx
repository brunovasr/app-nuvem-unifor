import { useEffect, useState } from 'react';
import { chamar } from './api.js';

const data = (iso) => new Date(iso).toLocaleDateString('pt-BR');
const reais = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const DIA_MS = 24 * 60 * 60 * 1000;

export default function Emprestimos({ usuario, aoErro, versao, aoMudar }) {
  const admin = usuario.papel === 'admin';
  const [lista, setLista] = useState([]);
  const executar = (fn) => { aoErro(''); return fn().catch((e) => aoErro(e.message)); };
  const carregar = () => executar(async () => setLista(await chamar('GET', '/api/emprestimos')));
  useEffect(() => { carregar(); }, [versao]);

  const acao = (e, rota) => executar(async () => { await chamar('PATCH', `/api/emprestimos/${e.id}/${rota}`); await carregar(); aoMudar(); });

  const ativos = lista.filter((e) => !e.data_devolucao).length;
  const atrasados = lista.filter((e) => e.atrasado).length;
  const diasAtraso = (e) => Math.max(1, Math.ceil((Date.now() - new Date(e.data_prevista)) / DIA_MS));

  return (
    <>
      <h2>{admin ? 'Todos os empréstimos' : 'Meus empréstimos'}</h2>
      <p className="subtitulo">Acompanhe prazos, renovações e devoluções.</p>

      <div className="chips">
        <span className="chip">{ativos} {ativos === 1 ? 'empréstimo ativo' : 'empréstimos ativos'}</span>
        {atrasados > 0 && <span className="chip atraso">{atrasados} {atrasados === 1 ? 'devolução em atraso' : 'devoluções em atraso'}</span>}
      </div>

      <div className="tabela-caixa">
        <table>
          <thead>
            <tr>
              <th>{admin ? 'Livro / leitor' : 'Livro'}</th>
              <th>Empréstimo</th>
              <th>Devolução prevista</th>
              <th>Multa</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lista.map((e) => (
              <tr key={e.id} className={e.data_devolucao ? 'feita' : ''}>
                <td>
                  <strong>{e.titulo}</strong>
                  {admin && <small>{e.usuario_nome}</small>}
                </td>
                <td>{data(e.data_emprestimo)}</td>
                <td>
                  {data(e.data_prevista)}
                  {e.data_devolucao
                    ? <small> · devolvido em {data(e.data_devolucao)}</small>
                    : e.atrasado
                      ? <small className="atrasado"> · ATRASADO ({diasAtraso(e)} {diasAtraso(e) === 1 ? 'dia' : 'dias'})</small>
                      : <small className="ok"> · dentro do prazo</small>}
                </td>
                <td className={e.atrasado ? 'atrasado' : ''}>{reais(e.data_devolucao ? e.multa_centavos : e.multa_prevista_centavos)}</td>
                <td className="acoes-celula">
                  {!e.data_devolucao && (
                    <>
                      <button disabled={e.renovacoes >= 1} title={e.renovacoes >= 1 ? 'Já renovado' : ''} onClick={() => acao(e, 'renovar')}>Renovar</button>
                      <button className="primario" onClick={() => acao(e, 'devolver')}>Devolver</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {!lista.length && <tr><td colSpan="5" className="vazio">Nenhum empréstimo.</td></tr>}
          </tbody>
        </table>
      </div>

      <p className="aviso">
        <strong>Prazos e multas</strong>
        Prazo padrão: 14 dias · Renovação única de 7 dias, se não houver atraso · Multa por atraso: R$ 1,00/dia · Limite de 3 empréstimos ativos
      </p>
    </>
  );
}
