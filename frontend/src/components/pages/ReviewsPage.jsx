import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../../services/api'

const fetchGameReview = (title) =>
  api
    .get(`/qcd/search?title=${encodeURIComponent(title)}`)
    .then(r => r.data)

const SCORE_COLOR = (score) => {
  if (score >= 85) return '#10b981'
  if (score >= 70) return '#3b82f6'
  if (score >= 55) return '#f59e0b'
  return '#ef4444'
}

const PLATFORMS = [
  'PC',
  'PlayStation 5',
  'Xbox Series X|S',
  'Nintendo Switch',
  'PlayStation 4',
  'Xbox One',
]

const GENRES = [
  'Action',
  'RPG',
  'Adventure',
  'Platform',
  'Shooter',
  'Strategy',
  'Simulation',
  'Indie',
  'Fighting',
  'Racing',
]

function ScoreRing({
  score,
  max = 100,
  label,
  color,
}) {
  const pct = Math.min((score / max) * 100, 100)

  const r = 36

  const circ = 2 * Math.PI * r

  const dash = (pct / 100) * circ

  return (
    <div className="
      flex flex-col items-center gap-2
    ">
      <svg
        width="90"
        height="90"
        viewBox="0 0 90 90"
      >
        <circle
          cx="45"
          cy="45"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="7"
        />

        <circle
          cx="45"
          cy="45"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 45 45)"
          style={{
            transition:
              'stroke-dasharray 0.8s ease',
          }}
        />

        <text
          x="45"
          y="49"
          textAnchor="middle"
          fill={color}
          fontSize="16"
          fontWeight="700"
        >
          {score ?? '?'}
        </text>
      </svg>

      <span className="
        text-xs
        uppercase
        tracking-wide
        text-dark-text-2
      ">
        {label}
      </span>
    </div>
  )
}

function ScoreBar({
  label,
  value,
  max = 10,
  color,
}) {
  const pct = Math.min(
    (value / max) * 100,
    100
  )

  return (
    <div className="
      flex items-center gap-3
    ">
      <span className="
        w-40
        text-sm
        text-dark-text-2
      ">
        {label}
      </span>

      <div className="
        flex-1
        h-3
        rounded-full
        overflow-hidden
        bg-white/5
      ">
        <div
          className="
            h-full
            rounded-full
            transition-all
            duration-700
          "
          style={{
            width: `${pct}%`,
            background: color,
          }}
        />
      </div>

      <span
        className="
          w-12
          text-right
          text-sm
          font-bold
        "
        style={{ color }}
      >
        {value ?? '—'}
      </span>
    </div>
  )
}

function GameReviewCard({
  data,
  onCompare,
  isComparing,
}) {
  const criticColor = SCORE_COLOR(
    data.criticScore
  )

  const generalColor = SCORE_COLOR(
    (data.igdbRating || 0) * 10
  )

  return (
    <div className={`
      rounded-3xl
      border
      p-6
      flex flex-col gap-6
      backdrop-blur-xl
      transition-all

      ${
        isComparing
          ? 'border-brand bg-brand/10'
          : 'border-dark-border bg-dark-card/90'
      }
    `}>

      {/* TOP */}
      <div className="
        grid grid-cols-1
        xl:grid-cols-[220px_1fr_220px]
        gap-6
      ">

        {/* COVER */}
        <div className="
          aspect-[3/4]
          rounded-2xl
          overflow-hidden
          bg-dark-secondary
        ">
          {data.coverUrl ? (
            <img
              src={data.coverUrl}
              alt={data.title}
              className="
                w-full
                h-full
                object-cover
              "
            />
          ) : (
            <div className="
              w-full
              h-full
              flex items-center justify-center
              text-6xl
            ">
              🎮
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="
          flex flex-col gap-4
        ">
          <div>
            <h2 className="
              text-4xl
              font-black
              mb-2
            ">
              {data.title}
            </h2>

            {data.releaseDate && (
              <span className="
                text-dark-text-2
              ">
                {
                  new Date(
                    data.releaseDate
                  ).getFullYear()
                }
              </span>
            )}
          </div>

          <div className="
            flex flex-wrap gap-2
          ">
            {data.genres
              ?.slice(0, 3)
              .map(g => (
                <span
                  key={g}
                  className="
                    px-3 py-1
                    rounded-full
                    bg-brand/10
                    border border-brand/20
                    text-sm
                  "
                >
                  {g}
                </span>
              ))}
          </div>

          <div className="
            flex flex-wrap gap-2
          ">
            {data.platforms
              ?.slice(0, 4)
              .map(p => (
                <span
                  key={p}
                  className="
                    px-3 py-1
                    rounded-full
                    bg-white/5
                    border border-white/10
                    text-xs
                  "
                >
                  {p}
                </span>
              ))}
          </div>

          <div className="
            flex flex-wrap gap-4
            text-sm
            text-dark-text-2
            mt-2
          ">
            {data.hoursMain && (
              <span>
                ⏱ ~{data.hoursMain}h
              </span>
            )}

            {data.priceUsd && (
              <span>
                💰 ${data.priceUsd}
              </span>
            )}
          </div>

          {data.qcdCategory && (
            <div>
              <span className="
                px-4 py-2
                rounded-full
                bg-brand/15
                border border-brand/20
                text-brand-light
                text-sm
                font-semibold
              ">
                {data.qcdLabel}
              </span>
            </div>
          )}
        </div>

        {/* SCORES */}
        <div className="
          flex justify-center gap-4
          xl:flex-col xl:items-center
        ">
          {data.criticScore && (
            <ScoreRing
              score={data.criticScore}
              label="Crítica"
              color={criticColor}
            />
          )}

          {data.igdbRating && (
            <ScoreRing
              score={Math.round(
                data.igdbRating * 10
              )}
              label="Geral"
              color={generalColor}
            />
          )}
        </div>
      </div>

      {/* BARS */}
      <div className="
        flex flex-col gap-4
      ">
        <ScoreBar
          label="Nota da Crítica"
          value={
            data.criticScore
              ? (
                  data.criticScore / 10
                ).toFixed(1)
              : null
          }
          max={10}
          color={criticColor}
        />

        <ScoreBar
          label="Nota Geral IGDB"
          value={
            data.igdbRating
              ? data.igdbRating.toFixed(1)
              : null
          }
          max={10}
          color={generalColor}
        />

        {data.qcdScore && (
          <ScoreBar
            label="Score QCD"
            value={Math.min(
              data.qcdScore,
              20
            )}
            max={20}
            color="#7c3aed"
          />
        )}
      </div>

      {/* ACTIONS */}
      <div className="
        flex justify-end
      ">
        <button
          onClick={() => onCompare(data)}
          className={`
            px-6 py-3
            rounded-2xl
            font-semibold
            transition-all

            ${
              isComparing
                ? 'bg-brand text-white'
                : 'bg-dark-secondary border border-dark-border hover:border-brand'
            }
          `}
        >
          {isComparing
            ? '✓ Comparando'
            : '⚖️ Comparar'}
        </button>
      </div>
    </div>
  )
}

function ComparePanel({
  gameA,
  gameB,
  onClose,
}) {
  if (!gameA || !gameB) return null

  const fields = [
    {
      label: 'Nota da Crítica',
      a: gameA.criticScore,
      b: gameB.criticScore,
      suffix: '/100',
      higher: true,
    },

    {
      label: 'Nota Geral',
      a: gameA.igdbRating
        ? (
            gameA.igdbRating * 10
          ).toFixed(0)
        : null,

      b: gameB.igdbRating
        ? (
            gameB.igdbRating * 10
          ).toFixed(0)
        : null,

      suffix: '/100',
      higher: true,
    },

    {
      label: 'Horas',
      a: gameA.hoursMain,
      b: gameB.hoursMain,
      suffix: 'h',
      higher: true,
    },

    {
      label: 'Preço',
      a: gameA.priceUsd,
      b: gameB.priceUsd,
      prefix: '$',
      higher: false,
    },

    {
      label: 'QCD',
      a: gameA.qcdScore,
      b: gameB.qcdScore,
      higher: true,
    },
  ]

  const winner = (
    a,
    b,
    higher
  ) => {
    if (!a || !b) return null

    const na = parseFloat(a)
    const nb = parseFloat(b)

    if (na === nb) return 'tie'

    return higher
      ? na > nb
        ? 'a'
        : 'b'
      : na < nb
        ? 'a'
        : 'b'
  }

  return (
    <div className="
      rounded-3xl
      border border-brand/20
      bg-brand/10
      p-6
      flex flex-col gap-5
    ">
      <div className="
        flex items-center justify-between
      ">
        <h3 className="
          text-2xl
          font-bold
        ">
          ⚖️ Comparação
        </h3>

        <button
          onClick={onClose}
          className="
            w-10 h-10
            rounded-xl
            bg-black/20
          "
        >
          ✕
        </button>
      </div>

      <div className="
        grid grid-cols-3
        gap-4
        text-center
        font-semibold
      ">
        <div>{gameA.title}</div>

        <div className="
          text-dark-text-2
        ">
          vs
        </div>

        <div>{gameB.title}</div>
      </div>

      <div className="
        flex flex-col gap-3
      ">
        {fields.map(f => {
          const w = winner(
            f.a,
            f.b,
            f.higher
          )

          return (
            <div
              key={f.label}
              className="
                grid grid-cols-3
                gap-4
                items-center
                text-center
                rounded-2xl
                bg-black/10
                p-3
              "
            >
              <div className={`
                font-bold
                ${
                  w === 'a'
                    ? 'text-emerald-400'
                    : ''
                }
              `}>
                {f.prefix}
                {f.a ?? '—'}
                {f.suffix}
              </div>

              <div className="
                text-sm
                text-dark-text-2
              ">
                {f.label}
              </div>

              <div className={`
                font-bold
                ${
                  w === 'b'
                    ? 'text-emerald-400'
                    : ''
                }
              `}>
                {f.prefix}
                {f.b ?? '—'}
                {f.suffix}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  const [search, setSearch] =
    useState('')

  const [query, setQuery] =
    useState('')

  const [compareA, setCompareA] =
    useState(null)

  const [compareB, setCompareB] =
    useState(null)

  const [filterGenre, setFilterGenre] =
    useState('')

  const [
    filterPlatform,
    setFilterPlatform,
  ] = useState('')

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['review', query],

    queryFn: () =>
      fetchGameReview(query),

    enabled: !!query,
  })

  const { data: topGames } =
    useQuery({
      queryKey: ['top-games'],

      queryFn: () =>
        api
          .get('/qcd/ranking?limit=12')
          .then(r => r.data.ranking),
    })

  const handleSearch = (e) => {
    e.preventDefault()

    if (search.trim()) {
      setQuery(search.trim())
    }
  }

  const handleCompare = (game) => {
    if (!compareA) {
      setCompareA(game)
      return
    }

    if (
      compareA.title === game.title
    ) {
      setCompareA(null)
      return
    }

    setCompareB(game)
  }

  const isComparing = (game) =>
    compareA?.title === game?.title ||
    compareB?.title === game?.title

  const filtered = topGames?.filter(g => {
    if (
      filterGenre &&
      !g.genres?.includes(filterGenre)
    ) {
      return false
    }

    if (
      filterPlatform &&
      !g.platforms?.includes(
        filterPlatform
      )
    ) {
      return false
    }

    return true
  })

  return (
    <div className="
      flex flex-col gap-8
    ">

      {/* HEADER */}
      <div>
        <h1 className="
          text-5xl
          font-black
          mb-3
        ">
          ⭐ Reviews
        </h1>

        <p className="
          text-lg
          text-dark-text-2
        ">
          Reviews da crítica e dos jogadores
        </p>
      </div>

      {/* SEARCH */}
      <form
        onSubmit={handleSearch}
        className="
          flex flex-col sm:flex-row
          gap-3
        "
      >
        <input
          value={search}
          onChange={e =>
            setSearch(e.target.value)
          }
          placeholder="
            Buscar jogo...
          "
          className="
            flex-1
            px-5 py-4
            rounded-2xl
            bg-dark-card
            border border-dark-border
            outline-none
            focus:border-brand
          "
        />

        <button
          type="submit"
          disabled={isLoading}
          className="
            px-7 py-4
            rounded-2xl
            bg-brand
            text-white
            font-semibold
          "
        >
          {isLoading
            ? 'Buscando...'
            : '🔍 Buscar'}
        </button>
      </form>

      {/* ERROR */}
      {isError && (
        <div className="
          rounded-2xl
          border border-red-500/20
          bg-red-500/10
          p-4
        ">
          Erro ao buscar jogo.
        </div>
      )}

      {/* SEARCH RESULT */}
      {data && (
        <GameReviewCard
          data={data}
          onCompare={handleCompare}
          isComparing={isComparing(data)}
        />
      )}

      {/* COMPARE */}
      {compareA && compareB && (
        <ComparePanel
          gameA={compareA}
          gameB={compareB}
          onClose={() => {
            setCompareA(null)
            setCompareB(null)
          }}
        />
      )}

      {/* FILTERS */}
      {topGames?.length > 0 && (
        <section className="
          flex flex-col gap-6
        ">
          <div className="
            flex items-center justify-between
            gap-4 flex-wrap
          ">
            <h2 className="
              text-3xl
              font-bold
            ">
              🏆 Jogos em destaque
            </h2>

            <div className="
              flex gap-3 flex-wrap
            ">
              <select
                value={filterGenre}
                onChange={e =>
                  setFilterGenre(
                    e.target.value
                  )
                }
                className="
                  px-4 py-3
                  rounded-2xl
                  bg-dark-card
                  border border-dark-border
                "
              >
                <option value="">
                  Todos gêneros
                </option>

                {GENRES.map(g => (
                  <option
                    key={g}
                    value={g}
                  >
                    {g}
                  </option>
                ))}
              </select>

              <select
                value={filterPlatform}
                onChange={e =>
                  setFilterPlatform(
                    e.target.value
                  )
                }
                className="
                  px-4 py-3
                  rounded-2xl
                  bg-dark-card
                  border border-dark-border
                "
              >
                <option value="">
                  Todas plataformas
                </option>

                {PLATFORMS.map(p => (
                  <option
                    key={p}
                    value={p}
                  >
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* GRID */}
          <div className="
            grid grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-5
          ">
            {(filtered || topGames).map(
              (game, i) => (
                <div
                  key={game.id}
                  onClick={() =>
                    handleCompare(game)
                  }
                  className={`
                    rounded-3xl
                    border
                    p-4
                    flex gap-4
                    cursor-pointer
                    transition-all

                    ${
                      isComparing(game)
                        ? 'border-brand bg-brand/10'
                        : 'border-dark-border bg-dark-card hover:border-brand'
                    }
                  `}
                >
                  <div className="
                    text-2xl
                    font-black
                    text-brand
                    w-10
                  ">
                    #{i + 1}
                  </div>

                  <div className="
                    w-20 h-24
                    rounded-xl
                    overflow-hidden
                    bg-dark-secondary
                    shrink-0
                  ">
                    {game.coverUrl ? (
                      <img
                        src={game.coverUrl}
                        alt={game.title}
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />
                    ) : (
                      <div className="
                        w-full
                        h-full
                        flex items-center justify-center
                      ">
                        🎮
                      </div>
                    )}
                  </div>

                  <div className="
                    flex-1 min-w-0
                  ">
                    <div className="
                      font-bold
                      truncate
                      mb-2
                    ">
                      {game.title}
                    </div>

                    <div className="
                      text-sm
                      text-dark-text-2
                    ">
                      ⭐ {
                        game.metacriticScore
                      }
                    </div>

                    <div className="
                      text-sm
                      text-dark-text-2
                    ">
                      ⏱ {
                        game.hoursMain
                      }h
                    </div>

                    <div className="
                      text-sm
                      text-dark-text-2
                    ">
                      💰 $
                      {game.priceUsd}
                    </div>
                  </div>

                  <div
                    className="
                      text-3xl
                      font-black
                    "
                    style={{
                      color: SCORE_COLOR(
                        game.metacriticScore || 0
                      ),
                    }}
                  >
                    {
                      game.metacriticScore
                    }
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}
    </div>
  )
}

