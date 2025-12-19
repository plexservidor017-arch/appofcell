import React, { useState } from 'react';
import { Dumbbell, Sparkles, Utensils, BookOpen, User } from 'lucide-react';
import BoxingTimer from './components/BoxingTimer';
import RunningTracker from './components/RunningTracker';
import HygieneTracker from './components/HygieneTracker';
import DietTracker from './components/DietTracker';
import StudyTracker from './components/StudyTracker';
import { MainTab, TrainingTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('treino');
  const [trainingTab, setTrainingTab] = useState<TrainingTab>('boxe');

  const renderContent = () => {
    switch (activeTab) {
      case 'treino':
        return (
          <div className="h-full flex flex-col">
            {/* Training Sub-Navigation */}
            <div className="bg-slate-900 px-4 pt-4 pb-2 border-b border-slate-800 flex gap-2">
              <button
                onClick={() => setTrainingTab('boxe')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  trainingTab === 'boxe' 
                    ? 'bg-slate-800 text-indigo-400 border border-slate-700' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Boxe
              </button>
              <button
                onClick={() => setTrainingTab('corrida')}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  trainingTab === 'corrida' 
                    ? 'bg-slate-800 text-indigo-400 border border-slate-700' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Corrida
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {trainingTab === 'boxe' ? <BoxingTimer /> : <RunningTracker />}
            </div>
          </div>
        );
      case 'higiene':
        return <HygieneTracker />;
      case 'alimentacao':
        return <DietTracker />;
      case 'estudo':
        return <StudyTracker />;
      default:
        return <BoxingTimer />;
    }
  };

  const NavButton = ({ 
    tab, 
    label, 
    icon: Icon 
  }: { 
    tab: MainTab, 
    label: string, 
    icon: any 
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center gap-1 transition-all duration-300 flex-1 ${
        activeTab === tab ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-400'
      }`}
    >
      <div className={`p-2 rounded-full transition-all duration-300 ${
        activeTab === tab ? 'bg-slate-800 -translate-y-2 shadow-lg shadow-indigo-500/10' : 'bg-transparent'
      }`}>
        <Icon size={24} strokeWidth={activeTab === tab ? 2.5 : 2} />
      </div>
      <span className={`text-[10px] font-medium transition-all duration-300 ${
        activeTab === tab ? 'opacity-100 -translate-y-1' : 'opacity-70'
      }`}>
        {label}
      </span>
    </button>
  );

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-950 shadow-2xl overflow-hidden relative border-x border-slate-800">
      
      {/* Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-slate-900 border-t border-slate-800 px-2 py-2 pb-6 z-20">
        <div className="flex justify-between items-end">
          <NavButton tab="treino" label="Treino" icon={Dumbbell} />
          <NavButton tab="higiene" label="Higiene" icon={Sparkles} />
          <NavButton tab="alimentacao" label="Alim." icon={Utensils} />
          <NavButton tab="estudo" label="Estudo" icon={BookOpen} />
        </div>
      </nav>
      
      {/* Overlay to ensure mobile constraints on desktop view */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[#0f172a] hidden md:block"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-full border-x border-slate-800 pointer-events-none hidden md:block shadow-2xl"></div>
    </div>
  );
};

export default App;