import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'

import DndSheet from '../rpg/DndSheet'
import T20Sheet from '../rpg/T20Sheet'
import CthulhuSheet from '../rpg/CthulhuSheet'
import OrdemSheet from '../rpg/OrdemSheet'

const SYSTEMS = [
  {
    value: 'DND_5E',
    label: 'D&D 5e',
    icon: '⚔️',
    color: '#ef4444',
  },

  {
    value: 'TORMENTA_20',
    label: 'Tormenta 20',
    icon: '🌊',
    color: '#f97316',
  },

  {
    value: 'CALL_OF_CTHULHU',
    label: 'Call of Cthulhu',
    icon: '🐙',
    color: '#a855f7',
  },

  {
    value: 'ORDEM_PARANORMAL',
    label: 'Ordem Paranormal',
    icon: '🔮',
    color: '#3b82f6',
  },
]

function CharacterCard({
  char,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
}) {
  const system = SYSTEMS.find(s => s.value === char.system)

  const info = char.data?.info || {}

  return (
    <div className="
      bg-dark-card/90
      backdrop-blur-xl
      border border-dark-border
      rounded-3xl
      p-5
      flex flex-col gap-4
      hover:border-brand
      hover:-translate-y-1
      transition-all
      shadow-[0_0_20px_rgba(124,58,237,0.12)]
    ">

      <div className="flex items-start justify-between gap-3">
        <div
          className="text-sm font-semibold"
          style={{ color: system?.color }}
        >
          {system?.icon} {system?.label}
        </div>

        {char.isPublic && (
          <span className="
            px-2.5 py-1
            rounded-full
            bg-brand/15
            border border-brand/20
            text-xs
            font-medium
            text-brand-light
          ">
            🔗 Público
          </span>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold mb-2">
          {char.name}
        </h3>

        <div className="flex flex-wrap gap-2 text-sm text-dark-text-2">
          {info.race && (
            <span>{info.race}</span>
          )}

          {info.class && (
            <span>• {info.class}</span>
          )}

          {info.level && (
            <span>• Nível {info.level}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">

        <button
          onClick={() => onEdit(char)}
          className="
            px-3 py-2
            rounded-xl
            bg-dark-secondary
            border border-dark-border
            hover:border-brand
            text-sm
            transition-all
          "
        >
          ✏️ Editar
        </button>

        <button
          onClick={() => onDuplicate(char.id)}
          className="
            px-3 py-2
            rounded-xl
            bg-dark-secondary
            border border-dark-border
            hover:border-brand
            text-sm
            transition-all
          "
        >
          📋 Copiar
        </button>

        <button
          onClick={() => onShare(char)}
          className="
            px-3 py-2
            rounded-xl
            bg-dark-secondary
            border border-dark-border
            hover:border-brand
            text-sm
            transition-all
          "
        >
          🔗 Link
        </button>

        <button
          onClick={() => onDelete(char.id)}
          className="
            px-3 py-2
            rounded-xl
            bg-red-500/10
            border border-red-500/20
            hover:bg-red-500/20
            text-red-400
            text-sm
            transition-all
          "
        >
          🗑️ Deletar
        </button>
      </div>
    </div>
  )
}

function ShareModal({ char, onClose }) {
  const link = `${window.location.origin}/rpg/share/${char.shareToken}`

  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(link)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div
      onClick={onClose}
      className="
        fixed inset-0
        z-50
        flex items-center justify-center
        bg-black/70
        backdrop-blur-sm
        p-4
      "
    >
      <div
        onClick={e => e.stopPropagation()}
        className="
          w-full max-w-lg
          bg-dark-card
          border border-dark-border
          rounded-3xl
          p-6
          flex flex-col gap-5
          shadow-[0_0_30px_rgba(124,58,237,0.25)]
        "
      >
        <div>
          <h3 className="text-2xl font-bold mb-1">
            🔗 Compartilhar ficha
          </h3>

          <p className="text-dark-text-2">
            {char.name}
          </p>
        </div>

        {!char.isPublic || !char.shareToken ? (
          <>
            <div className="
              rounded-2xl
              border border-yellow-500/20
              bg-yellow-500/10
              p-4
              text-sm
            ">
              Esta ficha não é pública.
              Ative a opção "Tornar pública"
              ao editar a ficha.
            </div>

            <button
              onClick={onClose}
              className="
                self-end
                px-5 py-2.5
                rounded-2xl
                bg-brand
                text-white
                font-semibold
              "
            >
              Fechar
            </button>
          </>
        ) : (
          <>
            <div className="
              flex gap-2
              bg-dark-secondary
              border border-dark-border
              rounded-2xl
              p-2
            ">
              <input
                readOnly
                value={link}
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-sm
                  px-3
                "
              />

              <button
                onClick={copy}
                className="
                  px-4 py-2
                  rounded-xl
                  bg-brand
                  text-white
                  font-semibold
                "
              >
                {copied ? '✓' : '📋'}
              </button>
            </div>

            {copied && (
              <p className="text-sm text-brand-light">
                Link copiado!
              </p>
            )}

            <button
              onClick={onClose}
              className="
                self-end
                px-5 py-2.5
                rounded-2xl
                bg-dark-secondary
                border border-dark-border
              "
            >
              Fechar
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function RpgPage() {
  const { user } = useAuthStore()

  const qc = useQueryClient()

  const [view, setView] = useState('list')

  const [selectedSystem, setSelectedSystem] =
    useState('DND_5E')

  const [editingChar, setEditingChar] =
    useState(null)

  const [shareChar, setShareChar] =
    useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['rpg-chars'],

    queryFn: () =>
      api
        .get('/rpg/characters')
        .then(r => r.data.characters),

    enabled: !!user,
  })

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      id
        ? api.put(`/rpg/characters/${id}`, payload)
        : api.post('/rpg/characters', payload),

    onSuccess: () => {
      qc.invalidateQueries(['rpg-chars'])

      setView('list')

      setEditingChar(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) =>
      api.delete(`/rpg/characters/${id}`),

    onSuccess: () =>
      qc.invalidateQueries(['rpg-chars']),
  })

  const dupMutation = useMutation({
    mutationFn: (id) =>
      api.post(`/rpg/characters/${id}/duplicate`),

    onSuccess: () =>
      qc.invalidateQueries(['rpg-chars']),
  })

  const handleSave = (formData, isPublic) => {
    const payload = {
      name:
        formData.info?.characterName ||
        'Sem nome',

      system: selectedSystem,

      data: formData,

      isPublic,
    }

    saveMutation.mutate({
      id: editingChar?.id,
      payload,
    })
  }

  const handleEdit = (char) => {
    setSelectedSystem(char.system)

    setEditingChar(char)

    setView('edit')
  }

  const handleDelete = (id) => {
    if (window.confirm('Deletar esta ficha?')) {
      deleteMutation.mutate(id)
    }
  }

  if (!user) {
    return (
      <div className="
        min-h-[70vh]
        flex flex-col items-center justify-center
        text-center
        gap-5
      ">
        <div className="text-7xl">
          🎲
        </div>

        <div>
          <h2 className="text-4xl font-black mb-3">
            Fichas RPG
          </h2>

          <p className="text-dark-text-2 max-w-md">
            Faça login para criar,
            salvar e compartilhar
            seus personagens.
          </p>
        </div>

        <a
          href="/login"
          className="
            px-7 py-3
            rounded-2xl
            bg-brand
            text-white
            font-semibold
            hover:opacity-90
            transition-opacity
          "
        >
          Entrar / Criar conta
        </a>
      </div>
    )
  }

  if (view === 'new' || view === 'edit') {
    return (
      <div className="flex flex-col gap-6">

        <div className="
          flex items-center gap-4
          flex-wrap
        ">
          <button
            onClick={() => {
              setView('list')
              setEditingChar(null)
            }}
            className="
              px-5 py-2.5
              rounded-2xl
              bg-dark-secondary
              border border-dark-border
              hover:border-brand
              transition-all
            "
          >
            ← Voltar
          </button>

          <h1 className="text-2xl font-bold">
            {view === 'new'
              ? 'Nova Ficha'
              : 'Editar Ficha'}

            {' — '}

            {
              SYSTEMS.find(
                s => s.value === selectedSystem
              )?.label
            }
          </h1>
        </div>

        {selectedSystem === 'DND_5E' && (
          <DndSheet
            initialData={editingChar?.data}
            onSave={handleSave}
            saving={saveMutation.isPending}
            characterId={editingChar?.id}
            shareToken={editingChar?.shareToken}
          />
        )}

        {selectedSystem === 'TORMENTA_20' && (
          <T20Sheet
            initialData={editingChar?.data}
            onSave={handleSave}
            saving={saveMutation.isPending}
            characterId={editingChar?.id}
            shareToken={editingChar?.shareToken}
          />
        )}

        {selectedSystem === 'ORDEM_PARANORMAL' && (
          <OrdemSheet
            initialData={editingChar?.data}
            onSave={handleSave}
            saving={saveMutation.isPending}
            characterId={editingChar?.id}
            shareToken={editingChar?.shareToken}
          />
        )}

        {selectedSystem === 'CALL_OF_CTHULHU' && (
          <CthulhuSheet
            initialData={editingChar?.data}
            onSave={handleSave}
            saving={saveMutation.isPending}
            characterId={editingChar?.id}
            shareToken={editingChar?.shareToken}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">

      {/* HEADER */}
      <div className="
        flex items-center justify-between
        gap-4 flex-wrap
      ">
        <div>
          <h1 className="text-4xl font-black mb-2">
            🎲 Fichas RPG
          </h1>

          <p className="text-dark-text-2">
            Crie, edite e compartilhe personagens
          </p>
        </div>

        <button
          onClick={() => setView('new')}
          className="
            px-6 py-3
            rounded-2xl
            bg-brand
            text-white
            font-semibold
            hover:opacity-90
            transition-opacity
          "
        >
          + Nova Ficha
        </button>
      </div>

      {/* SYSTEMS */}
      <div className="
        grid grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-4
      ">
        {SYSTEMS.map(s => (
          <button
            key={s.value}
            onClick={() => setSelectedSystem(s.value)}
            className={`
              p-5
              rounded-3xl
              border
              transition-all
              text-left
              flex flex-col gap-3

              ${
                selectedSystem === s.value
                  ? 'border-brand bg-brand/10'
                  : 'border-dark-border bg-dark-card hover:border-brand'
              }
            `}
          >
            <div
              className="text-4xl"
              style={{ color: s.color }}
            >
              {s.icon}
            </div>

            <div>
              <div className="font-bold">
                {s.label}
              </div>

              <div className="text-sm text-dark-text-2">
                Sistema RPG
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="
          rounded-3xl
          border border-dark-border
          bg-dark-card
          p-10
          text-center
        ">
          Carregando fichas...
        </div>
      ) : data?.length > 0 ? (
        <div className="
          grid grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-5
        ">
          {data.map(char => (
            <CharacterCard
              key={char.id}
              char={char}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={(id) =>
                dupMutation.mutate(id)
              }
              onShare={(char) =>
                setShareChar(char)
              }
            />
          ))}
        </div>
      ) : (
        <div className="
          rounded-3xl
          border border-dark-border
          bg-dark-card
          p-12
          flex flex-col items-center
          text-center
          gap-5
        ">
          <div className="text-7xl">
            🎲
          </div>

          <div>
            <p className="text-xl font-semibold mb-2">
              Nenhuma ficha criada ainda
            </p>

            <p className="text-dark-text-2">
              Crie sua primeira ficha RPG
            </p>
          </div>

          <button
            onClick={() => setView('new')}
            className="
              px-6 py-3
              rounded-2xl
              bg-brand
              text-white
              font-semibold
            "
          >
            Criar primeira ficha
          </button>
        </div>
      )}

      {shareChar && (
        <ShareModal
          char={shareChar}
          onClose={() => setShareChar(null)}
        />
      )}
    </div>
  )
}
