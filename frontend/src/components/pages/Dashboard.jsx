import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import { SkeletonCard } from '../ui/Skeleton'

const QCD_COLORS = {
  EXCELLENT:  { color: '#10b981', label: 'Excelente',  bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.3)'  },
  GOOD:       { color: '#3b82f6', label: 'Boa Compra', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.3)'  },
  REASONABLE: { color: '#f59e0b', label: 'Razoável',   bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)'  },
  NOT_WORTH:  { color: '#ef4444', label: 'Não Vale',   bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)'   },
}

const QUICK_LINKS = [
  {
    to: '/news', icon: '📰', label: 'Notícias', sub: 'Últimas do mundo gamer',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.05))',
    border: 'rgba(59,130,246,0.25)',
  },
  {
    to: '/qcd', icon: '💎', label: 'QCD Score', sub: 'Custo x Diversão',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.05))',
    border: 'rgba(16,185,129,0.25)',
  },
  {
    to: '/rpg', icon: '🎲', label: 'Fichas RPG', sub: 'D&D · Tormenta · CoC',
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(91,33,182,0.05))',
    border: 'rgba(124,58,237,0.3)',
  },
  {
    to: '/community', icon: '🌐', label: 'Comunidade', sub: 'Posts · Reviews · Arte',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(180,83,9,0.05))',
    border: 'rgba(245,158,11,0.25)',
  },
]

function QcdBadge({ category }) {
  const info = QCD_COLORS[category] || {}
  return (
    <span style={{
      padding: '0.2rem 0.6rem',
      borderRadius: '99px',
      fontSize: '0.65rem',
      fontWeight: 700,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
      color: info.color,
      background: info.bg,
      border: `1px solid ${info.border}`,
    }}>
      {info.label}
    </span>
  )
}

function GameCard({ game }) {
  return (
    <div className="card" style={{ overflow: 'hidden', cursor: 'default' }}>
      {/* Cover */}
      <div style={{
        aspectRatio: '3/4',
        background: 'var(--color-dark-secondary)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={game.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            className="hover:scale-105"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🎮</div>
        )}
        {/* QCD overlay badge */}
        {game.qcdScore && (
          <div style={{
            position: 'absolute', top: '0.5rem', right: '0.5rem',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            padding: '0.25rem 0.5rem',
            fontSize: '0.7rem',
            fontWeight: 800,
            color: 'var(--color-brand-light)',
          }}>
            QCD {game.qcdScore}
          </div>
        )}
      </div>

      <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {game.title}
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--color-dark-text-2)' }}>
          {game.metacriticScore && <span>⭐ {game.metacriticScore}</span>}
          {game.hoursMain && <span>⏱ {game.hoursMain}h</span>}
          {game.priceUsd && <span>💵 ${game.priceUsd}</span>}
        </div>

        {game.qcdCategory && <QcdBadge category={game.qcdCategory} />}
      </div>
    </div>
  )
}

function StatCard({ value, label, sub, color }) {
  return (
    <div style={{
      padding: '1rem',
      borderRadius: '14px',
      background: 'var(--color-dark-card)',
      border: '1px solid var(--color-dark-border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.3rem',
    }}>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: color || 'var(--color-brand-light)', fontFamily: 'var(--font-orbitron)' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-dark-text-1)' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--color-dark-text-2)' }}>{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuthStore()

  const { data: ranking, isLoading } = useQuery({
    queryKey: ['qcd-ranking'],
    queryFn: () => api.get('/qcd/ranking?limit=6').then(r => r.data.ranking),
  })

  const { data: newsData } = useQuery({
    queryKey: ['news-preview'],
    queryFn: () => api.get('/news?category=GAMING&limit=3').then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })

  const latestNews = newsData?.articles?.slice(0, 3) || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* ===== HERO BANNER ===== */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '24px',
        padding: '2.5rem',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(191,0,255,0.1) 50%, transparent 100%)',
        border: '1px solid rgba(124, 58, 237, 0.25)',
        minHeight: '180px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        {/* BG blobs */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(191, 0, 255, 0.12)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '30%', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.15)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {user ? (
            <>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-brand-light)', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Bem-vindo de volta 👾
              </p>
              <h1 style={{
                fontFamily: 'var(--font-orbitron)',
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                fontWeight: 900,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '0.75rem',
              }}>
                {user.displayName || user.username}
              </h1>
            </>
          ) : (
            <>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-brand-light)', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                O hub definitivo para gamers
              </p>
              <h1 style={{
                fontFamily: 'var(--font-orbitron)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 900,
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '0.75rem',
              }}>
                PRO<span style={{ color: 'var(--color-brand-light)', textShadow: '0 0 30px rgba(168, 85, 247, 0.6)' }}>LOBBY</span>
              </h1>
            </>
          )}
          <p style={{ fontSize: '0.9rem', color: 'rgba(240,238,255,0.6)', maxWidth: '480px', lineHeight: 1.6 }}>
            Notícias · QCD Score · Reviews · Fichas RPG — tudo em um lugar
          </p>

          {!user && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                Criar conta grátis
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                Entrar
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ===== QUICK LINKS ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
        {QUICK_LINKS.map(item => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '1rem 1.1rem',
              borderRadius: '16px',
              background: item.gradient,
              border: `1px solid ${item.border}`,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            className="hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-dark-text-1)' }}>{item.label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-dark-text-2)', marginTop: '1px' }}>{item.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ===== STATS ROW ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
        <StatCard value="D&D 5e" label="Ficha RPG" sub="+ 3 sistemas" color="var(--color-brand-light)" />
        <StatCard value="QCD™" label="Score exclusivo" sub="Custo x Tempo" color="#10b981" />
        <StatCard value="100+" label="Notícias" sub="Atualizadas" color="#3b82f6" />
        <StatCard value="Free" label="Para sempre" sub="Sem anúncios" color="#f59e0b" />
      </div>

      {/* ===== RANKING QCD ===== */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="section-header">
          <h2 className="section-title">
            <span>🏆</span> Ranking QCD
          </h2>
          <Link to="/qcd" style={{ fontSize: '0.8rem', color: 'var(--color-brand-light)', textDecoration: 'none', fontWeight: 600 }}
            className="hover:underline">
            Ver todos →
          </Link>
        </div>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : ranking?.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            {ranking.map(game => <GameCard key={game.id} game={game} />)}
          </div>
        ) : (
          <div className="card empty-state">
            <span style={{ fontSize: '3rem' }}>🎮</span>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Nenhum jogo no ranking ainda</p>
              <Link to="/qcd" className="btn btn-primary" style={{ fontSize: '0.82rem', marginTop: '0.5rem', display: 'inline-flex' }}>
                Buscar jogos
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ===== LATEST NEWS ===== */}
      {latestNews.length > 0 && (
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="section-header">
            <h2 className="section-title"><span>📰</span> Últimas Notícias</h2>
            <Link to="/news" style={{ fontSize: '0.8rem', color: 'var(--color-brand-light)', textDecoration: 'none', fontWeight: 600 }}
              className="hover:underline">
              Ver todas →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {latestNews.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{ display: 'flex', gap: '0.75rem', padding: '0.875rem', textDecoration: 'none', alignItems: 'flex-start' }}
              >
                <div style={{
                  width: '72px', height: '72px', flexShrink: 0, borderRadius: '10px',
                  overflow: 'hidden', background: 'var(--color-dark-secondary)',
                }}>
                  {article.imageUrl
                    ? <img src={article.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📰</div>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.65rem', color: 'var(--color-brand-light)', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                    {article.source}
                  </p>
                  <h3 style={{ fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: 'var(--color-dark-text-1)' }}>
                    {article.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
