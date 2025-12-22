import React, { useRef } from 'react';
import { Download, Upload, Trash2, ShieldCheck, Database } from 'lucide-react';

const KEYS = ['fitdroid_runs', 'fitdroid_hygiene', 'fitdroid_study', 'fitdroid_diet'];

const Settings: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const backup: Record<string, any> = {};
    KEYS.forEach(key => {
      const val = localStorage.getItem(key);
      if (val) backup[key] = JSON.parse(val);
    });

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitdroid_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (confirm('Isso irá substituir seus dados atuais. Continuar?')) {
          Object.keys(data).forEach(key => {
            if (KEYS.includes(key)) {
              localStorage.setItem(key, JSON.stringify(data[key]));
            }
          });
          alert('Dados importados com sucesso! Recarregando...');
          window.location.reload();
        }
      } catch (err) {
        alert('Erro ao processar o arquivo de backup.');
      }
    };
    reader.readAsText(file);
  };

  const clearData = () => {
    if (confirm('CUIDADO: Isso apagará TODOS os seus registros permanentemente. Tem certeza?')) {
      KEYS.forEach(key => localStorage.removeItem(key));
      alert('Todos os dados foram apagados.');
      window.location.reload();
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 p-6 animate-in fade-in duration-500 overflow-y-auto no-scrollbar">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-100 mb-1">Configurações</h2>
        <p className="text-slate-500">Gerencie seus dados e privacidade</p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6 text-indigo-400">
            <Database size={24} />
            <h3 className="text-lg font-semibold text-slate-100">Backup de Histórico</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={exportData}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-750 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Download size={20} className="text-emerald-400" />
                <span className="text-slate-200 font-medium">Exportar Dados</span>
              </div>
              <span className="text-xs text-slate-500 group-hover:text-slate-400">JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-between p-4 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-750 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Upload size={20} className="text-blue-400" />
                <span className="text-slate-200 font-medium">Importar Dados</span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={importData}
                accept=".json"
                className="hidden"
              />
              <span className="text-xs text-slate-500 group-hover:text-slate-400">JSON</span>
            </button>
          </div>
          
          <p className="mt-4 text-xs text-slate-500 leading-relaxed">
            Seus dados são armazenados localmente no navegador. Recomendamos exportar um backup regularmente para não perder seu progresso.
          </p>
        </div>

        <div className="bg-rose-950/20 border border-rose-900/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4 text-rose-400">
            <Trash2 size={24} />
            <h3 className="text-lg font-semibold text-rose-100">Zona de Perigo</h3>
          </div>
          <button
            onClick={clearData}
            className="w-full py-3 px-4 rounded-xl bg-rose-600/10 border border-rose-600/30 text-rose-500 font-bold hover:bg-rose-600 hover:text-white transition-all"
          >
            Apagar Tudo
          </button>
        </div>

        <div className="flex flex-col items-center justify-center pt-8 opacity-40">
           <ShieldCheck size={32} className="text-indigo-500 mb-2" />
           <span className="text-xs text-slate-400">FitDroid Manager v1.2</span>
           <span className="text-[10px] text-slate-600">Focado em Privacidade Local</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;