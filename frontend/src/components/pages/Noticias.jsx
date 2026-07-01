// pages/Noticias.jsx
import { useState, useEffect } from 'react'
import api from '../../services/api'
import { SkeletonNewsCard } from '../ui/Skeleton'

const CATEGORIAS = [
  { valor: 'PLAYSTATION', label: 'Playstation', cor: '#0070d1', hover: '#3b9eff' },
  { valor: 'XBOX', label: 'Xbox', cor: '#16a34a', hover: '#4ade80' },
  { valor: 'NINTENDO', label: 'Nintendo', cor: '#dc2626', hover: '#f87171' },
  { valor: 'GAMING', label: 'Jogos', cor: '#f97316', hover: '#fb923c' },
  { valor: 'RETRO', label: 'Retrô', cor: '#a855f7', hover: '#facc15' },
]

function metaCategoria(valor) {
  return CATEGORIAS.find(c => c.valor === valor) || CATEGORIAS[3]
}

function formatarData(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return ''
  }
}

function CardNoticia({ artigo, categoria }) {
  const meta = metaCategoria(categoria)
  return (
    <a href={artigo.url} target="_blank" rel="noopener noreferrer"
      style={{ background: '#e5e7eb', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,0.25)', textDecoration: 'none', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease, box-shadow 0.3s ease', width: '100%' }}
      className="hover:-translate-y-1"
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 14px 32px rgba(0,0,0,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.25)' }}
    >
      <div style={{ width: '100%', height: '180px', overflow: 'hidden', background: '#9ca3af', flexShrink: 0 }}>
        {artigo.imageUrl ? (
          <img src={artigo.imageUrl} alt={artigo.title} loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.currentTarget.style.display = 'none' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4rem' }}>🎮</div>
        )}
      </div>
      <div style={{ padding: '0.875rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', marginBottom: '0.5rem' }}>
          <span style={{ color: meta.cor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{meta.label}</span>
          <span style={{ color: '#4b5563' }}>{formatarData(artigo.publishedAt)}</span>
        </div>
        <h3
          style={{
            fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.4, color: '#111827', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color 0.25s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = meta.cor
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#111827'
          }}
        >
          {artigo.title}
        </h3>
      </div>
    </a>
  )
}

export default function Noticias() {
  const [categoria, setCategoria] = useState('GAMING')
  const [artigos, setArtigos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(false)
  const [mostrarMais, setMostrarMais] = useState(false)

  useEffect(() => {
    setCarregando(true)
    setErro(false)
    setMostrarMais(false)

    api.get(`/news?category=${categoria}`)
      .then(res => setArtigos(res.data.articles || []))
      .catch(() => setErro(true))
      .finally(() => setCarregando(false))
  }, [categoria])

  const destaque = artigos.find(a => a.imageUrl) || artigos[0]
  const maisFrescas = artigos.slice(0, 5)
  const gradeA = artigos.slice(0, 4)
  const gradeB = artigos.slice(4, 8)
  const gradeC = artigos.slice(8, 12)
  const gradeExtra = artigos.slice(12, 16)

  // Estilo padronizado e centralizado para as grades de notícias
  const estiloGradeCentralizada = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 260px))',
    justifyContent: 'center',
    gap: '1.25rem',
    marginBottom: '2.5rem',
    width: '100%'
  }

  return (
    // Container externo para evitar o espalhamento exagerado em telas UltraWide
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1rem', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

        {/* BARRA DE CATEGORIAS */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem 1.25rem', padding: '0.6rem 1.25rem', background: '#4b5563', borderRadius: '12px', marginBottom: '1.75rem' }}>
          {CATEGORIAS.map(cat => (
            <button key={cat.valor} onClick={() => setCategoria(cat.valor)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem', padding: '0.2rem 0', transition: 'color 0.25s', color: categoria === cat.valor ? cat.hover : cat.cor, textShadow: categoria === cat.valor ? `0 0 12px ${cat.cor}99` : 'none' }}
              onMouseEnter={e => { e.currentTarget.style.color = cat.hover }}
              onMouseLeave={e => { e.currentTarget.style.color = categoria === cat.valor ? cat.hover : cat.cor }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <h2 style={{ textAlign: 'center', fontSize: '1.7rem', fontWeight: 800, color: 'var(--color-dark-text-1)', marginBottom: '1.5rem' }}>
          Principais Notícias
        </h2>

        {/* ERRO */}
        {erro && (
          <div style={{ padding: '1rem', borderRadius: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            ⚠️ Erro ao carregar notícias. Verifique a conexão com o servidor.
          </div>
        )}

        {/* GRADE PRINCIPAL */}
        {carregando ? (
          <div style={estiloGradeCentralizada}>
            {[...Array(4)].map((_, i) => <SkeletonNewsCard key={i} />)}
          </div>
        ) : gradeA.length > 0 ? (
          <div style={estiloGradeCentralizada}>
            {gradeA.map((a, i) => <CardNoticia key={a.id || i} artigo={a} categoria={categoria} />)}
          </div>
        ) : !erro && (
          <div className="card empty-state" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem' }}>📰</span>
            <p style={{ fontWeight: 600 }}>Nenhuma notícia encontrada para esta categoria</p>
          </div>
        )}

        {/* BANNER DE DESTAQUE */}
        {destaque && (
          <section style={{ maxWidth: '900px', margin: '0 auto 2.5rem', width: '100%' }}>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--color-dark-text-1)', textAlign: 'center', fontWeight: 800, marginBottom: '1rem' }}>
              {destaque.title}
            </h2>
            <a href={destaque.url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', width: '100%', height: '260px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 12px 36px rgba(0,0,0,0.4)', transition: 'transform 0.3s ease' }}
              className="hover:scale-[1.01]">
              <img src={destaque.imageUrl || '/news-assets/banner-destaque.jpg'} alt={destaque.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.currentTarget.src = '/news-assets/banner-destaque.jpg' }} />
            </a>
          </section>
        )}

        {/* MAIS LIDAS */}
        {maisFrescas.length > 0 && (
          <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
            <div style={{ background: 'var(--color-brand-dark)', borderRadius: '10px', padding: '0.4rem 1.25rem', marginBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.05rem', color: 'white', fontWeight: 800 }}>Mais lidas</h2>
            </div>
            <ul style={{ width: '100%', maxWidth: '700px', background: 'var(--color-dark-secondary)', border: '1px solid var(--color-dark-border)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column' }}>
              {maisFrescas.map((a, i) => (
                <li key={a.id || i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.6rem 0', borderBottom: i < maisFrescas.length - 1 ? '1px solid var(--color-dark-border)' : 'none' }}>
                  <span style={{ width: '24px', height: '24px', flexShrink: 0, borderRadius: '50%', background: 'var(--color-brand)', color: 'white', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {i + 1}
                  </span>
                  <a href={a.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-dark-text-1)', textDecoration: 'none' }}
                    className="hover:text-brand-light">
                    {a.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* MAIS NOTÍCIAS */}
        {gradeB.length > 0 && (
          <>
            <h3 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark-text-1)', marginBottom: '1.25rem' }}>
              Mais notícias
            </h3>
            
            <div style={estiloGradeCentralizada}>
              {gradeB.map((a, i) => <CardNoticia key={a.id || `b${i}`} artigo={a} categoria={categoria} />)}
            </div>

            {gradeC.length > 0 && (
              <div style={{ ...estiloGradeCentralizada, marginBottom: '1.5rem' }}>
                {gradeC.map((a, i) => <CardNoticia key={a.id || `c${i}`} artigo={a} categoria={categoria} />)}
              </div>
            )}

            {/* Botão "ver mais" */}
            {gradeExtra.length > 0 && !mostrarMais && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <button onClick={() => setMostrarMais(true)}
                  style={{ background: 'var(--color-brand)', color: 'white', fontWeight: 800, fontSize: '1.1rem', padding: '0.6rem 1.5rem', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'background 0.25s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#9d7aef' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-brand)' }}>
                  Ver mais
                </button>
              </div>
            )}

            {mostrarMais && gradeExtra.length > 0 && (
              <div style={{ ...estiloGradeCentralizada, marginBottom: '1.5rem' }}>
                {gradeExtra.map((a, i) => <CardNoticia key={a.id || `e${i}`} artigo={a} categoria={categoria} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}