import React, { useState } from 'react';

export default function HomeNoticias() {
  const [activeTab, setActiveTab] = useState('noticias');

  return (
    <main className="max-w-7xl mx-auto px-4 mt-6">
      {/* Sub-Header interno para transição entre as áreas de E-Sports */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-white uppercase flex items-center gap-2">
            <span className="w-2 h-6 bg-purple-500 rounded-sm"></span> Arena E-Sports
          </h1>
          <p className="text-xs text-gray-400 mt-1">Acompanhe campeonatos, estatísticas e o mercado competitivo mundiais</p>
        </div>

        {/* Abas Estilizadas Pro Lobby */}
        <div className="flex gap-2 bg-gray-900/60 p-1.5 rounded-xl border border-gray-800 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('noticias')}
            className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'noticias' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-400 hover:text-white'}`}
          >
            <i className="bi bi-newspaper mr-1.5"></i> Notícias
          </button>
          <button 
            onClick={() => setActiveTab('partidas')}
            className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center ${activeTab === 'partidas' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-400 hover:text-white'}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse mr-1.5"></span> Partidas
          </button>
          <button 
            onClick={() => setActiveTab('times')}
            className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'times' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-400 hover:text-white'}`}
          >
            <i className="bi bi-shield-shaded mr-1.5"></i> Organizações
          </button>
        </div>
      </div>

      {/* Conteúdo Dinâmico com base na aba ativa */}
      {activeTab === 'noticias' && (
        <div className="space-y-8 animate-fade-in">
          {/* Banner Principal */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/7] md:aspect-[21/7] group cursor-pointer border border-gray-800 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200" 
              alt="VCT Champions" 
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 md:p-10">
              <span className="bg-purple-600 text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full w-max mb-3 uppercase">
                Campeonato Mundial
              </span>
              <h2 className="text-xl md:text-3xl font-black tracking-tight max-w-3xl leading-tight group-hover:text-purple-400 transition-colors">
                VCT Champions: LOUD enfrenta Sentinels na grande estreia do grupo das Américas
              </h2>
              <p className="text-gray-300 text-xs md:text-sm mt-2 max-w-2xl hidden md:block">
                O confronto mais aguardado do ano acontece nesta sexta-feira. Analisamos as táticas, composições e o histórico recente de ambas as equipes para este super confronto.
              </p>
              <div className="flex items-center gap-4 mt-4 text-[11px] text-gray-400 font-medium">
                <span><i className="bi bi-clock"></i> Há 15 minutos</span>
                <span>•</span>
                <span>Por Pedro Henrique</span>
              </div>
            </div>
          </div>

          {/* Grid de Cards Secundários */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/20 border border-gray-700/40 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all group cursor-pointer flex flex-col backdrop-blur-sm">
              <div className="aspect-video overflow-hidden">
                <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600" alt="Patch Notes" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-purple-400 text-[10px] font-bold tracking-wider uppercase">Atualização</span>
                  <h3 className="font-bold text-sm mt-1 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    Patch Notes: Duelistas recebem balanceamento massivo no próximo ato
                  </h3>
                </div>
                <div className="text-[11px] text-gray-400 mt-4 flex justify-between items-center">
                  <span>Há 2 horas</span>
                  <span className="text-purple-400 font-semibold">Ler mais →</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/20 border border-gray-700/40 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all group cursor-pointer flex flex-col backdrop-blur-sm">
              <div className="aspect-video overflow-hidden">
                <img src="https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=600" alt="Mercado da Bala" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-purple-400 text-[10px] font-bold tracking-wider uppercase">Mercado da Bala</span>
                  <h3 className="font-bold text-sm mt-1 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    Mudança na line-up: FURIA anuncia nova contratação para a temporada
                  </h3>
                </div>
                <div className="text-[11px] text-gray-400 mt-4 flex justify-between items-center">
                  <span>Há 5 horas</span>
                  <span className="text-purple-400 font-semibold">Ler mais →</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/20 border border-gray-700/40 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all group cursor-pointer flex flex-col backdrop-blur-sm">
              <div className="aspect-video overflow-hidden">
                <img src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=600" alt="Comunidade" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-purple-400 text-[10px] font-bold tracking-wider uppercase">Comunidade</span>
                  <h3 className="font-bold text-sm mt-1 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    Próxima coleção de skins inspirada no folclore oriental é vazada
                  </h3>
                </div>
                <div className="text-[11px] text-gray-400 mt-4 flex justify-between items-center">
                  <span>Há 1 dia</span>
                  <span className="text-purple-400 font-semibold">Ler mais →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'partidas' && (
        <div className="space-y-4 mb-8 animate-fade-in">
          {/* Card: Partida Ao Vivo */}
          <div className="bg-gradient-to-r from-red-950/10 via-gray-800/30 to-gray-800/20 border border-red-500/30 hover:border-red-500/50 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 transition-all relative overflow-hidden backdrop-blur-sm group cursor-pointer">
            <div className="absolute top-0 left-0 bg-red-600 text-white text-[9px] font-black tracking-widest px-2.5 py-1 rounded-br-lg flex items-center gap-1 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> AO VIVO
            </div>

            <div className="flex items-center gap-8 w-full md:w-auto justify-center md:justify-start mt-2 md:mt-0">
              <div className="flex items-center gap-3 w-32 justify-end">
                <span className="font-bold text-sm text-right group-hover:text-purple-400 transition-colors">LOUD</span>
                <img src="https://backoffice.vlr.gg/img/vlr/teams/vlr-9615.png" alt="LOUD" className="w-7 h-7 object-contain" />
              </div>
              <div className="bg-gray-950/80 px-3 py-1 rounded-lg border border-gray-800 font-mono text-base font-bold flex items-center gap-2">
                <span className="text-red-400">1</span>
                <span className="text-gray-600 text-xs font-sans font-normal">vs</span>
                <span className="text-gray-400">0</span>
              </div>
              <div className="flex items-center gap-3 w-32 justify-start">
                <img src="https://backoffice.vlr.gg/img/vlr/teams/vlr-2.png" alt="Sentinels" className="w-7 h-7 object-contain" />
                <span className="font-bold text-sm group-hover:text-purple-400 transition-colors">SEN</span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end text-xs text-gray-400">
              <span className="font-medium text-gray-300">Mapa 2: Ascent</span>
              <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                <i className="bi bi-trophy"></i> VCT Americas Stage 1
              </span>
            </div>
          </div>

          {/* Card: Partida Agendada */}
          <div className="bg-gray-800/20 border border-gray-700/40 hover:border-purple-500/40 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 transition-all backdrop-blur-sm group cursor-pointer">
            <div className="flex items-center gap-8 w-full md:w-auto justify-center md:justify-start">
              <div className="flex items-center gap-3 w-32 justify-end">
                <span className="font-bold text-sm text-right group-hover:text-purple-400 transition-colors">Fnatic</span>
                <img src="https://backoffice.vlr.gg/img/vlr/teams/vlr-2593.png" alt="Fnatic" className="w-7 h-7 object-contain" />
              </div>
              <div className="bg-gray-950/40 px-4 py-1.5 rounded-lg border border-gray-900 font-sans text-xs text-purple-400 font-semibold tracking-wider">
                14:30
              </div>
              <div className="flex items-center gap-3 w-32 justify-start">
                <img src="https://backoffice.vlr.gg/img/vlr/teams/vlr-2304.png" alt="Team Heretics" className="w-7 h-7 object-contain" />
                <span className="font-bold text-sm group-hover:text-purple-400 transition-colors">TH</span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end text-xs text-gray-400">
              <span className="font-medium text-gray-400 flex items-center gap-1"><i className="bi bi-clock"></i> Hoje</span>
              <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-1">
                <i className="bi bi-trophy"></i> VCT EMEA Stage 1
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'times' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
          {/* Organização 1 */}
          <div className="bg-gray-800/20 border border-gray-700/40 rounded-xl p-5 hover:border-purple-500/50 transition-all group cursor-pointer backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900/50 rounded-lg flex items-center justify-center p-2 border border-gray-800">
                  <img src="https://backoffice.vlr.gg/img/vlr/teams/vlr-9615.png" alt="LOUD" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-base group-hover:text-purple-400 transition-colors">LOUD</h3>
                  <span className="text-xs text-gray-400">Brasil</span>
                </div>
              </div>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/20 font-bold">AMERICAS</span>
            </div>
            <div className="border-t border-gray-800 pt-4 flex justify-between items-center text-xs text-gray-400">
              <span>Último jogo: <strong className="text-green-400 font-medium">Vitória</strong></span>
              <span>Global: #3</span>
            </div>
          </div>

          {/* Organização 2 */}
          <div className="bg-gray-800/20 border border-gray-700/40 rounded-xl p-5 hover:border-purple-500/50 transition-all group cursor-pointer backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900/50 rounded-lg flex items-center justify-center p-2 border border-gray-800">
                  <img src="https://backoffice.vlr.gg/img/vlr/teams/vlr-2.png" alt="Sentinels" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-base group-hover:text-purple-400 transition-colors">Sentinels</h3>
                  <span className="text-xs text-gray-400">América do Norte</span>
                </div>
              </div>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/20 font-bold">AMERICAS</span>
            </div>
            <div className="border-t border-gray-800 pt-4 flex justify-between items-center text-xs text-gray-400">
              <span>Último jogo: <strong className="text-green-400 font-medium">Vitória</strong></span>
              <span>Global: #1</span>
            </div>
          </div>

          {/* Organização 3 */}
          <div className="bg-gray-800/20 border border-gray-700/40 rounded-xl p-5 hover:border-purple-500/50 transition-all group cursor-pointer backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900/50 rounded-lg flex items-center justify-center p-2 border border-gray-800">
                  <img src="https://backoffice.vlr.gg/img/vlr/teams/vlr-2593.png" alt="Fnatic" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-base group-hover:text-purple-400 transition-colors">Fnatic</h3>
                  <span className="text-xs text-gray-400">Europa</span>
                </div>
              </div>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/20 font-bold">EMEA</span>
            </div>
            <div className="border-t border-gray-800 pt-4 flex justify-between items-center text-xs text-gray-400">
              <span>Último jogo: <strong className="text-red-400 font-medium">Derrota</strong></span>
              <span>Global: #2</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}