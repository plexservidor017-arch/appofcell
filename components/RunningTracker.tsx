import React, { useState, useEffect } from 'react';
import { MapPin, History, Ruler, Plus, Save, Trash2, Map, Bike, Footprints } from 'lucide-react';
import { RunLog, ActivityMode } from '../types';

const STORAGE_KEY = 'fitdroid_runs';

const RunningTracker: React.FC = () => {
  const [logs, setLogs] = useState<RunLog[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [distance, setDistance] = useState('');
  const [mode, setMode] = useState<ActivityMode>('run');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load logs");
      }
    }
  }, []);

  const handleSave = (newLogs: RunLog[]) => {
    setLogs(newLogs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !distance) return;

    const newLog: RunLog = {
      id: crypto.randomUUID(),
      name,
      startLocation: startLocation || 'Início Desconhecido',
      endLocation: endLocation || 'Fim Desconhecido',
      distanceKm: parseFloat(distance),
      date: new Date().toLocaleDateString('pt-BR'),
      mode: mode
    };

    handleSave([newLog, ...logs]);
    
    // Reset Form
    setName('');
    setStartLocation('');
    setEndLocation('');
    setDistance('');
    setMode('run');
    setShowForm(false);
  };

  const deleteLog = (id: string) => {
    if (confirm('Excluir este registro?')) {
      handleSave(logs.filter(l => l.id !== id));
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 relative animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 shadow-sm z-10 sticky top-0 border-b border-slate-800">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-100">Registro de Atividades</h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 text-indigo-400 font-medium active:opacity-70 hover:text-indigo-300"
          >
            {showForm ? 'Cancelar' : (
              <>
                <Plus size={20} /> Nova Atividade
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 no-scrollbar">
        
        {/* Entry Form */}
        {showForm && (
          <div className="bg-slate-900 rounded-2xl shadow-lg p-5 mb-6 animate-in slide-in-from-top-5 duration-300 border border-slate-800">
            <h3 className="text-lg font-semibold mb-4 text-slate-200">Registrar Atividade</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Mode Selection */}
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMode('run')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'run' ? 'bg-slate-700 text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Footprints size={18} /> A pé
                </button>
                <button
                  type="button"
                  onClick={() => setMode('bike')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'bike' ? 'bg-slate-700 text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Bike size={18} /> Bicicleta
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Nome da Atividade</label>
                <input
                  type="text"
                  placeholder="ex: Cardio Matinal"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Ponto de Início</label>
                   <div className="relative">
                      <input
                        type="text"
                        placeholder="Nome do local"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-3 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                      />
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Ponto Final</label>
                   <div className="relative">
                      <input
                        type="text"
                        placeholder="Nome do local"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-3 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={endLocation}
                        onChange={(e) => setEndLocation(e.target.value)}
                      />
                   </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Distância (km)</label>
                <div className="relative">
                   <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    required
                  />
                  <Ruler size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-md active:scale-[0.98] hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} /> Salvar Atividade
              </button>
            </form>
          </div>
        )}

        {/* List of Runs */}
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <History size={48} className="mx-auto mb-3 opacity-20" />
              <p>Nenhuma atividade registrada ainda.</p>
              <p className="text-sm">Comece seu primeiro treino hoje!</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800 flex justify-between items-center group">
                {/* Icon Column */}
                <div className="mr-3 flex-shrink-0">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${log.mode === 'bike' ? 'bg-orange-900/30 text-orange-400' : 'bg-emerald-900/30 text-emerald-400'}`}>
                    {log.mode === 'bike' ? <Bike size={20} /> : <Footprints size={20} />}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-100 truncate">{log.name}</h4>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{log.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                    <span className="flex items-center gap-1 font-mono text-indigo-400 bg-indigo-900/20 px-2 py-0.5 rounded">
                      <Ruler size={12} /> {log.distanceKm}km
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-slate-500 gap-1 truncate">
                     <Map size={12} className="shrink-0" />
                     <span className="truncate max-w-[80px]">{log.startLocation}</span>
                     <span className="shrink-0">→</span>
                     <span className="truncate max-w-[80px]">{log.endLocation}</span>
                  </div>
                </div>

                <button 
                  onClick={() => deleteLog(log.id)}
                  className="p-2 text-slate-600 hover:text-rose-500 transition-colors ml-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RunningTracker;