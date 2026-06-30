import { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import { SkeletonNewsCard } from '../ui/Skeleton'

// ============================================
// CATEGORIAS — por plataforma, com cor de marca própria
// (Espelha o layout original combinado com a equipe)
// ============================================
const CATEGORIES = [
  { value: 'PLAYSTATION', label: 'Playstation', color: '#0070d1', hover: '#3b9eff' },
  { value: 'XBOX', label: 'Xbox', color: '#16a34a', hover: '#4ade80' },
  { value: 'NINTENDO', label: 'Nintendo', color: '#dc2626', hover: '#f87171' },
  { value: 'GAMING', label: 'Jogos', color: '#f97316', hover: '#fb923c' },
  { value: 'RETRO', label: 'Retrô', color: '#a855f7', hover: '#facc15' },
]

const categoryMeta = (value) => CATEGORIES.find(c => c.value === value) || CATEGORIES[3]

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return ''
  }
}

// ============================================
// CARD DE NOTÍCIA — réplica do card do layout combinado
// ============================================
function NewsCard({ article, category }) {
  const meta = categoryMeta(category)
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        background: '#e5e7eb',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      className="hover:-translate-y-1"
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 14px 32px rgba(0,0,0,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.25)' }}
    >
      <div style={{ width: '100%', height: '180px', overflow: 'hidden', background: '#9ca3af', flexShrink: 0 }}>
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4rem' }}>🎮</div>
        )}
      </div>

      <div style={{ padding: '0.875rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', marginBottom: '0.5rem' }}>
          <span style={{ color: meta.color, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            {meta.label}
          </span>
          <span style={{ color: '#4b5563' }}>{formatDate(article.publishedAt)}</span>
        </div>
        <h3
          style={{
            fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.4, color: '#111827',
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            transition: 'color 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = meta.hover }}
          onMouseLeave={e => { e.currentTarget.style.color = '#111827' }}
        >
          {article.title}
        </h3>
      </div>
    </a>
  )
}

// ============================================
// PÁGINA PRINCIPAL
// ============================================
export default function NewsPage() {
  const [category, setCategory] = useState('GAMING')
  const [showMore, setShowMore] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['news', category],
    queryFn: () => api.get(`/news?category=${category}`).then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => { setShowMore(false) }, [category])

  const articles = data?.articles || []

  // "Mais lidas" — top 5 por ordem de chegada da API (proxy de relevância)
  const topRead = useMemo(() => articles.slice(0, 5), [articles])

  // Banner de destaque — primeira notícia com imagem
  const featured = useMemo(() => articles.find(a => a.imageUrl) || articles[0], [articles])

  // Grids: principais (4), depois mais (4+4 reveladas com "ver mais")
  const mainGrid = articles.slice(0, 4)
  const moreGridA = articles.slice(4, 8)
  const moreGridB = articles.slice(8, 12)
  const moreGridC = articles.slice(12, 16) // só aparece após "ver mais"

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* ===== BARRA DE CATEGORIAS ===== */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem 1.25rem',
        padding: '0.6rem 1.25rem',
        background: '#4b5563',
        borderRadius: '12px',
        marginBottom: '1.75rem',
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontWeight: 800, fontSize: '0.85rem',
              padding: '0.2rem 0', transition: 'color 0.25s',
              color: category === cat.value ? cat.hover : cat.color,
              textShadow: category === cat.value ? `0 0 12px ${cat.color}99` : 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = cat.hover }}
            onMouseLeave={e => { e.currentTarget.style.color = category === cat.value ? cat.hover : cat.color }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ===== TÍTULO ===== */}
      <h2 style={{
        textAlign: 'center', fontSize: '1.7rem', fontWeight: 800,
        color: 'var(--color-dark-text-1)', marginBottom: '1.5rem',
      }}>
        Principais Notícias
      </h2>

      {/* ===== ERRO ===== */}
      {isError && (
        <div style={{ padding: '1rem', borderRadius: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          ⚠️ Erro ao carregar notícias. Verifique a conexão com o servidor.
        </div>
      )}

      {/* ===== GRID PRINCIPAL ===== */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {[...Array(4)].map((_, i) => <SkeletonNewsCard key={i} />)}
        </div>
      ) : mainGrid.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {mainGrid.map((a, i) => <NewsCard key={a.id || i} article={a} category={category} />)}
        </div>
      ) : !isError && (
        <div className="card empty-state" style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '3rem' }}>📰</span>
          <p style={{ fontWeight: 600 }}>Nenhuma notícia encontrada para esta categoria</p>
        </div>
      )}

      {/* ===== BANNER DE DESTAQUE ===== */}
      {featured && (
        <section style={{ maxWidth: '900px', margin: '0 auto 2.5rem', width: '100%' }}>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--color-dark-text-1)', textAlign: 'center', fontWeight: 800, marginBottom: '1rem' }}>
            {featured.title}
          </h2>
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block', width: '100%', height: '260px', borderRadius: '16px',
              overflow: 'hidden', boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
              transition: 'transform 0.3s ease',
            }}
            className="hover:scale-[1.01]"
          >
            <img
              src={featured.imageUrl || '/news-assets/banner-destaque.jpg'}
              alt={featured.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.currentTarget.src = '/news-assets/banner-destaque.jpg' }}
            />
          </a>
        </section>
      )}

      {/* ===== MAIS LIDAS ===== */}
      {topRead.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
          <div style={{
            background: 'var(--color-brand-dark)', borderRadius: '10px',
            padding: '0.4rem 1.25rem', marginBottom: '0.75rem',
          }}>
            <h2 style={{ fontSize: '1.05rem', color: 'white', fontWeight: 800 }}>Mais lidas</h2>
          </div>

          <ul style={{
            width: '100%', maxWidth: '700px', background: 'var(--color-dark-secondary)',
            border: '1px solid var(--color-dark-border)', borderRadius: '12px', padding: '1rem 1.25rem',
            display: 'flex', flexDirection: 'column',
          }}>
            {topRead.map((a, i) => (
              <li key={a.id || i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.6rem 0',
                borderBottom: i < topRead.length - 1 ? '1px solid var(--color-dark-border)' : 'none',
              }}>
                <span style={{
                  width: '24px', height: '24px', flexShrink: 0, borderRadius: '50%',
                  background: 'var(--color-brand)', color: 'white', fontWeight: 800, fontSize: '0.8rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
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

      {/* ===== MAIS NOTÍCIAS ===== */}
      {moreGridA.length > 0 && (
        <>
          <h3 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-dark-text-1)', marginBottom: '1.25rem' }}>
            Mais notícias
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {moreGridA.map((a, i) => <NewsCard key={a.id || `a${i}`} article={a} category={category} />)}
          </div>

          {moreGridB.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {moreGridB.map((a, i) => <NewsCard key={a.id || `b${i}`} article={a} category={category} />)}
            </div>
          )}

          {/* Botão ver mais — só aparece se houver conteúdo extra */}
          {moreGridC.length > 0 && !showMore && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <button
                onClick={() => setShowMore(true)}
                style={{
                  background: 'var(--color-brand)', color: 'white', fontWeight: 800,
                  fontSize: '1.1rem', padding: '0.6rem 1.5rem', borderRadius: '12px',
                  border: 'none', cursor: 'pointer', transition: 'background 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#9d7aef' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-brand)' }}
              >
                Ver mais
              </button>
            </div>
          )}

          {showMore && moreGridC.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {moreGridC.map((a, i) => <NewsCard key={a.id || `c${i}`} article={a} category={category} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
