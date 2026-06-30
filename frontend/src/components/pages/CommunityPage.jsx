import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import CommunityCard from '../community/CommunityCard'
import CreatePostModal from '../community/CreatePostModal'
import { Skeleton } from '../ui/Skeleton'

const FILTERS = [
  { value: '',           label: 'Tudo',         icon: '🌐' },
  { value: 'REVIEW',     label: 'Reviews',       icon: '⭐' },
  { value: 'SCREENSHOT', label: 'Screenshots',   icon: '📸' },
  { value: 'ARTWORK',    label: 'Artworks',      icon: '🎨' },
  { value: 'DISCUSSION', label: 'Discussões',    icon: '💬' },
]

function PostSkeleton() {
  return (
    <div style={{ breakInside: 'avoid', display: 'inline-block', width: '100%', marginBottom: '1rem' }}>
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <Skeleton style={{ height: '200px', borderRadius: '20px 20px 0 0' }} />
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Skeleton style={{ height: '12px', width: '40%' }} />
          <Skeleton style={{ height: '14px', width: '80%' }} />
          <Skeleton style={{ height: '12px', width: '60%' }} />
        </div>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const load = useCallback(async (pageNum, typeFilter, reset) => {
    setLoading(true)
    try {
      const q = `/community?page=${pageNum}&limit=18${typeFilter ? `&type=${typeFilter}` : ''}`
      const res = await api.get(q)
      setPosts(prev => reset ? res.data.posts : [...prev, ...res.data.posts])
      setHasMore(res.data.hasMore)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setPosts([])
    setPage(1)
    setHasMore(true)
    load(1, type, true)
  }, [type, load])

  const handleMore = () => {
    const next = page + 1
    setPage(next)
    load(next, type, false)
  }

  const handleCreated = (p) => {
    setPosts(prev => [p, ...prev])
    setShowModal(false)
  }

  const handleDeleted = (id) => setPosts(prev => prev.filter(p => p.id !== id))

  const handleNew = () => {
    if (!user) { navigate('/login'); return }
    setShowModal(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark-text-1)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span>🌐</span> Comunidade
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-dark-text-2)' }}>
            Reviews, screenshots, artworks e discussões da galera
          </p>
        </div>
        <button
          onClick={handleNew}
          className="btn btn-primary"
          style={{ flexShrink: 0, fontSize: '0.85rem' }}
        >
          + Publicar
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setType(f.value)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '99px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: `1px solid ${type === f.value ? 'var(--color-brand)' : 'var(--color-dark-border)'}`,
              background: type === f.value ? 'rgba(124,58,237,0.15)' : 'var(--color-dark-card)',
              color: type === f.value ? 'var(--color-brand-light)' : 'var(--color-dark-text-2)',
            }}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      {/* Loading skeletons */}
      {loading && posts.length === 0 && (
        <div style={{ columns: '1', columnGap: '1rem' }}
          className="sm:columns-2 lg:columns-3">
          {[...Array(9)].map((_, i) => <PostSkeleton key={i} />)}
        </div>
      )}

      {/* Masonry grid */}
      {posts.length > 0 && (
        <div style={{ columns: '1', columnGap: '1rem' }}
          className="sm:columns-2 lg:columns-3">
          {posts.map(post => (
            <div key={post.id} style={{ breakInside: 'avoid', display: 'inline-block', width: '100%', marginBottom: '1rem' }}>
              <CommunityCard post={post} onDeleted={handleDeleted} />
            </div>
          ))}
        </div>
      )}

      {/* Load more */}
      {posts.length > 0 && hasMore && (
        <button
          onClick={handleMore}
          disabled={loading}
          className="btn btn-secondary"
          style={{ alignSelf: 'center', minWidth: '180px' }}
        >
          {loading ? 'Carregando...' : 'Carregar mais'}
        </button>
      )}

      {/* Empty state */}
      {!loading && posts.length === 0 && (
        <div className="card empty-state">
          <span style={{ fontSize: '3rem' }}>🌐</span>
          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Nenhum post ainda</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-dark-text-2)', marginBottom: '1rem' }}>
              Seja o primeiro a publicar!
            </p>
            <button onClick={handleNew} className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
              Criar post
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CreatePostModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}
