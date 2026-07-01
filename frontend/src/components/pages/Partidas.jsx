import React from 'react';

export default function Partidas() {
  return (
    <main className="max-w-7xl mx-auto px-4 mt-6">
      {/* Abas/Filtros */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-lg shadow-purple-600/10">Todos</button>
        <button className="bg-gray-800/80 hover:bg-gray-700 border border-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Ao Vivo
        </button>
        <button className="bg-gray-800/80 hover:bg-gray-700 border border-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">Próximos</button>
        <button className="bg-gray-800/80 hover:bg-gray-700 border border-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">Resultados</button>
      </div>

      <div className="space-y-4 mb-8">
        {/* Card: Partida Ao Vivo */}
        <div className="bg-gradient-to-r from-red-950/20 via-gray-800/40 to-gray-800/40 border border-red-500/30 hover:border-red-500/50 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 transition-all relative overflow-hidden backdrop-blur-sm group cursor-pointer">
          <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-br-lg flex items-center gap-1.5 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> AO VIVO
          </div>

          <div className="flex items-center gap-8 w-full md:w-auto justify-center md:justify-start mt-2 md:mt-0">
            <div className="flex items-center gap-3 w-32 justify-end">
              <span className="font-bold text-right group-hover:text-purple-400 transition-colors">LOUD</span>
              <img src="https://backoffice.vlr.gg/img/vlr/teams/vlr-9615.png" alt="LOUD" className="w-8 h-8 object-contain" />
            </div>

            <div className="bg-gray-900/80 px-4 py-1.5 rounded-lg border border-gray-700 font-mono text-lg font-bold flex items-center gap-3">
              <span className="text-red-400">1</span>
              <span className="text-gray-500 text-sm font-sans font-normal">vs</span>
              <span className="text-gray-400">0</span>
            </div>

            <div className="flex items-center gap-3 w-32 justify-start">
              <img src="https://backoffice.vlr.gg/img/vlr/teams/vlr-2.png" alt="Sentinels" className="w-8 h-8 object-contain" />
              <span className="font-bold group-hover:text-purple-400 transition-colors">SEN</span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end text-sm text-gray-400">
            <span className="font-medium text-gray-300">Mapa 2: Ascent</span>
            <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <i className="bi bi-trophy"></i> VCT Americas Stage 1
            </span>
          </div>
        </div>

        {/* Card: Partida Agendada / Próxima */}
        <div className="bg-gray-800/40 border border-gray-700 hover:border-purple-500/40 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 transition-all backdrop-blur-sm group cursor-pointer">
          <div className="flex items-center gap-8 w-full md:w-auto justify-center md:justify-start">
            <div className="flex items-center gap-3 w-32 justify-end">
              <span className="font-bold text-right group-hover:text-purple-400 transition-colors">Fnatic</span>
              <img src="https://backoffice.vlr.gg/img/vlr/teams/vlr-2593.png" alt="Fnatic" className="w-8 h-8 object-contain" />
            </div>

            <div className="bg-gray-900/60 px-4 py-1.5 rounded-lg border border-gray-800 font-sans text-xs text-purple-400 font-semibold tracking-wider bg-purple-500/5">
              14:30
            </div>

            <div className="flex items-center gap-3 w-32 justify-start">
              <img src="https://backoffice.vlr.gg/img/vlr/teams/vlr-2304.png" alt="Team Heretics" className="w-8 h-8 object-contain" />
              <span className="font-bold group-hover:text-purple-400 transition-colors">TH</span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end text-sm text-gray-400">
            <span className="font-medium text-gray-400 flex items-center gap-1">
              <i className="bi bi-clock"></i> Hoje
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <i className="bi bi-trophy"></i> VCT EMEA Stage 1
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}