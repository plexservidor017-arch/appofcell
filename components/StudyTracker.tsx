import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Play, Pause, Square, History, Trash2, Settings2, Timer, Trophy, X } from 'lucide-react';
import { StudyLog } from '../types';

const STORAGE_KEY = 'fitdroid_study';

const StudyTracker: React.FC = () => {
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [isActive, setIsActive] = useState(false);
  
  // Pomodoro Settings
  const [studyMinutes, setStudyMinutes] = useState(25);
  const [restMinutes, setRestMinutes] = useState(5);
  const [seconds, setSeconds] = useState(25 * 60);
  const [pomodoroPhase, setPomodoroPhase] = useState<'study' | 'rest'>('study');
  const [subject, setSubject] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  // Accumulated time for 1h milestone
  const [accumulatedStudyToday, setAccumulatedStudyToday] = useState(0);
  const [showMilestone, setShowMilestone] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLogs(parsed);
        const today = new Date().toLocaleDateString('pt-BR');
        const todaySeconds = parsed
          .filter((l: any) => l.date === today)
          .reduce((acc: number, curr: any) => acc + curr.durationSeconds, 0);
        setAccumulatedStudyToday(todaySeconds);
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
        if (seconds > 0) {
          setSeconds(s => s - 1);
        } else {
          handlePhaseComplete();
        }
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, seconds, pomodoroPhase]);

  const handlePhaseComplete = () => {
    setIsActive(false);
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2048/2048-preview.mp3');
    audio.play();

    if (pomodoroPhase === 'study') {
      const duration = studyMinutes * 60;
      saveSession(duration);
      alert('Bloco de estudo concluído! Hora do descanso.');
      setPomodoroPhase('rest');
      setSeconds(restMinutes * 60);
    } else {
      alert('Descanso concluído! Pronto para focar?');
      setPomodoroPhase('study');
      setSeconds(studyMinutes * 60);
    }
  };

  const toggleTimer = () => {
    if (seconds === 0 && !isActive) {
       setSeconds(pomodoroPhase === 'study' ? studyMinutes * 60 : restMinutes * 60);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(pomodoroPhase === 'study' ? studyMinutes * 60 : restMinutes * 60);
  };

  const saveSession = (duration: number) => {
    const currentSubject = subject.trim() || 'Estudo Geral';

    const newLog: StudyLog = {
      id: crypto.randomUUID(),
      subject: currentSubject,
      durationSeconds: duration,
      date: new Date().toLocaleDateString('pt-BR')
    };
    
    const updatedLogs = [newLog, ...logs];
    saveLogs(updatedLogs);
    
    const newTotal = accumulatedStudyToday + duration;
    setAccumulatedStudyToday(newTotal);
    
    if (Math.floor(newTotal / 3600) > Math.floor(accumulatedStudyToday / 3600)) {
        setShowMilestone(true);
    }
  };

  const deleteLog = (id: string) => {
    if(confirm('Excluir esta sessão?')) {
        const filtered = logs.filter(l => l.id !== id);
        saveLogs(filtered);
        const today = new Date().toLocaleDateString('pt-BR');
        const todaySeconds = filtered
          .filter((l: any) => l.date === today)
          .reduce((acc: number, curr: any) => acc + curr.durationSeconds, 0);
        setAccumulatedStudyToday(todaySeconds);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progress Ring Logic
  const totalPhaseSeconds = useMemo(() => {
    return pomodoroPhase === 'study' ? studyMinutes * 60 : restMinutes * 60;
  }, [pomodoroPhase, studyMinutes, restMinutes]);

  const size = 280;
  const radius = 120;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalPhaseSeconds > 0 ? (seconds / totalPhaseSeconds) : 0;
  const offset = circumference - (progress * circumference);

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 p-6 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 mb-1">Estudo</h2>
          <p className="text-slate-500">Gestão de Tempo</p>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Acumulado</span>
            <span className="text-lg font-mono font-bold text-emerald-400">{formatTime(accumulatedStudyToday)}</span>
        </div>
      </div>

      {/* Circular Timer View */}
      <div className="flex-1 flex flex-col items-center justify-center mb-6">
        
        {/* The Circle Container */}
        <div className="relative flex items-center justify-center w-80 h-80">
            {/* Milestone Overlay */}
            {showMilestone && (
                <div className="absolute inset-0 bg-indigo-600/95 z-30 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300 rounded-full">
                    <Trophy size={48} className="text-yellow-400 mb-2 drop-shadow-lg" />
                    <h3 className="text-xl font-bold text-white mb-1">Incrível!</h3>
                    <p className="text-xs text-indigo-100 mb-4 px-4">Você completou +1h hoje!</p>
                    <button 
                        onClick={() => setShowMilestone(false)}
                        className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold text-sm shadow-xl active:scale-95 transition-all"
                    >
                        Continuar
                    </button>
                </div>
            )}

            {/* SVG Progress Ring */}
            <svg 
              width={size} 
              height={size} 
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                {/* Background Circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-900"
                />
                {/* Progress Circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    style={{ 
                        strokeDashoffset: offset,
                        transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease'
                    }}
                    strokeLinecap="round"
                    className={`${pomodoroPhase === 'study' ? 'text-indigo-500' : 'text-emerald-500'}`}
                />
            </svg>

            {/* Inner Content - Precisely centered */}
            <div className="flex flex-col items-center justify-center z-10 text-center">
                <div className="flex items-center gap-1 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${pomodoroPhase === 'study' ? 'bg-indigo-900/50 text-indigo-400 border border-indigo-500/30' : 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30'}`}>
                        {pomodoroPhase === 'study' ? 'Foco' : 'Descanso'}
                    </span>
                </div>
                
                <div className={`text-6xl font-mono font-bold tracking-tighter ${isActive ? 'text-white' : 'text-slate-500'}`}>
                    {formatTime(seconds)}
                </div>

                <input 
                    type="text" 
                    placeholder="Matéria..." 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={isActive}
                    className="bg-transparent text-center text-sm text-slate-400 placeholder-slate-700 focus:outline-none border-b border-transparent focus:border-indigo-500/50 transition-colors mt-4 w-32"
                />
            </div>

            {/* Settings Toggle Button - Adjusted position to be clean */}
            <button 
                onClick={() => setShowSettings(!showSettings)}
                className="absolute bottom-4 right-4 p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-500 hover:text-indigo-400 transition-colors z-20 shadow-lg"
            >
                <Settings2 size={20} />
            </button>
        </div>

        {/* Main Controls below circle */}
        <div className="flex items-center gap-8 mt-12">
            <button 
                onClick={resetTimer}
                className="h-14 w-14 rounded-full bg-slate-900 border border-slate-800 text-slate-500 hover:bg-slate-800 flex items-center justify-center transition-all shadow-md active:scale-90"
            >
                <Square size={20} fill="currentColor" />
            </button>

            <button 
                onClick={toggleTimer}
                className={`flex items-center justify-center h-20 w-20 rounded-full font-bold transition-all shadow-2xl active:scale-95 border-4 ${isActive ? 'bg-amber-500 border-amber-400/50 text-amber-950' : (pomodoroPhase === 'rest' ? 'bg-emerald-600 border-emerald-500/50' : 'bg-indigo-600 border-indigo-500/50') + ' text-white'}`}
            >
                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1"/>}
            </button>
            
            <div className="w-14"></div> {/* Balance spacer */}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xs shadow-2xl animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        <Timer size={20} className="text-indigo-400" /> Ajustes
                      </h3>
                      <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white">
                        <X size={20} />
                      </button>
                  </div>

                  <div className="space-y-6">
                      <div>
                          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-2 tracking-widest">Estudo (min)</label>
                          <div className="flex items-center gap-4">
                              <input 
                                type="range" min="1" max="120" step="1"
                                value={studyMinutes} 
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setStudyMinutes(val);
                                    if (!isActive && pomodoroPhase === 'study') setSeconds(val * 60);
                                }}
                                className="flex-1 accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                              />
                              <input 
                                type="number" 
                                min="1"
                                max="180"
                                value={studyMinutes}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if(!isNaN(val) && val > 0) {
                                        setStudyMinutes(val);
                                        if (!isActive && pomodoroPhase === 'study') setSeconds(val * 60);
                                    }
                                }}
                                className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-center font-mono text-indigo-400 font-bold focus:outline-none focus:border-indigo-500"
                              />
                          </div>
                      </div>
                      
                      <div>
                          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-2 tracking-widest">Descanso (min)</label>
                          <div className="flex items-center gap-4">
                              <input 
                                type="range" min="1" max="30" step="1"
                                value={restMinutes} 
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setRestMinutes(val);
                                    if (!isActive && pomodoroPhase === 'rest') setSeconds(val * 60);
                                }}
                                className="flex-1 accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                              />
                              <input 
                                type="number" 
                                min="1"
                                max="60"
                                value={restMinutes}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if(!isNaN(val) && val > 0) {
                                        setRestMinutes(val);
                                        if (!isActive && pomodoroPhase === 'rest') setSeconds(val * 60);
                                    }
                                }}
                                className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-2 text-center font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                              />
                          </div>
                      </div>

                      <button 
                        onClick={() => setShowSettings(false)}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all border border-slate-700 mt-4"
                      >
                        Pronto
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* History */}
      <div className="mt-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <History size={16} /> Registros de Hoje
        </h3>
        
        <div className="space-y-3">
            {logs.filter(l => l.date === new Date().toLocaleDateString('pt-BR')).length === 0 ? (
                <div className="text-center py-8 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 text-slate-600 text-xs italic">
                    Inicie o foco para ver seu histórico
                </div>
            ) : (
                logs.filter(l => l.date === new Date().toLocaleDateString('pt-BR')).slice(0, 3).map(log => (
                    <div key={log.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center group transition-all hover:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-indigo-900/30 flex items-center justify-center text-indigo-500">
                                <BookOpen size={18} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-200 text-sm truncate max-w-[120px]">{log.subject}</div>
                                <div className="text-[10px] text-slate-500">Concluído</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <span className="font-mono text-emerald-400 text-sm font-bold">
                                +{Math.floor(log.durationSeconds / 60)}min
                             </span>
                             <button onClick={() => deleteLog(log.id)} className="text-slate-700 hover:text-rose-500 transition-colors p-1">
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