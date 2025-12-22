export type MainTab = 'treino' | 'higiene' | 'alimentacao' | 'estudo' | 'configuracoes';
export type TrainingTab = 'boxe' | 'corrida';

export type TimerPhase = 'work' | 'rest' | 'finished';

export type ActivityMode = 'run' | 'bike';

export interface RunLog {
  id: string;
  name: string;
  startLocation: string;
  endLocation: string;
  distanceKm: number;
  date: string;
  mode: ActivityMode;
}

export interface StudyLog {
  id: string;
  subject: string;
  durationSeconds: number;
  date: string;
}

export interface HygieneState {
  date: string;
  teethMorning: boolean;
  teethAfternoon: boolean;
  teethNight: boolean;
  shower: boolean;
  grooming: boolean;
}

export interface DietState {
  date: string;
  waterCount: number; // glasses
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  snack: boolean;
  notes: string;
}