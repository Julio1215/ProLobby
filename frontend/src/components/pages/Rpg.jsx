// pages/Rpg.jsx
//
// O que foi simplificado:
// - useAuthStore → useAuth()
// - useQuery → useState + useEffect (buscar fichas)
// - useMutation + useQueryClient → funções async simples
//   Em vez de saveMutation.mutate(), chamamos await api.post() diretamente
//   e atualizamos o estado local com setFichas(). O resultado é o mesmo.
//   Não precisamos invalidar cache porque não há cache — o estado é a fonte da verdade.
// - Imports dos sheets atualizados para o novo caminho

import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

import DndSheet    from '../rpg/DndSheet'
import T20Sheet    from '../rpg/T20Sheet'
import CthulhuSheet from '../rpg/CthulhuSheet'
import OrdemSheet  from '../rpg/OrdemSheet'

const SISTEMAS = [
  { valor: 'DND_5E',            label: 'D&D 5e',            icone: '⚔️', cor: '#ef4444' },
  { valor: 'TORMENTA_20',       label: 'Tormenta 20',       icone: '🌊', cor: '#f97316' },
  { valor: 'CALL_OF_CTHULHU',   label: 'Call of Cthulhu',   icone: '🐙', cor: '#a855f7' },
  { valor: 'ORDEM_PARANORMAL',  label: 'Ordem Paranormal',  icone: '🔮', cor: '#3b82f6' },
]

// Card que exibe uma ficha na lista
function CardFicha({ ficha, aoEditar, aoExcluir, aoDuplicar, aoCompartilhar }) {
  const sistema = SISTEMAS.find(s => s.valor === ficha.system)
  const info    = ficha.data?.info || {}

  return (
    <div style={{ background: 'var(--color-dark-card)', backdropFilter: 'blur(20px)', border: '1px solid var(--color-dark-border)', borderRadius: '24px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'all 0.2s', boxShadow: '0 0 20px rgba(124,58,237,0.12)' }}
      className="hover:border-brand hover:-translate-y-1">

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: sistema?.cor }}>{sistema?.icone} {sistema?.label}</div>
        {ficha.isPublic && (
          <span style={{ padding: '0.25rem 0.625rem', borderRadius: '99px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.2)', fontSize: '0.72rem', fontWeight: 500, color: 'var(--color-brand-light)' }}>
            🔗 Público
          </span>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-dark-text-1)' }}>{ficha.name}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-dark-text-2)' }}>
          {info.race  && <span>{info.race}</span>}
          {info.class && <span>• {info.class}</span>}
          {info.level && <span>• Nível {info.level}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <button onClick={() => aoEditar(ficha)}      className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '0.5rem' }}>✏️ Editar</button>
        <button onClick={() => aoDuplicar(ficha.id)} className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '0.5rem' }}>📋 Copiar</button>
        <button onClick={() => aoCompartilhar(ficha)} className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '0.5rem' }}>🔗 Link</button>
        <button onClick={() => aoExcluir(ficha.id)}
          style={{ fontSize: '0.82rem', padding: '0.5rem', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', cursor: 'pointer', transition: 'all 0.2s' }}
          className="hover:bg-red-500/20">
          🗑️ Deletar
        </button>
      </div>
    </div>
  )
}

// Modal para copiar o link de compartilhamento
function ModalCompartilhar({ ficha, aoFechar }) {
  const [copiado, setCopiado] = useState(false)
  const link = `${window.location.origin}/rpg/share/${ficha.shareToken}`

  function copiar() {
    navigator.clipboard.writeText(link)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div onClick={aoFechar}
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: '1rem' }}>
      <div onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '500px', background: 'var(--color-dark-card)', border: '1px solid var(--color-dark-border)', borderRadius: '24px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '0 0 30px rgba(124,58,237,0.25)' }}>

        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>🔗 Compartilhar ficha</h3>
          <p style={{ color: 'var(--color-dark-text-2)' }}>{ficha.name}</p>
        </div>

        {!ficha.isPublic || !ficha.shareToken ? (
          <>
            <div style={{ borderRadius: '16px', border: '1px solid rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.1)', padding: '1rem', fontSize: '0.85rem', color: '#fbbf24' }}>
              Esta ficha não é pública. Ative a opção "Tornar pública" ao editar a ficha.
            </div>
            <button onClick={aoFechar} className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>Fechar</button>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--color-dark-secondary)', border: '1px solid var(--color-dark-border)', borderRadius: '16px', padding: '0.5rem' }}>
              <input readOnly value={link} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.82rem', padding: '0 0.75rem', color: 'var(--color-dark-text-1)' }} />
              <button onClick={copiar} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
                {copiado ? '✓' : '📋'}
              </button>
            </div>
            {copiado && <p style={{ fontSize: '0.82rem', color: 'var(--color-brand-light)' }}>Link copiado!</p>}
            <button onClick={aoFechar} className="btn btn-secondary" style={{ alignSelf: 'flex-end' }}>Fechar</button>
          </>
        )}
      </div>
    </div>
  )
}

export default function Rpg() {
  const { usuario } = useAuth()

  const [tela, setTela]                   = useState('lista')      // 'lista' | 'nova' | 'editar'
  const [sistemaSelecionado, setSistema]  = useState('DND_5E')
  const [fichaEditando, setFichaEditando] = useState(null)
  const [fichaCompartilhar, setFichaCompartilhar] = useState(null)

  const [fichas, setFichas]               = useState([])
  const [carregando, setCarregando]       = useState(true)
  const [salvando, setSalvando]           = useState(false)

  // Busca as fichas do usuário ao montar (só se estiver logado)
  useEffect(() => {
    if (!usuario) { setCarregando(false); return }

    api.get('/rpg/characters')
      .then(res => setFichas(res.data.characters || []))
      .catch(() => setFichas([]))
      .finally(() => setCarregando(false))
  }, [usuario])

  // Salvar/criar ficha — substitui saveMutation do React Query
  async function handleSalvar(dadosFormulario, isPublico) {
    const payload = {
      name:     dadosFormulario.info?.characterName || 'Sem nome',
      system:   sistemaSelecionado,
      data:     dadosFormulario,
      isPublic: isPublico,
    }

    setSalvando(true)
    try {
      if (fichaEditando?.id) {
        // Edição
        const res = await api.put(`/rpg/characters/${fichaEditando.id}`, payload)
        // Atualiza a ficha na lista local sem precisar rebuscar tudo
        setFichas(prev => prev.map(f => f.id === fichaEditando.id ? res.data.character : f))
      } else {
        // Criação
        const res = await api.post('/rpg/characters', payload)
        setFichas(prev => [res.data.character, ...prev])
      }
      setTela('lista')
      setFichaEditando(null)
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao salvar ficha')
    } finally {
      setSalvando(false)
    }
  }

  // Excluir ficha — substitui deleteMutation
  async function handleExcluir(id) {
    if (!window.confirm('Deletar esta ficha?')) return
    try {
      await api.delete(`/rpg/characters/${id}`)
      setFichas(prev => prev.filter(f => f.id !== id))
    } catch {
      alert('Erro ao excluir ficha')
    }
  }

  // Duplicar ficha — substitui dupMutation
  async function handleDuplicar(id) {
    try {
      const res = await api.post(`/rpg/characters/${id}/duplicate`)
      setFichas(prev => [res.data.character, ...prev])
    } catch {
      alert('Erro ao duplicar ficha')
    }
  }

  function handleEditar(ficha) {
    setSistema(ficha.system)
    setFichaEditando(ficha)
    setTela('editar')
  }

  // Tela de login necessário
  if (!usuario) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '1.25rem' }}>
        <span style={{ fontSize: '4rem' }}>🎲</span>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>Fichas RPG</h2>
          <p style={{ color: 'var(--color-dark-text-2)', maxWidth: '360px' }}>Faça login para criar, salvar e compartilhar seus personagens.</p>
        </div>
        <a href="/login" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 1.75rem' }}>
          Entrar / Criar conta
        </a>
      </div>
    )
  }

  // Tela de edição/criação de ficha
  if (tela === 'nova' || tela === 'editar') {
    const Props = {
      initialData:  fichaEditando?.data,
      onSave:       handleSalvar,
      saving:       salvando,
      characterId:  fichaEditando?.id,
      shareToken:   fichaEditando?.shareToken,
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => { setTela('lista'); setFichaEditando(null) }} className="btn btn-secondary" style={{ padding: '0.625rem 1.25rem' }}>
            ← Voltar
          </button>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-dark-text-1)' }}>
            {tela === 'nova' ? 'Nova Ficha' : 'Editar Ficha'} — {SISTEMAS.find(s => s.valor === sistemaSelecionado)?.label}
          </h1>
        </div>

        {sistemaSelecionado === 'DND_5E'           && <DndSheet    {...Props} />}
        {sistemaSelecionado === 'TORMENTA_20'       && <T20Sheet    {...Props} />}
        {sistemaSelecionado === 'ORDEM_PARANORMAL'  && <OrdemSheet  {...Props} />}
        {sistemaSelecionado === 'CALL_OF_CTHULHU'   && <CthulhuSheet {...Props} />}
      </div>
    )
  }

  // Tela de lista de fichas
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>🎲 Fichas RPG</h1>
          <p style={{ color: 'var(--color-dark-text-2)' }}>Crie, edite e compartilhe personagens</p>
        </div>
        <button onClick={() => setTela('nova')} className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}>
          + Nova Ficha
        </button>
      </div>

      {/* Seletor de sistema */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {SISTEMAS.map(s => (
          <button key={s.valor} onClick={() => setSistema(s.valor)}
            style={{ padding: '1.25rem', borderRadius: '24px', border: `1px solid ${sistemaSelecionado === s.valor ? 'var(--color-brand)' : 'var(--color-dark-border)'}`, background: sistemaSelecionado === s.valor ? 'rgba(124,58,237,0.1)' : 'var(--color-dark-card)', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'all 0.2s' }}
            className={sistemaSelecionado === s.valor ? '' : 'hover:border-brand'}>
            <div style={{ fontSize: '2rem', color: s.cor }}>{s.icone}</div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--color-dark-text-1)' }}>{s.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-dark-text-2)' }}>Sistema RPG</div>
            </div>
          </button>
        ))}
      </div>

      {/* Lista de fichas */}
      {carregando ? (
        <div style={{ borderRadius: '24px', border: '1px solid var(--color-dark-border)', background: 'var(--color-dark-card)', padding: '2.5rem', textAlign: 'center', color: 'var(--color-dark-text-2)' }}>
          Carregando fichas...
        </div>
      ) : fichas.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {fichas.map(ficha => (
            <CardFicha
              key={ficha.id}
              ficha={ficha}
              aoEditar={handleEditar}
              aoExcluir={handleExcluir}
              aoDuplicar={handleDuplicar}
              aoCompartilhar={setFichaCompartilhar}
            />
          ))}
        </div>
      ) : (
        <div style={{ borderRadius: '24px', border: '1px solid var(--color-dark-border)', background: 'var(--color-dark-card)', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.25rem' }}>
          <span style={{ fontSize: '4rem' }}>🎲</span>
          <div>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Nenhuma ficha criada ainda</p>
            <p style={{ color: 'var(--color-dark-text-2)' }}>Crie sua primeira ficha RPG</p>
          </div>
          <button onClick={() => setTela('nova')} className="btn btn-primary">Criar primeira ficha</button>
        </div>
      )}

      {/* Modal de compartilhamento */}
      {fichaCompartilhar && (
        <ModalCompartilhar ficha={fichaCompartilhar} aoFechar={() => setFichaCompartilhar(null)} />
      )}
    </div>
  )
}
