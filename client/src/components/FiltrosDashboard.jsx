import { useState } from 'react';

export default function FiltrosDashboard() {
  // 1. Estado para controlar qual aba está selecionada
  const [abaAtiva, setAbaAtiva] = useState('hoje');

  // 2. Lógica para calcular as datas automaticamente
  const hoje = new Date();
  const amanha = new Date();
  amanha.setDate(hoje.getDate() + 1);

  // Função para formatar a data no padrão "DD/MM" (ex: 23/11)
  const formatarData = (data) => {
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const dataHoje = formatarData(hoje);
  const dataAmanha = formatarData(amanha);

  // 3. Função auxiliar para mudar a cor do botão ativo
  const cssBotao = (aba) => `
    flex flex-col items-center justify-center px-6 py-2 rounded-xl transition-all shadow-sm
    ${abaAtiva === aba 
      ? 'bg-barber-primary text-white border-2 border-barber-primary scale-105' 
      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'}
  `;

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {/* Botão HOJE */}
      <button 
        onClick={() => setAbaAtiva('hoje')} 
        className={cssBotao('hoje')}
      >
        <span className="font-bold text-lg uppercase">Hoje</span>
        <span className="text-sm font-medium opacity-90">{dataHoje}</span>
      </button>

      {/* Botão AMANHÃ */}
      <button 
        onClick={() => setAbaAtiva('amanha')} 
        className={cssBotao('amanha')}
      >
        <span className="font-bold text-lg uppercase">Amanhã</span>
        <span className="text-sm font-medium opacity-90">{dataAmanha}</span>
      </button>

      {/* Botão TODOS */}
      <button 
        onClick={() => setAbaAtiva('todos')} 
        className={cssBotao('todos')}
      >
        <span className="font-bold text-lg uppercase">Todos</span>
        <span className="text-sm font-medium opacity-90">Histórico</span>
      </button>
    </div>
  );
}