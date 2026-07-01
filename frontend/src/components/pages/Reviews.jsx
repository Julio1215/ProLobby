import React, { useState, useEffect } from 'react';

const API_KEY = "cefc0006209c484687decc03b3015a2c";

const termosBloqueados = [
  "sex", "sexual", "hentai", "porn", "porno", "adult", "erotic", "nsfw", "18+"
];

function jogoPermitido(game) {
  const nome = (game.name || "").toLowerCase();
  const tags = game.tags ? game.tags.map(tag => tag.name.toLowerCase()).join(" ") : "";
  return !termosBloqueados.some(termo => `${nome} ${tags}`.includes(termo));
}

export default function Reviews() {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [jogoSelecionado, setJogoSelecionado] = useState(null);

  useEffect(() => {
    if (!jogoSelecionado) carregarJogos();
  }, [jogoSelecionado]);

  async function carregarJogos() {
    try {
      setLoading(true);
      const response = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=40&metacritic=75,100`);
      const data = await response.json();
      setJogos((data.results || []).filter(jogoPermitido).slice(0, 16));
    } catch (err) {
      console.error(err);
    } {
      setLoading(false);
    }
  }

  async function pesquisar(nome) {
    if (nome.trim().length === 0) return carregarJogos();
    try {
      setLoading(true);
      const response = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(nome)}`);
      const data = await response.json();
      setJogos((data.results || []).filter(jogoPermitido));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const abrirReview = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
      const gameData = await response.json();
      setJogoSelecionado(gameData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (jogoSelecionado) {
    return (
      <main className="max-w-7xl mx-auto px-4 mt-6">
        <div className="mb-6">
          <button onClick={() => setJogoSelecionado(null)} className="bg-gray-800/80 hover:bg-gray-700 border border-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer">
            <i className="bi bi-arrow-left"></i> Voltar para Análises
          </button>
        </div>

        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 aspect-[4/5] rounded-xl overflow-hidden border border-gray-700">
              <img src={jogoSelecionado.background_image} alt={jogoSelecionado.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-gray-700 pb-4">
                <h2 className="text-3xl font-extrabold text-purple-400">{jogoSelecionado.name}</h2>
                <div className="bg-purple-500/10 text-purple-400 px-4 py-1.5 rounded-full border border-purple-500/20 font-bold text-sm">
                  Metacritic: {jogoSelecionado.metacritic || "N/A"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-gray-900/50 p-4 rounded-xl border border-gray-700/40 text-gray-300">
                <p><strong>📅 Lançamento:</strong> {jogoSelecionado.released}</p>
                <p><strong>⭐ Avaliação:</strong> {jogoSelecionado.rating}/5</p>
                <p className="col-span-2 truncate"><strong>🖥️ Plataformas:</strong> {jogoSelecionado.platforms?.map(p => p.platform.name).join(", ")}</p>
              </div>

              <div>
                <h4 className="font-bold text-purple-300 mb-1.5 text-base">Veredito Pro Lobby</h4>
                <p className="text-gray-300 text-sm leading-relaxed max-h-60 overflow-y-auto pr-2">{jogoSelecionado.description_raw || "Descrição textual indisponível para esta análise."}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 mt-6">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">Análises de Jogos</h2>
          <p className="text-sm text-gray-400">Reviews especializadas fundamentadas por dados críticos</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input type="search" placeholder="Pesquisar análise..." value={busca} onChange={(e) => setBusca(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && pesquisar(busca)} className="px-4 py-2 w-full md:w-64 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
          <button onClick={() => pesquisar(busca)} className="bg-purple-400 hover:bg-purple-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">Buscar</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400"><i className="bi bi-arrow-clockwise animate-spin text-xl"></i> Buscando reviews...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {jogos.map((game) => (
            <div key={game.id} onClick={() => abrirReview(game.id)} className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 hover:border-purple-500/50 transition-all group cursor-pointer backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="aspect-[4/5] overflow-hidden rounded-lg mb-4 bg-gray-700">
                  <img src={game.background_image || ""} alt={game.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="font-bold text-base group-hover:text-purple-400 transition-colors line-clamp-1 mb-2">{game.name}</h3>
              </div>
              <div className="border-t border-gray-700/60 pt-3 mt-2 flex justify-between items-center text-xs text-gray-400">
                <span className="text-purple-300 font-medium"><i className="bi bi-journal-text"></i> Ler Review</span>
                <span>⭐ {game.rating}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}