import React, { useState, useEffect } from 'react';
import { Sparkles, Check, Droplets, Smile, Moon, Sun, CloudSun } from 'lucide-react';
import { HygieneState } from '../types';

const STORAGE_KEY = 'fitdroid_hygiene';

const HygieneTracker: React.FC = () => {
  const [state, setState] = useState<HygieneState>({
    date: new Date().toLocaleDateString(),
    teethMorning: false,
    teethAfternoon: false,
    teethNight: false,
    shower: false,
    grooming: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset if it's a new day
      if (parsed.date !== new Date().toLocaleDateString()) {
        const newState = {
          date: new Date().toLocaleDateString(),
          teethMorning: false,
          teethAfternoon: false,
          teethNight: false,
          shower: false,
          grooming: false,
        };
        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } else {
        // Migration: handle missing teethAfternoon or removal of skincare
        setState({
            date: parsed.date,
            teethMorning: parsed.teethMorning || false,
            teethAfternoon: parsed.teethAfternoon || false,
            teethNight: parsed.teethNight || false,
            shower: parsed.shower || false,
            grooming: parsed.grooming || false,
        });
      }
    }
  }, []);

  const toggleItem = (key: keyof HygieneState) => {
    const newState = { ...state, [key]: !state[key as keyof HygieneState] };
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const calculateProgress = () => {
      const totalTasks = 5; // teethMorning, teethAfternoon, teethNight, shower, grooming
      let completed = 0;
      if (state.teethMorning) completed++;
      if (state.teethAfternoon) completed++;
      if (state.teethNight) completed++;
      if (state.shower) completed++;
      if (state.grooming) completed++;
      return { completed, total: totalTasks };
  };

  const { completed, total } = calculateProgress();

  const Item = ({ 
    label, 
    field, 
    icon: Icon 
  }: { 
    label: string, 
    field: keyof HygieneState, 
    icon: any 
  }) => (
    <button
      onClick={() => toggleItem(field)}
      className={`w-full p-4 rounded-xl flex items-center justify-between transition-all duration-200 border ${
        state[field] 
          ? 'bg-indigo-900/30 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
          : 'bg-slate-900 border-slate-800'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${state[field] ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
          <Icon size={24} />
        </div>
        <span className={`text-lg font-medium ${state[field] ? 'text-indigo-100' : 'text-slate-400'}`}>
          {label}
        </span>
      </div>
      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
        state[field] ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'
      }`}>
        {state[field] && <Check size={14} className="text-white" strokeWidth={3} />}
      </div>
    </button>
  );

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 p-6 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-1">Higiene</h2>
        <p className="text-slate-500">Lista diária de autocuidado</p>
      </div>

      <div className="space-y-4">
        {/* Teeth Brushing Section - Combined 3 Squares */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-2 rounded-lg bg-slate-800 text-slate-500">
                    <Smile size={24} />
                </div>
                <span className="text-lg font-medium text-slate-300">Escovar Dentes</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                <button 
                    onClick={() => toggleItem('teethMorning')}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all active:scale-95 ${state.teethMorning ? 'bg-indigo-900/30 border-indigo-500/50 text-indigo-200' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                >
                    <Sun size={20} className="mb-1" />
                    <span className="text-xs font-semibold mb-2">Manhã</span>
                    <div className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${state.teethMorning ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
                         {state.teethMorning && <Check size={14} className="text-white" />}
                    </div>
                </button>

                <button 
                    onClick={() => toggleItem('teethAfternoon')}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all active:scale-95 ${state.teethAfternoon ? 'bg-indigo-900/30 border-indigo-500/50 text-indigo-200' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                >
                    <CloudSun size={20} className="mb-1" />
                    <span className="text-xs font-semibold mb-2">Tarde</span>
                    <div className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${state.teethAfternoon ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
                        {state.teethAfternoon && <Check size={14} className="text-white" />}
                    </div>
                </button>

                <button 
                    onClick={() => toggleItem('teethNight')}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all active:scale-95 ${state.teethNight ? 'bg-indigo-900/30 border-indigo-500/50 text-indigo-200' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                >
                    <Moon size={20} className="mb-1" />
                    <span className="text-xs font-semibold mb-2">Noite</span>
                    <div className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${state.teethNight ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600'}`}>
                        {state.teethNight && <Check size={14} className="text-white" />}
                    </div>
                </button>
            </div>
        </div>

        <Item label="Banho" field="shower" icon={Droplets} />
        <Item label="Cuidados Pessoais" field="grooming" icon={Sparkles} />
      </div>

      {/* Progress Bar */}
      <div className="mt-8 bg-slate-900 rounded-2xl p-6 border border-slate-800">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>Progresso Diário</span>
          <span>
            {completed} / {total}
          </span>
        </div>
        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default HygieneTracker;