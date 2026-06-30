import { useState, useRef, useEffect } from 'react'

const TABS = [
  { key: 'npc',      icon: '🧙', label: 'NPC'       },
  { key: 'cenario',  icon: '🏰', label: 'Cenário'   },
  { key: 'monstro',  icon: '🐉', label: 'Monstro'   },
  { key: 'quest',    icon: '📜', label: 'Quest'      },
  { key: 'encontro', icon: '⚔️', label: 'Encontro'  },
  { key: 'livre',    icon: '💬', label: 'Chat Livre' },
]

const SYSTEMS = ['D&D 5e', 'Tormenta 20', 'Call of Cthulhu', 'Ordem Paranormal', 'Pathfinder 2e']

const PROMPTS = {
  npc: (ctx) => `Você é um Mestre de RPG experiente. Crie um NPC detalhado para ${ctx.system}.
Contexto do jogador: ${ctx.input}
Inclua: nome, raça/origem, personalidade, motivação, segredo, aparência, voz/maneirismo, ganchos de história e estatísticas básicas se relevante.
Seja criativo e específico. Formate com seções claras usando markdown.`,

  cenario: (ctx) => `Você é um Mestre de RPG especialista em world-building. Crie um cenário/local para ${ctx.system}.
Descrição do jogador: ${ctx.input}
Inclua: nome do local, atmosfera/clima, descrição sensorial (sons, cheiros, visão), pontos de interesse, perigos, segredos escondidos, NPCs presentes e possíveis aventuras.
Formate com seções e seja imersivo.`,

  monstro: (ctx) => `Você é um Mestre de RPG e designer de criaturas. Crie um monstro original para ${ctx.system}.
Conceito: ${ctx.input}
Inclua: nome, lore/origem, aparência assustadora, comportamento/táticas, habitat, fraquezas, habilidades especiais, recompensas ao derrotá-lo e bloco de estatísticas básico.
Seja criativo e ameaçador.`,

  quest: (ctx) => `Você é um Mestre de RPG criativo. Crie uma quest/missão para ${ctx.system}.
Tema: ${ctx.input}
Inclua: título, gancho inicial, objetivos principais e secundários, antagonista/obstáculos, reviravoltas, possíveis finais (heroico, sombrio, neutro), recompensas e NPCs envolvidos.
Formate claramente.`,

  encontro: (ctx) => `Você é um Mestre de RPG tático. Crie um encontro de combate/desafio para ${ctx.system}.
Contexto: ${ctx.input}
Inclua: cenário do combate, inimigos (com motivação), condições especiais do terreno, objetivos além de "matar tudo", dificuldade sugerida, possíveis negociações e consequências.`,

  livre: (ctx) => ctx.input,
}

// ============================================
// Chamada à API da Anthropic (Claude)
// ============================================
async function askClaude(prompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: 'Você é um Mestre de RPG (Game Master) experiente e criativo, especializado em múltiplos sistemas de RPG como D&D, Tormenta, Call of Cthulhu e Ordem Paranormal. Responda sempre em português brasileiro. Use markdown para formatar suas respostas com clareza.',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Erro ${response.status}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text || ''
}

// ============================================
// Renderizador de markdown simples
// ============================================
function Markdown({ text }) {
  const html = text
    .replace(/^### (.+)$/gm, '<h3 style="font-size:0.95rem;font-weight:700;color:var(--color-brand-light);margin:1rem 0 0.4rem">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 style="font-size:1.05rem;font-weight:800;color:white;margin:1.2rem 0 0.5rem">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 style="font-size:1.2rem;font-weight:900;color:white;margin:0 0 0.6rem">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--color-brand-light)">$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em style="color:rgba(240,238,255,0.75)">$1</em>')
    .replace(/^- (.+)$/gm,    '<li style="margin:0.2rem 0 0.2rem 1rem;color:rgba(240,238,255,0.85)">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')

  return (
    <div
      style={{ lineHeight: 1.7, fontSize: '0.85rem', color: 'rgba(240,238,255,0.85)' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

// ============================================
// CARD de resultado
// ============================================
function ResultCard({ item, onCopy }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(item.result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.()
  }

  const tabInfo = TABS.find(t => t.key === item.tab)

  return (
    <div style={{
      background: 'var(--color-dark-card)',
      border: '1px solid var(--color-dark-border)',
      borderRadius: '20px',
      overflow: 'hidden',
    }}>
      {/* Header do card */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.875rem 1.25rem',
        borderBottom: '1px solid var(--color-dark-border)',
        background: 'rgba(124,58,237,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span>{tabInfo?.icon}</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-brand-light)' }}>
            {tabInfo?.label}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'rgba(240,238,255,0.35)', borderLeft: '1px solid rgba(124,58,237,0.2)', paddingLeft: '0.6rem' }}>
            {item.system} · {item.timestamp}
          </span>
        </div>
        <button
          onClick={handleCopy}
          style={{
            padding: '0.3rem 0.75rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 600,
            background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.12)',
            border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.25)'}`,
            color: copied ? '#10b981' : 'var(--color-brand-light)',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          {copied ? '✓ Copiado' : '📋 Copiar'}
        </button>
      </div>

      {/* Contexto */}
      <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid rgba(124,58,237,0.08)', background: 'rgba(0,0,0,0.15)' }}>
        <p style={{ fontSize: '0.72rem', color: 'rgba(240,238,255,0.35)', fontStyle: 'italic' }}>
          "{item.input}"
        </p>
      </div>

      {/* Resultado */}
      <div style={{ padding: '1.25rem' }}>
        <Markdown text={item.result} />
      </div>
    </div>
  )
}

// ============================================
// PÁGINA PRINCIPAL
// ============================================
export default function MestrePage() {
  const [tab,     setTab]     = useState('npc')
  const [system,  setSystem]  = useState('D&D 5e')
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [history, setHistory] = useState([])
  const inputRef = useRef(null)

  const PLACEHOLDERS = {
    npc:      'Ex: um mercador corrupto que esconde um segredo sombrio...',
    cenario:  'Ex: uma taverna abandonada às margens de um pântano maldito...',
    monstro:  'Ex: uma criatura que se alimenta de memórias e imita os rostos das vítimas...',
    quest:    'Ex: os personagens precisam recuperar um artefato roubado por uma guilda de ladrões...',
    encontro: 'Ex: os heróis são emboscados em uma ponte estreita por 3 bandidos e um mago...',
    livre:    'Pergunte qualquer coisa ao Mestre: regras, ideias, lore, dicas de narração...',
  }

  const handleGenerate = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError('')

    try {
      const promptFn = PROMPTS[tab]
      const prompt = promptFn({ system, input: input.trim() })
      const result = await askClaude(prompt)

      const item = {
        id:        Date.now(),
        tab,
        system,
        input:     input.trim(),
        result,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }

      setHistory(prev => [item, ...prev])
      setInput('')
      inputRef.current?.focus()
    } catch (err) {
      setError(err.message || 'Erro ao conectar com a IA')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleGenerate()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark-text-1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🧙</span> Mestre de Campanhas IA
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-dark-text-2)' }}>
          Gere NPCs, cenários, monstros e quests com inteligência artificial — de graça
        </p>
      </div>

      {/* Painel de controle */}
      <div style={{
        background: 'var(--color-dark-card)',
        border: '1px solid var(--color-dark-border)',
        borderRadius: '20px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {/* Tabs de tipo */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '0.45rem 0.875rem',
                borderRadius: '99px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: `1px solid ${tab === t.key ? 'var(--color-brand)' : 'var(--color-dark-border)'}`,
                background: tab === t.key ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: tab === t.key ? 'var(--color-brand-light)' : 'var(--color-dark-text-2)',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Sistema RPG */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'rgba(240,238,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Sistema:
          </span>
          {SYSTEMS.map(s => (
            <button
              key={s}
              onClick={() => setSystem(s)}
              style={{
                padding: '0.3rem 0.7rem',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
                border: `1px solid ${system === s ? 'rgba(124,58,237,0.5)' : 'rgba(124,58,237,0.12)'}`,
                background: system === s ? 'rgba(124,58,237,0.12)' : 'transparent',
                color: system === s ? 'var(--color-brand-light)' : 'rgba(240,238,255,0.4)',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={PLACEHOLDERS[tab]}
            rows={3}
            className="input"
            style={{ resize: 'vertical', lineHeight: 1.6, fontSize: '0.88rem' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'rgba(240,238,255,0.3)' }}>
              Ctrl+Enter para gerar
            </span>
            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="btn btn-primary"
              style={{ fontSize: '0.85rem', minWidth: '140px' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                  Gerando...
                </span>
              ) : `✨ Gerar ${TABS.find(t => t.key === tab)?.label}`}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.82rem' }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div style={{ background: 'var(--color-dark-card)', border: '1px solid var(--color-dark-border)', borderRadius: '20px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid rgba(124,58,237,0.2)', borderTopColor: 'var(--color-brand)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--color-dark-text-2)' }}>
            O Mestre está preparando algo épico...
          </p>
        </div>
      )}

      {/* Histórico de resultados */}
      {history.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark-text-1)' }}>
              📜 Gerados nesta sessão
            </h2>
            <button
              onClick={() => setHistory([])}
              style={{ fontSize: '0.72rem', color: 'rgba(240,238,255,0.35)', background: 'none', border: 'none', cursor: 'pointer' }}
              className="hover:text-red-400"
            >
              Limpar histórico
            </button>
          </div>

          {history.map(item => (
            <ResultCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && history.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '3rem 2rem', gap: '1rem',
          background: 'rgba(124, 58, 237, 0.12)',
          border: '1px dashed rgba(124,58,237,0.2)',
          borderRadius: '20px',
        }}>
          <span style={{ fontSize: '3rem' }}>🎲</span>
          <div>
            <p style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-dark-text-1)' }}>
              Pronto para criar aventuras épicas
            </p>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-dark-text-2)', maxWidth: '360px' }}>
              Escolha o tipo de conteúdo, o sistema RPG, descreva o que quer e deixe a IA trabalhar
            </p>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
