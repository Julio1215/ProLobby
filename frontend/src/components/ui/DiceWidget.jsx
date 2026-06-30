import { useState, useCallback, useRef } from 'react'
import * as THREE from 'three'

const DICE = [4, 6, 8, 10, 12, 20, 100]

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1
}

function getGeometry(sides) {
  switch (sides) {
    case 4:  return new THREE.TetrahedronGeometry(1.1, 0)
    case 8:  return new THREE.OctahedronGeometry(1.1, 0)
    case 12: return new THREE.DodecahedronGeometry(1.0, 0)
    case 20: return new THREE.IcosahedronGeometry(1.0, 0)
    default: return new THREE.BoxGeometry(1.4, 1.4, 1.4)
  }
}

function Dice3D({ rollingRef, sidesRef, result, sides, rolling }) {
  // Guarda referências da cena Three.js
  const threeRef = useRef(null)

  // Callback ref — chamado UMA vez quando o div monta, nunca mais
  const mountCallback = useCallback((node) => {
    if (!node || threeRef.current) return

    const W = 140, H = 140
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    node.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
    camera.position.z = 3.8

    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const d1 = new THREE.DirectionalLight(0xa855f7, 1.4)
    d1.position.set(2, 3, 2)
    scene.add(d1)
    const d2 = new THREE.DirectionalLight(0x00e5ff, 0.5)
    d2.position.set(-2, -1, 1)
    scene.add(d2)

    const mat = new THREE.MeshPhongMaterial({
      color: 0x1a0a40, emissive: 0x7c3aed,
      emissiveIntensity: 0.18, shininess: 80,
      transparent: true, opacity: 0.93,
    })
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7, wireframe: true,
      transparent: true, opacity: 0.22,
    })

    const geo      = getGeometry(sidesRef.current)
    const mesh     = new THREE.Mesh(geo, mat)
    const wireMesh = new THREE.Mesh(geo.clone(), wireMat)
    scene.add(mesh)
    scene.add(wireMesh)

    threeRef.current = { renderer, mesh, wireMesh, mat, node }

    let t = 0
    let frame
    const animate = () => {
      frame = requestAnimationFrame(animate)
      t += 0.016
      if (rollingRef.current) {
        mesh.rotation.x += 0.09
        mesh.rotation.y += 0.13
        mesh.rotation.z += 0.06
        mat.emissiveIntensity = 0.28 + Math.sin(t * 8) * 0.12
      } else {
        mesh.rotation.y += 0.006
        mesh.rotation.x = Math.sin(t * 0.4) * 0.08
        mat.emissiveIntensity = 0.14 + Math.sin(t * 0.8) * 0.04
      }
      wireMesh.rotation.copy(mesh.rotation)
      renderer.render(scene, camera)
    }
    animate()
    threeRef.current.frame = frame
    threeRef.current.cancelFrame = () => cancelAnimationFrame(frame)
  }, [])

  // Troca geometria quando muda o tipo do dado
  const prevSides = useRef(20)
  if (threeRef.current && sides !== prevSides.current) {
    prevSides.current = sides
    const { mesh, wireMesh } = threeRef.current
    const newGeo = getGeometry(sides)
    mesh.geometry.dispose()
    wireMesh.geometry.dispose()
    mesh.geometry     = newGeo
    wireMesh.geometry = newGeo.clone()
  }

  const isCrit   = !rolling && result === sides
  const isFumble = !rolling && result === 1 && sides >= 20

  return (
    <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
      <div ref={mountCallback} style={{ width: 140, height: 140 }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-orbitron)',
          fontSize: result !== null && result >= 100 ? '1.1rem' : '2rem',
          fontWeight: 900, lineHeight: 1,
          color: isCrit ? '#fbbf24' : isFumble ? '#ef4444' : 'white',
          textShadow: isCrit ? '0 0 14px rgba(251,191,36,0.8)' : '0 0 10px rgba(168,85,247,0.7)',
        }}>
          {rolling ? '?' : result !== null ? result : ''}
        </span>
        {!rolling && result !== null && (
          <span style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(240,238,255,0.4)', marginTop: '2px' }}>
            d{sides}
          </span>
        )}
      </div>
    </div>
  )
}

export default function DiceWidget() {
  const [open,    setOpen]    = useState(false)
  const [result,  setResult]  = useState(null)
  const [rolling, setRolling] = useState(false)
  const [lastDie, setLastDie] = useState(20)
  const [history, setHistory] = useState([])

  // Refs para o loop de animação ler sem re-render
  const rollingRef = useRef(false)
  const sidesRef   = useRef(20)

  const roll = useCallback((sides) => {
    if (rollingRef.current) return
    rollingRef.current = true
    sidesRef.current   = sides
    setRolling(true)
    setLastDie(sides)
    setResult(null)

    setTimeout(() => {
      const final = rollDie(sides)
      setResult(final)
      setHistory(prev => [{ die: sides, value: final }, ...prev].slice(0, 8))
      setRolling(false)
      rollingRef.current = false
    }, 1200)
  }, [])

  const isCrit   = !rolling && result === lastDie
  const isFumble = !rolling && result === 1 && lastDie >= 20
  const statusLabel = rolling ? 'Rolando...' : isCrit ? '✨ CRÍTICO!' : isFumble ? '💀 Falha Crítica' : null

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        title="Rolar dados"
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem',
          width: '52px', height: '52px', borderRadius: '16px',
          background: 'linear-gradient(135deg, #7c3aed, #bf00ff)',
          border: 'none', fontSize: '1.4rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
          boxShadow: '0 0 16px rgba(191,0,255,0.3), 0 4px 12px rgba(0,0,0,0.5)',
          transition: 'transform 0.2s',
        }}
        className="hover:scale-110"
      >
        🎲
      </button>

      {/* Sempre no DOM — nunca desmonta */}
      <div style={{
        position: 'fixed', bottom: '6rem', right: '1.5rem', width: '300px',
        background: 'rgba(13,13,26,0.97)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(124,58,237,0.25)',
        borderRadius: '24px', padding: '1.25rem',
        zIndex: 999,
        boxShadow: '0 0 30px rgba(124,58,237,0.12), 0 8px 32px rgba(0,0,0,0.6)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transform: open ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'white' }}>🎲 Rolar Dados</h3>
          <button onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', color: 'rgba(240,238,255,0.4)', cursor: 'pointer', fontSize: '1rem', padding: '4px' }}>
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
          <Dice3D
            rollingRef={rollingRef}
            sidesRef={sidesRef}
            result={result}
            sides={lastDie}
            rolling={rolling}
          />
          {statusLabel && (
            <span style={{
              fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em',
              color: isCrit ? '#fbbf24' : isFumble ? '#ef4444' : 'var(--color-brand-light)',
            }}>
              {statusLabel}
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '0.875rem' }}>
          {DICE.map(d => (
            <button key={d} onClick={() => roll(d)} disabled={rolling}
              style={{
                padding: '0.45rem 0.3rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700,
                border: `1px solid ${lastDie === d ? 'rgba(124,58,237,0.5)' : 'rgba(124,58,237,0.15)'}`,
                background: lastDie === d ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: lastDie === d ? 'var(--color-brand-light)' : 'rgba(240,238,255,0.55)',
                cursor: rolling ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
                fontFamily: 'var(--font-orbitron)',
              }}>
              d{d}
            </button>
          ))}
        </div>

        {history.length > 0 && (
          <div>
            <p style={{ fontSize: '0.6rem', color: 'rgba(240,238,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem', fontWeight: 700 }}>
              Histórico
            </p>
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {history.map((h, i) => (
                <span key={i} style={{
                  padding: '0.15rem 0.4rem', borderRadius: '6px', fontSize: '0.66rem', fontWeight: 700,
                  background: 'rgba(124,58,237,0.1)', color: 'rgba(240,238,255,0.5)',
                  border: '1px solid rgba(124,58,237,0.15)', fontFamily: 'var(--font-orbitron)',
                }}>
                  {h.value}<span style={{ opacity: 0.4, fontSize: '0.52rem' }}>/d{h.die}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}