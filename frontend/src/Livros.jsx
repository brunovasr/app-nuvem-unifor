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
    <>
      <h2>Acervo</h2>
      <form onSubmit={(e) => { e.preventDefault(); carregar(); }}>
        <input placeholder="Buscar por título ou autor" value={busca} onChange={(e) => setBusca(e.target.value)} />
        <button>Buscar</button>
      </form>
      <ul>
        {livros.map((l) => (
          <li key={l.id}>
            <span>{l.titulo} <small>— {l.autor} · {l.exemplares_disponiveis}/{l.exemplares_total} disponíveis</small></span>
            <span className="acoes">
              <button disabled={l.exemplares_disponiveis < 1} onClick={() => emprestar(l)}>Emprestar</button>
              {admin && <><button onClick={() => editar(l)}>Editar</button><button onClick={() => excluir(l)}>Excluir</button></>}
            </span>
          </li>
        ))}
        {!livros.length && <li>Nenhum livro encontrado.</li>}
      </ul>
      {admin && (
        <>
          <h2>{editando ? 'Editar livro' : 'Cadastrar livro'}</h2>
          <form onSubmit={salvar}>
            <input placeholder="Título" value={form.titulo} onChange={mudar('titulo')} required />
            <input placeholder="Autor" value={form.autor} onChange={mudar('autor')} required />
            <input placeholder="ISBN" value={form.isbn} onChange={mudar('isbn')} />
            <input type="number" min="0" title="Exemplares" value={form.exemplares_total} onChange={mudar('exemplares_total')} required />
            <button>{editando ? 'Salvar' : 'Cadastrar'}</button>
            {editando && <button type="button" onClick={() => { setEditando(null); setForm(vazio); }}>Cancelar</button>}
          </form>
        </>
      )}
    </>
  );
}
