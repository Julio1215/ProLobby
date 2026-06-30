import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'

// ── Geometrias dos dados ──────────────────────────────────────────────────────
const createD4 = () => new THREE.TetrahedronGeometry(1.1)
const createD6 = () => new THREE.BoxGeometry(1.6, 1.6, 1.6)
const createD8 = () => new THREE.OctahedronGeometry(1.1)
const createD10 = () => {
  // D10 aproximado com icosaedro achatado
  const geo = new THREE.CylinderGeometry(0, 1.1, 1.8, 10, 1)
  return geo
}
const createD12 = () => new THREE.DodecahedronGeometry(1.1)
const createD20 = () => new THREE.IcosahedronGeometry(1.1)

const DICE_CONFIG = {
  d4:  { create: createD4,  sides: 4,  color: '#e74c3c', emissive: '#7b0000' },
  d6:  { create: createD6,  sides: 6,  color: '#3498db', emissive: '#0a3d6b' },
  d8:  { create: createD8,  sides: 8,  color: '#2ecc71', emissive: '#0a5c32' },
  d10: { create: createD10, sides: 10, color: '#f39c12', emissive: '#7a4f00' },
  d12: { create: createD12, sides: 12, color: '#9b59b6', emissive: '#4a0e6e' },
  d20: { create: createD20, sides: 20, color: '#7c3aed', emissive: '#3b0d87' },
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.85)',
    zIndex: 9999,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 24, padding: 20,
  },
  title: {
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: 28, fontWeight: 700,
    color: '#f1f0ff', letterSpacing: 2,
    margin: 0,
  },
  canvas: {
    borderRadius: 16,
    border: '1px solid rgba(124,58,237,0.4)',
    boxShadow: '0 0 40px rgba(124,58,237,0.3)',
    cursor: 'pointer',
    maxWidth: '100%',
  },
  diceRow: {
    display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center',
  },
  diceBtn: (active, color) => ({
    padding: '8px 16px',
    background: active ? color : 'rgba(255,255,255,0.08)',
    border: `1px solid ${active ? color : 'rgba(255,255,255,0.15)'}`,
    borderRadius: 8, color: '#fff',
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: 16, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.2s',
  }),
  resultBox: {
    textAlign: 'center', minHeight: 80,
  },
  resultNum: (color) => ({
    fontSize: 56, fontWeight: 800,
    fontFamily: 'Rajdhani, sans-serif',
    color, lineHeight: 1,
    textShadow: `0 0 20px ${color}`,
  }),
  resultLabel: {
    fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 4,
  },
  rollBtn: (color) => ({
    padding: '12px 36px',
    background: color,
    border: 'none', borderRadius: 10,
    color: '#fff', fontSize: 18,
    fontFamily: 'Rajdhani, sans-serif',
    fontWeight: 700, cursor: 'pointer',
    letterSpacing: 1,
    boxShadow: `0 4px 20px ${color}88`,
    transition: 'transform 0.1s',
  }),
  closeBtn: {
    position: 'absolute', top: 16, right: 16,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8, color: '#fff',
    padding: '6px 14px', cursor: 'pointer',
    fontSize: 14,
  },
  historyRow: {
    display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center',
    maxWidth: 400,
  },
  historyChip: (color) => ({
    padding: '3px 10px',
    background: `${color}22`,
    border: `1px solid ${color}55`,
    borderRadius: 20, fontSize: 12,
    color: '#fff', fontFamily: 'Rajdhani, sans-serif',
  }),
}

export default function DiceRoller({ onClose }) {
  const canvasRef   = useRef(null)
  const sceneRef    = useRef({})
  const [diceType,  setDiceType]  = useState('d20')
  const [result,    setResult]    = useState(null)
  const [rolling,   setRolling]   = useState(false)
  const [history,   setHistory]   = useState([])

  const cfg = DICE_CONFIG[diceType]

  // ── Three.js setup ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas  = canvasRef.current
    if (!canvas) return
    const W = Math.min(320, window.innerWidth - 48)
    const H = W

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(window.devicePixelRatio)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.set(0, 0, 4.5)

    // Iluminação
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dLight.position.set(5, 5, 5)
    scene.add(dLight)
    const pLight = new THREE.PointLight(0x7c3aed, 2, 10)
    pLight.position.set(-2, 2, 2)
    scene.add(pLight)

    // Dado
    const geo  = cfg.create()
    const mat  = new THREE.MeshPhongMaterial({
      color:    new THREE.Color(cfg.color),
      emissive: new THREE.Color(cfg.emissive),
      shininess: 80,
      specular:  new THREE.Color('#ffffff'),
    })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    // Aresta wireframe sutil
    const edges    = new THREE.EdgesGeometry(geo)
    const lineMat  = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 })
    const wireframe = new THREE.LineSegments(edges, lineMat)
    mesh.add(wireframe)

    sceneRef.current = { renderer, scene, camera, mesh, animId: null, spinning: true, vx: 0.01, vy: 0.02 }

    const animate = () => {
      const s = sceneRef.current
      s.animId = requestAnimationFrame(animate)
      if (s.spinning) {
        s.mesh.rotation.x += s.vx
        s.mesh.rotation.y += s.vy
      }
      s.renderer.render(s.scene, s.camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(sceneRef.current.animId)
      renderer.dispose()
    }
  }, [diceType])

  // ── Roll ─────────────────────────────────────────────────────────────────
  const roll = useCallback(() => {
    if (rolling) return
    setRolling(true)
    setResult(null)

    const s = sceneRef.current
    s.vx = 0.15
    s.vy = 0.22

    // Desacelera e para
    let ticks = 0
    const decel = setInterval(() => {
      ticks++
      s.vx *= 0.93
      s.vy *= 0.93
      if (ticks > 60) {
        clearInterval(decel)
        s.vx = 0.005
        s.vy = 0.008
        const r = Math.floor(Math.random() * cfg.sides) + 1
        setResult(r)
        setHistory(h => [{ type: diceType, value: r, color: cfg.color }, ...h].slice(0, 12))
        setRolling(false)
      }
    }, 16)
  }, [rolling, diceType, cfg])

  // Fechar com Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button style={styles.closeBtn} onClick={onClose}>✕ Fechar</button>

      <h2 style={styles.title}>🎲 ROLAR DADOS</h2>

      {/* Seletor de dados */}
      <div style={styles.diceRow}>
        {Object.keys(DICE_CONFIG).map(dt => (
          <button
            key={dt}
            style={styles.diceBtn(diceType === dt, DICE_CONFIG[dt].color)}
            onClick={() => { setDiceType(dt); setResult(null) }}
          >
            {dt.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Canvas 3D */}
      <canvas
        ref={canvasRef}
        style={styles.canvas}
        onClick={roll}
        title="Clique para rolar!"
      />

      {/* Resultado */}
      <div style={styles.resultBox}>
        {rolling && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18 }}>Rolando...</p>}
        {result !== null && !rolling && (
          <>
            <div style={styles.resultNum(cfg.color)}>{result}</div>
            <div style={styles.resultLabel}>
              {result === cfg.sides ? '🎉 CRÍTICO!' : result === 1 ? '💀 FALHA CRÍTICA!' : `${diceType.toUpperCase()} rolado`}
            </div>
          </>
        )}
        {result === null && !rolling && (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Clique no dado ou no botão</p>
        )}
      </div>

      {/* Botão rolar */}
      <button style={styles.rollBtn(cfg.color)} onClick={roll} disabled={rolling}>
        {rolling ? 'Rolando...' : `Rolar ${diceType.toUpperCase()}`}
      </button>

      {/* Histórico */}
      {history.length > 0 && (
        <div style={styles.historyRow}>
          {history.map((h, i) => (
            <span key={i} style={styles.historyChip(h.color)}>
              {h.type}: <strong>{h.value}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}