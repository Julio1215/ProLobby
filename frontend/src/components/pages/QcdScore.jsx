import React, { useState, useEffect } from 'react';

const API_KEY = "cefc0006209c484687decc03b3015a2c";

const termosBloqueados = [
  "sex", "sexual", "hentai", "porn", "porno", "adult", 
  "erotic", "nsfw", "18+", "ecchi", "dating sim", "succubus"
];

function jogoPermitido(game) {
  const nome = (game.name || "").toLowerCase();
  const tags = game.tags ? game.tags.map(t => t.name.toLowerCase()).join(" ") : "";
  const texto = `${nome} ${tags}`;
  return !termosBloqueados.some(t => texto.includes(t));
}

function estimarHoras(game) {
  const generos = game.genres ? game.genres.map(g => g.name) : [];
  let horas = 15;
  if (generos.includes("RPG")) horas += 40;
  if (generos.includes("Adventure")) horas += 15;
  if (generos.includes("Action")) horas += 10;
  if (generos.includes("Shooter")) horas += 5;
  if (generos.includes("Strategy")) horas += 25;
  return horas;
}

export default function QcdScore() {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busca, setBusca] = useState("");
  const [jogoSelecionado, setJogoSelecionado] = useState(null);

  const [precoInput, setPrecoInput] = useState("");
  const [custoHora, setCustoHora] = useState(null);
  const [veredito, setVeredito] = useState("");

  useEffect(() => {
    if (!jogoSelecionado) carregarJogos();
  }, [jogoSelecionado]);

  async function carregarJogos() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://api.rawg.io/api/games?key=${API_KEY}&page_size=40&metacritic=70,100`);
      const data = await response.json();
      setJogos((data.results || []).filter(jogoPermitido).slice(0, 24));
    } catch (err) {
      setError("Erro ao carregar jogos.");
    } finally {
      setLoading(false);
    }
  }

  async function pesquisar(nome) {
    if (nome.trim().length < 2) { return carregarJogos(); }
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

  const abrirDetalhe = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
      const gameData = await response.json();
      setJogoSelecionado(gameData);
      setPrecoInput(""); setCustoHora(null); setVeredito("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calcularCustoBeneficio = () => {
    const preco = parseFloat(precoInput);
    if (!preco || isNaN(preco)) return alert("Digite um preço válido.");
    const horas = estimarHoras(jogoSelecionado);
    const custo = preco / horas;
    setCustoHora(custo);

    if (custo <= 5) setVeredito("🔥 Excelente custo-benefício");
    else if (custo <= 10) setVeredito("✅ Bom custo-benefício");
    else if (custo <= 15) setVeredito("⚠️ Custo-benefício razoável");
    else setVeredito("❌ Pouco vantajoso");
  };

  if (jogoSelecionado) {
    const horasEstimadas = estimarHoras(jogoSelecionado);
    return (
      <main className="max-w-7xl mx-auto px-4 mt-6">
        <div className="mb-6">
          <button onClick={() => setJogoSelecionado(null)} className="bg-gray-800/80 hover:bg-gray-700 border border-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer">
            <i className="bi bi-arrow-left"></i> Voltar para Lista
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm">
              <h2 className="text-3xl font-bold text-purple-400 mb-4">{jogoSelecionado.name}</h2>
              <div className="aspect-video overflow-hidden rounded-xl border border-gray-700 mb-6">
                <img src={jogoSelecionado.background_image} alt={jogoSelecionado.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-xl text-purple-300 mb-2">Sobre o jogo</h3>
              <p className="text-gray-300 leading-relaxed text-sm">{jogoSelecionado.description_raw || "Descrição indisponível."}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-5 backdrop-blur-sm space-y-3 text-sm">
              <h3 className="font-bold text-purple-300 text-base border-b border-gray-700 pb-2">Especificações</h3>
              <p><span className="text-gray-400">📅 Lançamento:</span> {jogoSelecionado.released}</p>
              <p><span className="text-gray-400">🖥️ Plataformas:</span> {jogoSelecionado.platforms?.map(p => p.platform.name).join(", ")}</p>
              <p><span className="text-gray-400">🏷️ Gêneros:</span> {jogoSelecionado.genres?.map(g => g.name).join(", ")}</p>
              <p><span className="text-gray-400">🏢 Estúdio:</span> {jogoSelecionado.developers?.map(d => d.name).join(", ") || "N/A"}</p>
            </div>

            <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-5 backdrop-blur-sm">
              <h3 className="font-bold text-purple-300 text-base mb-3">Calculadora QCP</h3>
              <p className="text-sm text-gray-400 mb-4">⏳ Duração estimada: <strong className="text-white">{horasEstimadas}h</strong></p>
              <input type="number" placeholder="Preço do Jogo (R$)" value={precoInput} onChange={(e) => setPrecoInput(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 text-white" />
              <button onClick={calcularCustoBeneficio} className="w-full bg-purple-400 hover:bg-purple-500 text-white font-medium py-2 rounded-lg text-sm transition-colors cursor-pointer">Calcular Viabilidade</button>
              
              {custoHora !== null && (
                <div className="mt-4 pt-4 border-t border-gray-700 text-center space-y-1">
                  <p className="text-xs text-gray-400">Custo médio por hora ativa:</p>
                  <p className="text-xl font-bold text-purple-400">R$ {custoHora.toFixed(2)}</p>
                  <p className="text-sm font-semibold mt-2">{veredito}</p>
                </div>
              )}
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
          <h2 className="text-2xl font-bold tracking-wide">Calculadora QCP</h2>
          <p className="text-sm text-gray-400">Descubra quanto compensa pagar baseado no tempo de jogo</p>
        </div>
        <input type="search" placeholder="Buscar jogo específico..." value={busca} onChange={(e) => { setBusca(e.target.value); pesquisar(e.target.value); }} className="px-4 py-2 w-full md:w-80 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400"><i className="bi bi-arrow-clockwise animate-spin text-xl"></i> Carregando catálogo...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {jogos.map((game) => (
            <div key={game.id} onClick={() => abrirDetalhe(game.id)} className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 hover:border-purple-500/50 transition-all group cursor-pointer backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="aspect-[4/5] overflow-hidden rounded-lg mb-4 bg-gray-700">
                  <img src={game.background_image || ""} alt={game.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="font-bold text-base group-hover:text-purple-400 transition-colors line-clamp-1 mb-2">{game.name}</h3>
              </div>
              <div className="border-t border-gray-700/60 pt-3 mt-2 flex justify-between items-center text-xs text-gray-400">
                <span>⭐ {game.rating}</span>
                <span>Metacritic: <strong className={game.metacritic >= 75 ? "text-green-400" : "text-amber-400"}>{game.metacritic || "N/A"}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}