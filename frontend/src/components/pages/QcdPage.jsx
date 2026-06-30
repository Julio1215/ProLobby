import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'
import { Skeleton } from '../ui/Skeleton'

const QCD_INFO = {
  EXCELLENT: { color: '#10b981', label: '🏆 Excelente Compra', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)' },
  GOOD:       { color: '#3b82f6', label: '✅ Boa Compra',       bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)' },
  REASONABLE: { color: '#f59e0b', label: '⚠️ Compra Razoável', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)' },
  NOT_WORTH:  { color: '#ef4444', label: '❌ Não Vale a Pena', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)' },
}

const statLabelStyle = {
  fontSize: '0.65rem',
  fontWeight: 700,
  color: 'rgba(240,238,255,0.45)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '0.3rem',
}

const statValueStyle = {
  fontSize: '1.5rem',
  fontWeight: 800,
  color: 'var(--color-dark-text-1)',
  fontFamily: 'var(--font-orbitron)',
  lineHeight: 1,
}

function StatBox({ label, value, color }) {
  return (
    <div style={{
      padding: '0.875rem',
      borderRadius: '14px',
      background: 'var(--color-dark-secondary)',
      border: '1px solid var(--color-dark-border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
    }}>
      <div style={statLabelStyle}>{label}</div>
      <div style={{ ...statValueStyle, color: color || 'var(--color-dark-text-1)' }}>{value || '—'}</div>
    </div>
  )
}

function QcdResult({ data }) {
  const info = QCD_INFO[data.qcdCategory] || {}
  const hasResult = data.qcdScore !== null

  return (
    <div className="card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Cover */}
        <div style={{ aspectRatio: '3/4', borderRadius: '16px', overflow: 'hidden', background: 'var(--color-dark-secondary)', flexShrink: 0 }}>
          {data.coverUrl
            ? <img src={data.coverUrl} alt={data.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🎮</div>
          }
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark-text-1)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
              {data.title}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {data.genres?.slice(0, 3).map(g => (
                <span key={g} className="badge badge-brand">{g}</span>
              ))}
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem' }}>
            <StatBox label="Nota Crítica" value={data.criticScore ? `${data.criticScore}` : null} color="#10b981" />
            <StatBox label="Nota Geral" value={data.igdbRating ? `${data.igdbRating}/10` : null} />
            <StatBox label="Horas (História)" value={data.hoursMain ? `~${data.hoursMain}h` : null} color="#3b82f6" />
            <StatBox label="Horas (Completo)" value={data.hoursComplete ? `~${data.hoursComplete}h` : null} />
            <StatBox label="Preço USD" value={data.priceUsd ? `$${data.priceUsd}` : null} color="#f59e0b" />
            <StatBox label="Preço BRL" value={data.priceBrl ? `R$${data.priceBrl}` : null} />
          </div>

          {data.hoursNote && (
            <p style={{ fontSize: '0.78rem', color: 'var(--color-dark-text-2)', padding: '0.6rem 0.875rem', borderRadius: '10px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
              ℹ️ {data.hoursNote}
            </p>
          )}

          {/* Verdict */}
          {hasResult ? (
            <div style={{
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              background: info.bg,
              border: `1px solid ${info.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: info.color, marginBottom: '0.4rem' }}>
                  {info.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(240,238,255,0.45)' }}>
                  Nota ({data.avgScore}) × {data.hoursMain}h ÷ ${data.priceUsd}
                </div>
              </div>
              <div style={{
                fontSize: '3rem',
                fontWeight: 900,
                fontFamily: 'var(--font-orbitron)',
                color: info.color,
                textShadow: `0 0 20px ${info.color}60`,
                lineHeight: 1,
              }}>
                {data.qcdScore}
              </div>
            </div>
          ) : (
            <div style={{ borderRadius: '14px', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', padding: '1rem' }}>
              <p style={{ fontWeight: 600, color: '#f87171', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
                Dados insuficientes para calcular QCD
              </p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(248,113,113,0.7)' }}>
                Faltando: {data.missingData?.join(', ')}
              </p>
            </div>
          )}

          {data.storeUrl && (
            <a href={data.storeUrl} target="_blank" rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ alignSelf: 'flex-start', fontSize: '0.85rem' }}>
              Ver melhor preço →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function RankingCard({ game, position }) {
  const info = QCD_INFO[game.qcdCategory] || {}
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 1rem' }}>
      <div style={{
        fontSize: '1.1rem',
        fontWeight: 900,
        fontFamily: 'var(--font-orbitron)',
        color: position <= 3 ? ['#fbbf24','#9ca3af','#cd7c1a'][position - 1] : 'var(--color-dark-text-3)',
        width: '32px',
        textAlign: 'center',
        flexShrink: 0,
      }}>
        #{position}
      </div>

      <div style={{ width: '52px', height: '68px', borderRadius: '10px', overflow: 'hidden', background: 'var(--color-dark-secondary)', flexShrink: 0 }}>
        {game.coverUrl
          ? <img src={game.coverUrl} alt={game.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🎮</div>
        }
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-dark-text-1)' }}>
          {game.title}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--color-dark-text-2)', marginTop: '0.2rem', display: 'flex', gap: '0.5rem' }}>
          {game.metacriticScore && <span>⭐ {game.metacriticScore}</span>}
          {game.hoursMain && <span>⏱ {game.hoursMain}h</span>}
          {game.priceUsd && <span>💵 ${game.priceUsd}</span>}
        </div>
      </div>

      <div style={{
        fontSize: '1.6rem',
        fontWeight: 900,
        fontFamily: 'var(--font-orbitron)',
        color: info.color || 'var(--color-brand-light)',
        flexShrink: 0,
      }}>
        {game.qcdScore}
      </div>
    </div>
  )
}

export default function QcdPage() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['qcd', query],
    queryFn: () => api.get(`/qcd/search?title=${encodeURIComponent(query)}`).then(r => r.data),
    enabled: !!query,
  })

  const { data: rankingData } = useQuery({
    queryKey: ['qcd-ranking'],
    queryFn: () => api.get('/qcd/ranking?limit=10').then(r => r.data),
  })

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) setQuery(search.trim())
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark-text-1)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span>💎</span> QCD Score
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-dark-text-2)' }}>
            Qualidade por Custo de Diversão — descubra se o jogo vale seu dinheiro
          </p>
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1rem',
          borderRadius: '12px',
          background: 'rgba(124,58,237,0.1)',
          border: '1px solid rgba(124,58,237,0.2)',
          fontSize: '0.8rem',
          color: 'var(--color-brand-light)',
          fontWeight: 600,
          alignSelf: 'flex-start',
        }}>
          <span>📐</span> QCD = Nota × Horas de Gameplay ÷ Preço (USD)
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Elden Ring, Hades, Hollow Knight..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input"
          style={{ flex: 1, minWidth: '200px', fontSize: '0.9rem', padding: '0.75rem 1.1rem' }}
        />
        <button
          type="submit"
          disabled={isLoading || !search.trim()}
          className="btn btn-primary"
          style={{ padding: '0 1.5rem', fontSize: '0.9rem' }}
        >
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
              Analisando...
            </span>
          ) : '🔍 Analisar'}
        </button>
      </form>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem' }}>
          <Skeleton style={{ aspectRatio: '3/4', borderRadius: '16px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton style={{ height: '28px', width: '60%' }} />
            <Skeleton style={{ height: '14px', width: '40%' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.6rem' }}>
              {[...Array(6)].map((_, i) => <Skeleton key={i} style={{ height: '72px', borderRadius: '14px' }} />)}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div style={{ padding: '1rem', borderRadius: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.85rem' }}>
          ⚠️ Erro ao buscar o jogo. Verifique se o nome está correto e tente novamente.
        </div>
      )}

      {/* Result */}
      {data && !isLoading && <QcdResult data={data} />}

      {/* Ranking */}
      {rankingData?.ranking?.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="section-header">
            <h2 className="section-title"><span>🏆</span> Ranking de Melhores QCDs</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-dark-text-2)' }}>Top 10</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {rankingData.ranking.map((game, i) => (
              <RankingCard key={game.id} game={game} position={i + 1} />
            ))}
          </div>
        </section>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
