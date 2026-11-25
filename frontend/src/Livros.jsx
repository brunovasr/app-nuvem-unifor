import { useEffect, useState } from 'react';
import { chamar } from './api.js';

const vazio = { titulo: '', autor: '', isbn: '', exemplares_total: 1 };

export default function Livros({ usuario, aoErro, aoMudar }) {
  const admin = usuario.papel === 'admin';
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState(null);

  const executar = (fn) => { aoErro(''); return fn().catch((e) => aoErro(e.message)); };
  const carregar = (q = busca) => executar(async () => setLivros(await chamar('GET', `/api/livros?q=${encodeURIComponent(q)}`)));
  useEffect(() => { carregar(''); }, []);

  const mudar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });
  const salvar = (e) => { e.preventDefault(); executar(async () => {
    const corpo = { ...form, exemplares_total: Number(form.exemplares_total) };
    if (editando) await chamar('PUT', `/api/livros/${editando}`, corpo);
    else await chamar('POST', '/api/livros', corpo);
    setForm(vazio); setEditando(null); await carregar();
  }); };
  const editar = (l) => { setEditando(l.id); setForm({ titulo: l.titulo, autor: l.autor, isbn: l.isbn, exemplares_total: l.exemplares_total }); };
  const excluir = (l) => executar(async () => { await chamar('DELETE', `/api/livros/${l.id}`); await carregar(); });
  const emprestar = (l) => executar(async () => { await chamar('POST', '/api/emprestimos', { livro_id: l.id }); await carregar(); aoMudar(); });

  return (
    <div className={`acervo ${admin ? '' : 'leitor'}`}>
      <section>
        <h2>Acervo</h2>
        <p className="subtitulo">Explore e gerencie os livros da biblioteca.</p>

        <form className="busca" onSubmit={(e) => { e.preventDefault(); carregar(); }}>
          <input placeholder="Buscar por título ou autor" value={busca} onChange={(e) => setBusca(e.target.value)} />
          <button className="primario">Buscar</button>
        </form>
        <p className="contagem">{livros.length} {livros.length === 1 ? 'livro no acervo' : 'livros no acervo'}</p>

        <ul className="lista">
          {livros.map((l) => (
            <li className="cartao-livro" key={l.id}>
              <div>
                <strong>{l.titulo}</strong>
                <span className="autor">{l.autor}{l.isbn ? ` · ISBN ${l.isbn}` : ''}</span>
                <span className={`estoque ${l.exemplares_disponiveis < 1 ? 'esgotado' : ''}`}>
                  {l.exemplares_disponiveis}/{l.exemplares_total} disponíveis
                </span>
              </div>
              <div className="acoes">
                <button className="primario" disabled={l.exemplares_disponiveis < 1} onClick={() => emprestar(l)}>Emprestar</button>
                {admin && <>
                  <button onClick={() => editar(l)}>Editar</button>
                  <button className="perigo" onClick={() => excluir(l)}>Excluir</button>
                </>}
              </div>
            </li>
          ))}
          {!livros.length && <li className="vazio">Nenhum livro encontrado.</li>}
        </ul>
      </section>

      {admin && (
        <aside className="painel">
          <h3>{editando ? 'Editar livro' : 'Cadastrar livro'}</h3>
          <p className="subtitulo">{editando ? 'Altere os dados do livro selecionado.' : 'Amplie o acervo da biblioteca.'}</p>
          <form onSubmit={salvar}>
            <div className="campo">
              <label htmlFor="titulo">Título</label>
              <input id="titulo" placeholder="Ex.: O Cortiço" value={form.titulo} onChange={mudar('titulo')} required />
            </div>
            <div className="campo">
              <label htmlFor="autor">Autor</label>
              <input id="autor" placeholder="Nome do autor" value={form.autor} onChange={mudar('autor')} required />
            </div>
            <div className="campo duas">
              <div>
                <label htmlFor="isbn">ISBN</label>
                <input id="isbn" placeholder="Opcional" value={form.isbn} onChange={mudar('isbn')} />
              </div>
              <div>
                <label htmlFor="exemplares">Exemplares</label>
                <input id="exemplares" type="number" min="0" value={form.exemplares_total} onChange={mudar('exemplares_total')} required />
              </div>
            </div>
            <button className="primario">{editando ? 'Salvar alterações' : 'Cadastrar livro'}</button>
            {editando && <button type="button" className="cancelar" onClick={() => { setEditando(null); setForm(vazio); }}>Cancelar</button>}
          </form>
        </aside>
      )}
    </div>
  );
}
