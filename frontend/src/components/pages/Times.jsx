import React from 'react';

export default function Times() {
  return (
    <main className="max-w-7xl mx-auto px-4 mt-6">
      {/* Seção Filtro */}
      <div className="mb-6">
        <button className="bg-gray-800/80 hover:bg-gray-700 border border-gray-700 px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer">
          <i className="bi bi-funnel"></i> Filtrar por Região
        </button>
      </div>

      {/* Grid de Organizações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Time 1 - LOUD */}
        <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5 hover:border-purple-500/50 transition-all group cursor-pointer backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-700/50 rounded-lg flex items-center justify-center p-2 group-hover:scale-105 transition-transform border border-gray-600/30">
                <img src="https://backoffice.vlr.gg/img/vlr/teams/vlr-9615.png" alt="LOUD Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors">LOUD</h3>
                <span className="text-sm text-gray-400">Brasil</span>
              </div>
            </div>
            <span className="text-xs bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full border border-purple-500/20 font-medium">VCT AMERICAS</span>
          </div>
          <div className="border-t border-gray-700/60 pt-4 flex justify-between items-center text-sm text-gray-400">
            <span>Último jogo: <strong className="text-green-400">Vitória</strong></span>
            <span>Ranking Global: #3</span>
          </div>
        </div>

        {/* Time 2 - Sentinels */}
        <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5 hover:border-purple-500/50 transition-all group cursor-pointer backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-700/50 rounded-lg flex items-center justify-center p-2 group-hover:scale-105 transition-transform border border-gray-600/30">
                <img src="https://backoffice.vlr.gg/img/vlr/teams/vlr-2.png" alt="Sentinels Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors">Sentinels</h3>
                <span className="text-sm text-gray-400">América do Norte</span>
              </div>
            </div>
            <span className="text-xs bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full border border-purple-500/20 font-medium">VCT AMERICAS</span>
          </div>
          <div className="border-t border-gray-700/60 pt-4 flex justify-between items-center text-sm text-gray-400">
            <span>Último jogo: <strong className="text-green-400">Vitória</strong></span>
            <span>Ranking Global: #1</span>
          </div>
        </div>

        {/* Time 3 - Fnatic */}
        <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-5 hover:border-purple-500/50 transition-all group cursor-pointer backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-700/50 rounded-lg flex items-center justify-center p-2 group-hover:scale-105 transition-transform border border-gray-600/30">
                <img src="https://backoffice.vlr.gg/img/vlr/teams/vlr-2593.png" alt="Fnatic Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors">Fnatic</h3>
                <span className="text-sm text-gray-400">Europa</span>
              </div>
            </div>
            <span className="text-xs bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full border border-purple-500/20 font-medium">VCT EMEA</span>
          </div>
          <div className="border-t border-gray-700/60 pt-4 flex justify-between items-center text-sm text-gray-400">
            <span>Último jogo: <strong className="text-red-400">Derrota</strong></span>
            <span>Ranking Global: #2</span>
          </div>
        </div>
      </div>
    </main>
  );
}