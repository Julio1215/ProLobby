// pages/Comunidade.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import CommunityCard from '../community/CreatePostModal' // Nota: Verifique se o card de exibição não deveria ser outro componente em vez do Modal
import CreatePostModal from '../community/CreatePostModal'
import { Skeleton } from '../ui/Skeleton'

const FILTROS = [
  { valor: '',         label: 'Tudo',          icone: '🌐' },
  { valor: 'REVIEW',     label: 'Reviews',       icone: '⭐' },
  { valor: 'SCREENSHOT', label: 'Screenshots',   icone: '📸' },
  { valor: 'ARTWORK',    label: 'Artworks',      icone: '🎨' },
  { valor: 'DISCUSSION', label: 'Discussões',    icone: '💬' },
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

export default function Comunidade() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const [posts, setPosts]           = useState([])
  const [filtro, setFiltro]         = useState('')
  const [pagina, setPagina]         = useState(1)
  const [temMais, setTemMais]       = useState(true)
  const [carregando, setCarregando] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)

  async function carregarPosts(numeroPagina, tipoFiltro, reiniciar) {
    setCarregando(true)
    try {
      const url = `/community?page=${numeroPagina}&limit=18${tipoFiltro ? `&type=${tipoFiltro}` : ''}`
      const res = await api.get(url)
      setPosts(prev => reiniciar ? res.data.posts : [...prev, ...res.data.posts])
      setTemMais(res.data.hasMore)
    } catch (e) {
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    setPosts([])
    setPagina(1)
    setTemMais(true)
    carregarPosts(1, filtro, true)
  }, [filtro])

  function handleCarregarMais() {
    const proxima = pagina + 1
    setPagina(proxima)
    carregarPosts(proxima, filtro, false)
  }

  function handlePostCriado(novoPost) {
    setPosts(prev => [novoPost, ...prev])
    setMostrarModal(false)
  }

  function handlePostDeletado(id) {
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  function handleNovo() {
    if (!usuario) { navigate('/login'); return }
    setMostrarModal(true)
  }

  return (
    // Adicionado um contêiner com herança de cor flexível
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '100%' }}>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          {/* Cor do título agora se adapta ao tema automaticamente */}
          <h1 className="section-title" style={{ fontSize: '1.6rem', fontWeight: 800, gap: '0.5rem', marginBottom: '0.3rem' }}>
            <span>🌐</span> Comunidade
          </h1>
          <p style={{ fontSize: '0.82rem', opacity: 0.8 }}>
            Reviews, screenshots, artworks e discussões da galera
          </p>
        </div>
        <button onClick={handleNovo} className="btn btn-primary" style={{ flexShrink: 0, fontSize: '0.85rem' }}>
          + Publicar
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {FILTROS.map(f => {
          const isActive = filtro === f.valor;
          return (
            <button 
              key={f.valor} 
              onClick={() => setFiltro(f.valor)}
              className={isActive ? "" : "card"} // Usa a classe .card nativa para herdar cor de fundo clara/escura
              style={{ 
                padding: '0.4rem 0.9rem', 
                borderRadius: '99px', 
                fontSize: '0.78rem', 
                fontWeight: 600, 
                cursor: 'pointer', 
                transition: 'all 0.2s', 
                border: `1px solid ${isActive ? 'var(--color-brand)' : 'transparent'}`, 
                background: isActive ? 'rgba(124,58,237,0.15)' : undefined, 
                color: isActive ? 'var(--color-brand-light)' : 'inherit' 
              }}
            >
              {f.icone} {f.label}
            </button>
          )
        })}
      </div>

      {/* Skeletons enquanto carrega pela primeira vez */}
      {carregando && posts.length === 0 && (
        <div style={{ columns: '1', columnGap: '1rem' }} className="sm:columns-2 lg:columns-3">
          {[...Array(9)].map((_, i) => <PostSkeleton key={i} />)}
        </div>
      )}

      {/* Grade masonry de posts */}
      {posts.length > 0 && (
        <div style={{ columns: '1', columnGap: '1rem' }} className="sm:columns-2 lg:columns-3">
          {posts.map(post => (
            <div key={post.id} style={{ breakInside: 'avoid', display: 'inline-block', width: '100%', marginBottom: '1rem' }}>
              <CommunityCard post={post} onDeleted={handlePostDeletado} />
            </div>
          ))}
        </div>
      )}

      {/* Botão de carregar mais */}
      {posts.length > 0 && temMais && (
        <button onClick={handleCarregarMais} disabled={carregando} className="btn btn-secondary" style={{ alignSelf: 'center', minWidth: '180px' }}>
          {carregando ? 'Carregando...' : 'Carregar mais'}
        </button>
      )}

      {/* Estado vazio */}
      {!carregando && posts.length === 0 && (
        <div className="card empty-state">
          <span style={{ fontSize: '3rem' }}>🌐</span>
          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.4rem' }}>Nenhum post ainda</p>
            <p style={{ fontSize: '0.82rem', opacity: 0.7, marginBottom: '1rem' }}>
              Seja o primeiro a publicar!
            </p>
            <button onClick={handleNovo} className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
              Criar post
            </button>
          </div>
        </div>
      )}

      {/* Modal de criação de post */}
      {mostrarModal && (
        <CreatePostModal
          onClose={() => setMostrarModal(false)}
          onCreated={handlePostCriado}
        />
      )}
    </div>
  )
}