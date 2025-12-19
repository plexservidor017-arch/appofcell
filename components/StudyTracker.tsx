import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Pause, Square, Clock, Save, History, Trash2 } from 'lucide-react';
import { StudyLog } from '../types';

const STORAGE_KEY = 'fitdroid_study';

const StudyTracker: React.FC = () => {
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [subject, setSubject] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load study logs");
      }
    }
  }, []);

  const saveLogs = (newLogs: StudyLog[]) => {
    setLogs(newLogs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const saveSession = () => {
    if (!subject.trim()) {
        alert("Por favor, digite o nome da matéria");
        return;
    }
    if (seconds < 60) {
        alert("Sessão muito curta para salvar (mín 1 min)");
        return;
    }

    const newLog: StudyLog = {
      id: crypto.randomUUID(),
      subject,
      durationSeconds: seconds,
      date: new Date().toLocaleDateString('pt-BR')
    };
    
    saveLogs([newLog, ...logs]);
    resetTimer();
    setSubject('');
  };

  const deleteLog = (id: string) => {
    if(confirm('Excluir esta sessão?')) {
        saveLogs(logs.filter(l => l.id !== id));
    }
  }

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 p-6 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-100 mb-1">Foco nos Estudos</h2>
        <p className="text-slate-500">Monitore suas sessões de aprendizado</p>
      </div>

      {/* Timer Section */}
      <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl flex flex-col items-center mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
        
        <input 
            type="text" 
            placeholder="O que você está estudando?" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isActive || seconds > 0}
            className="bg-transparent text-center text-lg text-slate-200 placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-emerald-500 transition-colors mb-6 w-full"
        />

        <div className="text-7xl font-mono font-bold text-slate-100 mb-8 tracking-tighter">
            {formatTime(seconds)}
        </div>

        <div className="flex items-center gap-4">
            <button 
                onClick={toggleTimer}
                className={`h-16 w-16 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-amber-500 text-amber-950 hover:bg-amber-400' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
            >
                {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1"/>}
            </button>
            {(seconds > 0 || isActive) && (
                <>
                    <button 
                        onClick={resetTimer}
                        className="h-12 w-12 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 flex items-center justify-center"
                    >
                        <Square size={20} fill="currentColor" />
                    </button>
                    {!isActive && (
                        <button 
                            onClick={saveSession}
                            className="h-12 w-12 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 flex items-center justify-center"
                        >
                            <Save size={20} />
                        </button>
                    )}
                </>
            )}
        </div>
      </div>

      {/* History */}
      <div>
        <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <History size={20} /> Sessões Recentes
        </h3>
        
        <div className="space-y-3">
            {logs.length === 0 ? (
                <div className="text-center py-8 text-slate-600 italic">Nenhuma sessão registrada</div>
            ) : (
                logs.map(log => (
                    <div key={log.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center group">
                        <div>
                            <div className="font-bold text-slate-200">{log.subject}</div>
                            <div className="text-xs text-slate-500">{log.date}</div>
                        </div>
                        <div className="flex items-center gap-4">
                             <span className="font-mono text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded text-sm">
                                {formatTime(log.durationSeconds)}
                             </span>
                             <button onClick={() => deleteLog(log.id)} className="text-slate-600 hover:text-rose-500">
                                <Trash2 size={16} />
                             </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default StudyTracker;