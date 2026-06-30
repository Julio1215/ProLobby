import { useState } from 'react'
import api from '../../services/api'

const TYPE_CFG = {
  REVIEW:     { label: 'Review',     color: 'text-yellow-400',  bg: 'bg-yellow-400/10', icon: '⭐' },
  SCREENSHOT: { label: 'Screenshot', color: 'text-blue-400',    bg: 'bg-blue-400/10',   icon: '📸' },
  ARTWORK:    { label: 'Artwork',    color: 'text-pink-400',    bg: 'bg-pink-400/10',   icon: '🎨' },
  DISCUSSION: { label: 'Discussão',  color: 'text-emerald-400', bg: 'bg-emerald-400/10',icon: '💬' },
}

const fmt = (d) => {
  const diff = Date.now() - new Date(d)
  const m = Math.floor(diff/60000), h = Math.floor(diff/3600000), days = Math.floor(diff/86400000)
  if (m < 1) return 'agora'; if (m < 60) return `${m}m`
  if (h < 24) return `${h}h`; if (days < 7) return `${days}d`
  return new Date(d).toLocaleDateString('pt-BR')
}

const assetUrl = (p) => {
  if (!p) return null; if (p.startsWith('http')) return p
  return api.defaults.baseURL.replace(/\/api\/?$/, '') + p
}

function Avatar({ user }) {
  return (
    <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-xs font-semibold text-white overflow-hidden shrink-0">
      {user?.avatarUrl ? <img src={assetUrl(user.avatarUrl)} alt="" className="w-full h-full object-cover" /> : <span>{user?.username?.[0]?.toUpperCase()}</span>}
    </div>
  )
}

export default function CommunityCard({ post, currentUser, onDeleted }) {
  const [liked,        setLiked]        = useState(post.likedByMe || false)
  const [likes,        setLikes]        = useState(post.likesCount || 0)
  const [showComments, setShowComments] = useState(false)
  const [comments,     setComments]     = useState([])
  const [commentText,  setCommentText]  = useState('')
  const [loadingCmts,  setLoadingCmts]  = useState(false)
  const [expanded,     setExpanded]     = useState(false)

  const cfg = TYPE_CFG[post.type] || TYPE_CFG.DISCUSSION
  const isImage = post.type === 'SCREENSHOT' || post.type === 'ARTWORK'
  const isOwner = currentUser?.id === post.user?.id
  const longText = post.content && post.content.length > 200

  const handleLike = async () => {
    if (!currentUser) return
    setLiked(v => !v); setLikes(v => liked ? v-1 : v+1)
    try { await api.post(`/community/${post.id}/like`) }
    catch { setLiked(v => !v); setLikes(v => liked ? v+1 : v-1) }
  }

  const handleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingCmts(true)
      try { const r = await api.get(`/community/${post.id}/comments`); setComments(r.data.comments) }
      catch {} finally { setLoadingCmts(false) }
    }
    setShowComments(v => !v)
  }

  const handleAddComment = async (e) => {
    e.preventDefault(); if (!commentText.trim()) return
    try { const r = await api.post(`/community/${post.id}/comments`, { content: commentText }); setComments(v => [...v, r.data.comment]); setCommentText('') }
    catch {}
  }

  const handleDelete = async () => {
    if (!window.confirm('Remover este post?')) return
    try { await api.delete(`/community/${post.id}`); onDeleted?.(post.id) }
    catch { alert('Erro ao remover') }
  }

  return (
    <div className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-app-lg overflow-hidden hover:border-light-border-lt dark:hover:border-dark-border-lt hover:shadow-lg transition-all">
      {isImage && post.imageUrl && (
        <div className={`w-full overflow-hidden ${post.type==='SCREENSHOT' ? 'aspect-video' : 'max-h-[420px]'}`}>
          <img src={assetUrl(post.imageUrl)} alt="" loading="lazy" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex items-center justify-between px-3.5 pt-3 gap-2">
        <div className="flex items-center gap-2">
          <Avatar user={post.user} />
          <div>
            <span className="text-[13px] font-semibold text-light-text-1 dark:text-dark-text-1 block leading-tight">{post.user?.displayName || post.user?.username}</span>
            <span className="text-[11px] text-light-text-3 dark:text-dark-text-3">{fmt(post.createdAt)}</span>
          </div>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}>{cfg.icon} {cfg.label}</span>
      </div>
      <div className="px-3.5 py-2.5">
        {post.gameTitle && <span className="text-xs text-light-text-3 dark:text-dark-text-3 block mb-1.5">🎮 {post.gameTitle}</span>}
        {post.rating && post.type==='REVIEW' && (
          <div className="flex gap-0.5 mb-1">{[1,2,3,4,5].map(i => <span key={i} className={i<=post.rating ? 'text-yellow-400' : 'text-light-border dark:text-dark-border'}>★</span>)}</div>
        )}
        {post.title && post.type!=='REVIEW' && <h3 className="text-[15px] font-semibold text-light-text-1 dark:text-dark-text-1 mb-1.5">{post.title}</h3>}
        {post.content && (
          <p className="text-[13px] text-light-text-2 dark:text-dark-text-2 leading-relaxed m-0">
            {expanded || !longText ? post.content : post.content.slice(0,200)+'...'}
            {longText && <button onClick={() => setExpanded(v => !v)} className="text-brand-light text-xs ml-1 hover:underline bg-transparent border-none cursor-pointer p-0">{expanded ? 'ver menos' : 'ver mais'}</button>}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 px-3.5 pb-3 pt-2 border-t border-light-border dark:border-dark-border">
        <button onClick={handleLike} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-all ${liked ? 'bg-brand/10 border-brand text-brand-light' : 'border-light-border dark:border-dark-border text-light-text-2 dark:text-dark-text-2 hover:border-brand hover:text-brand-light'}`}>👍 {likes}</button>
        <button onClick={handleComments} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-light-border dark:border-dark-border text-xs text-light-text-2 dark:text-dark-text-2 hover:border-brand hover:text-brand-light transition-all">💬 {post.commentsCount}</button>
        {isOwner && <button onClick={handleDelete} className="ml-auto text-sm opacity-40 hover:opacity-100 hover:text-red-400 bg-transparent border-none cursor-pointer transition-all">🗑️</button>}
      </div>
      {showComments && (
        <div className="px-3.5 pb-3 border-t border-light-border dark:border-dark-border flex flex-col gap-2 pt-2">
          {loadingCmts && <span className="text-xs text-light-text-3 dark:text-dark-text-3">Carregando...</span>}
          {comments.map(c => (
            <div key={c.id} className="flex gap-2 items-start">
              <Avatar user={c.user} />
              <div>
                <span className="text-xs font-semibold text-light-text-1 dark:text-dark-text-1">{c.user?.displayName || c.user?.username}</span>
                <p className="text-xs text-light-text-2 dark:text-dark-text-2 mt-0.5 leading-snug m-0">{c.content}</p>
              </div>
            </div>
          ))}
          {currentUser && (
            <form onSubmit={handleAddComment} className="flex gap-1.5 mt-1">
              <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Adicionar comentário..."
                className="flex-1 px-3 py-1.5 bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border rounded-full text-xs text-light-text-1 dark:text-dark-text-1 focus:border-brand outline-none transition-colors placeholder:text-light-text-3 dark:placeholder:text-dark-text-3" />
              <button type="submit" className="px-3 py-1.5 bg-brand hover:bg-brand-light text-white text-xs rounded-full transition-colors">→</button>
            </form>
          )}
          {!currentUser && comments.length===0 && <p className="text-xs text-light-text-3 dark:text-dark-text-3">Faça login para comentar</p>}
        </div>
      )}
    </div>
  )
}
