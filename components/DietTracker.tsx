import React, { useState, useEffect } from 'react';
import { Utensils, GlassWater, Plus, Minus, Check, Coffee, Sun, Moon, Cookie, Lightbulb, Egg, Pill } from 'lucide-react';
import { DietState } from '../types';

const STORAGE_KEY = 'fitdroid_diet';

const DietTracker: React.FC = () => {
  const [state, setState] = useState<DietState>({
    date: new Date().toLocaleDateString(),
    waterCount: 0,
    breakfast: false,
    lunch: false,
    dinner: false,
    snack: false,
    notes: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: DietState = JSON.parse(saved);
      if (parsed.date !== new Date().toLocaleDateString()) {
        const newState = {
          date: new Date().toLocaleDateString(),
          waterCount: 0,
          breakfast: false,
          lunch: false,
          dinner: false,
          snack: false,
          notes: parsed.notes || '', // Preserve notes if desired, or reset. Here we preserve for continuity.
        };
        setState(newState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } else {
        // Clean up old state fields if they exist from previous versions
        const { eggs, supplement, ...cleanState } = parsed as any;
        setState({
            date: cleanState.date || new Date().toLocaleDateString(),
            waterCount: cleanState.waterCount || 0,
            breakfast: cleanState.breakfast || false,
            lunch: cleanState.lunch || false,
            dinner: cleanState.dinner || false,
            snack: cleanState.snack || false,
            notes: cleanState.notes || ''
        });
      }
    }
  }, []);

  const updateState = (newState: DietState) => {
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const adjustWater = (delta: number) => {
    const newCount = Math.max(0, state.waterCount + delta);
    updateState({ ...state, waterCount: newCount });
  };

  const toggleMeal = (meal: keyof Omit<DietState, 'date' | 'waterCount' | 'notes'>) => {
    updateState({ ...state, [meal]: !state[meal] });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateState({ ...state, notes: e.target.value });
  };

  const addNoteTag = (tag: string) => {
    const prefix = state.notes && !state.notes.endsWith('\n') ? '\n' : '';
    const newNote = `${state.notes}${prefix}- ${tag}: `;
    updateState({ ...state, notes: newNote });
  };

  const MealItem = ({ label, field, icon: Icon, color }: { label: string, field: keyof DietState, icon: any, color: string }) => {
    const isCompleted = state[field as keyof DietState] === true;
    return (
      <button
        onClick={() => toggleMeal(field as any)}
        className={`flex-1 p-4 rounded-xl flex flex-col items-center justify-center gap-3 border transition-all ${
          isCompleted 
            ? `bg-${color}-900/20 border-${color}-500/50` 
            : 'bg-slate-900 border-slate-800'
        }`}
      >
        <div className={`p-3 rounded-full ${isCompleted ? `bg-${color}-500 text-white` : 'bg-slate-800 text-slate-500'}`}>
          <Icon size={24} />
        </div>
        <div className="text-center">
          <span className={`block font-medium ${isCompleted ? 'text-slate-100' : 'text-slate-400'}`}>{label}</span>
          {isCompleted && <span className={`text-xs text-${color}-400`}>Feito</span>}
        </div>
      </button>
    );
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 p-6 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-100 mb-1">Alimentação</h2>
        <p className="text-slate-500">Dieta e Hidratação</p>
      </div>

      {/* Water Tracker */}
      <div className="bg-blue-950/30 border border-blue-900/50 rounded-2xl p-6 mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-2 text-blue-200 mb-4">
                <GlassWater size={24} />
                <span className="font-semibold uppercase tracking-wider text-sm">Água</span>
            </div>
            
            <div className="flex items-center gap-8 mb-2">
                <button 
                    onClick={() => adjustWater(-1)}
                    className="h-12 w-12 rounded-full bg-slate-900 text-blue-400 flex items-center justify-center hover:bg-slate-800 active:scale-95 transition"
                >
                    <Minus size={20} />
                </button>
                <div className="text-center">
                    <span className="text-5xl font-bold text-white block">{state.waterCount}</span>
                    <span className="text-xs text-blue-300">copos</span>
                </div>
                <button 
                    onClick={() => adjustWater(1)}
                    className="h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-900/50 hover:bg-blue-400 active:scale-95 transition"
                >
                    <Plus size={20} />
                </button>
            </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none"></div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <MealItem label="Café da Manhã" field="breakfast" icon={Coffee} color="orange" />
        <MealItem label="Almoço" field="lunch" icon={Sun} color="amber" />
        <MealItem label="Jantar" field="dinner" icon={Moon} color="indigo" />
        <MealItem label="Lanche" field="snack" icon={Cookie} color="pink" />
      </div>

      {/* Ideas / Notes Section */}
      <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-slate-300">
              <Lightbulb size={20} className="text-yellow-500" />
              <span className="font-semibold">Notas</span>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex gap-2 mb-3">
          <button 
            onClick={() => addNoteTag('Ovos')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs font-medium text-yellow-200 transition-colors"
          >
            <Egg size={14} /> + Ovos
          </button>
          <button 
            onClick={() => addNoteTag('Suplemento')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs font-medium text-teal-200 transition-colors"
          >
            <Pill size={14} /> + Suplemento
          </button>
        </div>
        
        <textarea 
            value={state.notes}
            onChange={handleNotesChange}
            placeholder="Toque nos botões acima para registrar rapidamente ou digite suas ideias de refeições..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 flex-1 resize-none text-sm leading-relaxed"
        />
      </div>
    </div>
  );
};

export default DietTracker;
