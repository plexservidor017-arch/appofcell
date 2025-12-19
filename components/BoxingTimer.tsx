import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, Square, RefreshCcw, Bell, FastForward } from 'lucide-react';
import { ROUND_DURATION, REST_DURATION, TOTAL_ROUNDS } from '../constants';
import { TimerPhase } from '../types';

const BoxingTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState<TimerPhase>('work');
  
  // Ref to hold the audio object to prevent re-creation
  const bellAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Simple beep sound URL or asset
    bellAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2048/2048-preview.mp3');
    bellAudio.current.volume = 0.5;
  }, []);

  const playBell = () => {
    if (bellAudio.current) {
      bellAudio.current.currentTime = 0;
      bellAudio.current.play().catch(e => console.log("Audio play blocked", e));
    }
  };

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setPhase('work');
    setCurrentRound(1);
    setTimeLeft(ROUND_DURATION);
  }, []);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Function to manually skip the current phase (Test button logic)
  const skipPhase = () => {
    playBell();
    if (phase === 'work') {
      if (currentRound < TOTAL_ROUNDS) {
        setPhase('rest');
        setTimeLeft(REST_DURATION);
      } else {
        setPhase('finished');
        setIsActive(false);
        setTimeLeft(0);
      }
    } else if (phase === 'rest') {
      setPhase('work');
      setCurrentRound((prev) => prev + 1);
      setTimeLeft(ROUND_DURATION);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      playBell();
      if (phase === 'work') {
        if (currentRound < TOTAL_ROUNDS) {
          setPhase('rest');
          setTimeLeft(REST_DURATION);
        } else {
          setPhase('finished');
          setIsActive(false);
        }
      } else if (phase === 'rest') {
        setPhase('work');
        setCurrentRound((prev) => prev + 1);
        setTimeLeft(ROUND_DURATION);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, phase, currentRound]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    if (phase === 'rest') return 'text-emerald-400';
    if (phase === 'finished') return 'text-indigo-400';
    return 'text-rose-500';
  };

  const getPhaseLabel = () => {
    if (phase === 'work') return 'LUTA';
    if (phase === 'rest') return 'DESCANSO';
    return 'FIM';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 space-y-8 animate-in fade-in duration-500 bg-slate-950">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-100 tracking-tight">Treino de Boxe</h2>
        <p className="text-slate-400 font-medium">Round {phase === 'finished' ? TOTAL_ROUNDS : currentRound} de {TOTAL_ROUNDS}</p>
      </div>

      {/* Main Timer Display */}
      <div className="relative group">
        <div className={`absolute -inset-1 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 ${phase === 'work' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
        <div className="relative w-72 h-72 bg-slate-900 rounded-full shadow-2xl flex flex-col items-center justify-center border-4 border-slate-800">
            <span className={`text-7xl font-mono font-bold tracking-tighter ${getProgressColor()}`}>
              {formatTime(timeLeft)}
            </span>
            <span className={`mt-2 text-xl font-bold tracking-widest uppercase ${getProgressColor()} opacity-80`}>
              {getPhaseLabel()}
            </span>
        </div>
      </div>

      {/* Round Indicators */}
      <div className="flex gap-3 justify-center w-full">
        {Array.from({ length: TOTAL_ROUNDS }).map((_, idx) => {
          const roundNum = idx + 1;
          const isCompleted = roundNum < currentRound || (roundNum === currentRound && phase === 'rest') || phase === 'finished';
          const isCurrent = roundNum === currentRound && phase !== 'finished';
          
          return (
            <div 
              key={idx}
              className={`
                h-10 w-10 flex items-center justify-center rounded-lg border-2 transition-all duration-300
                ${isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : ''}
                ${isCurrent ? 'bg-slate-800 border-indigo-500 text-indigo-400 scale-110 shadow-lg' : ''}
                ${!isCompleted && !isCurrent ? 'bg-slate-900 border-slate-800 text-slate-700' : ''}
              `}
            >
              {isCompleted ? <span className="font-bold">✓</span> : <span className="font-bold">{roundNum}</span>}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-8">
         <button
          onClick={toggleTimer}
          disabled={phase === 'finished'}
          className={`h-20 w-20 flex items-center justify-center rounded-full shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isActive ? 'bg-amber-500 text-amber-950' : 'bg-indigo-600 text-white'}`}
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1"/>}
        </button>

        <button
          onClick={resetTimer}
          className="h-16 w-16 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 shadow-md transform transition active:scale-95 hover:bg-slate-700 hover:text-slate-200"
        >
          <Square size={24} fill="currentColor" />
        </button>

        <button
          onClick={skipPhase}
          disabled={phase === 'finished'}
          className="h-16 w-16 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 shadow-md transform transition active:scale-95 hover:bg-slate-700 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Pular / Teste"
        >
          <FastForward size={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default BoxingTimer;