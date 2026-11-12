import { useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  ScissorsIcon, SparklesIcon, CalendarDaysIcon,
  FireIcon, StarIcon, ClockIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Home() {
  const { user, isAdmin, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) return null;
  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleAgendarClick = () => {
    if (!user) {
      toast('Faça login ou crie uma conta para agendar!', { icon: '🔒' });
      navigate('/login');
    } else {
      navigate('/agendar');
    }
  };

  // =========================================================================
  // INTERFACE 1: DASHBOARD DO CLIENTE (Aparece apenas quando ESTÁ logado)
  // =========================================================================
  if (user) {
    return (
      <div className="flex flex-col max-w-5xl mx-auto w-full gap-8 animate-in fade-in duration-500">

        {/* Cabeçalho de Boas-vindas Personalizado */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              Fala, {user.name.split(' ')[0]}! ✌️
            </h1>
            <p className="text-gray-400 mt-1">Pronto para dar aquele trato no visual hoje?</p>
          </div>
          {/*<p className="text-sm font-bold text-barber-primary bg-orange-100 dark:bg-orange-500/10 px-4 py-2 rounded-full border border-orange-200 dark:border-orange-500/20 shadow-sm w-fit">
            Cliente VIP
          </p>*/}
        </div>

        {/* Banner Premium de Agendamento */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0A0A0A] text-white shadow-2xl mt-2">
          {/* Efeitos de Luz de Fundo */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-barber-primary/20 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-orange-600/20 blur-3xl pointer-events-none"></div>

          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
            <div className="max-w-md">
              <div className="flex items-center gap-2 text-barber-primary font-bold text-sm uppercase tracking-wider mb-4">
                <FireIcon className="w-5 h-5" /> Estilo em Alta
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                Agende seu <br />
                <span className="text-barber-primary">próximo corte.</span>
              </h2>
              <p className="text-gray-400 mb-8 text-lg font-light">
                Não deixe para a última hora. Garanta o seu horário e mantenha a sua melhor versão em dia.
              </p>
              <Link
                to="/agendar"
                className="inline-flex items-center justify-center gap-3 bg-barber-primary text-white px-8 py-4 rounded-full font-bold hover:scale-105 hover:bg-orange-600 transition-all duration-300 shadow-[0_10px_40px_rgba(255,107,0,0.4)] w-full md:w-auto"
              >
                <ScissorsIcon className="w-6 h-6" /> Agendar Agora
              </Link>
            </div>

            {/* Cartão Decorativo / Status Flutuante */}
            <div className="hidden md:flex flex-col gap-5 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 w-80 transform md:rotate-2 hover:rotate-0 transition-transform duration-500 shadow-xl">
              <div className="flex justify-between items-start">
                <div className="bg-barber-primary w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                  <StarIcon className="w-6 h-6 text-white" />
                </div>
                <span className="bg-white/20 text-xs font-bold px-3 py-1.5 rounded-full text-white tracking-wide">4.9/5 Avaliações</span>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Experiência Krattos</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Ambiente climatizado, som de primeira, resenha e os melhores barbeiros da cidade.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Atalhos Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 mb-8">
          <Link to="/meus-agendamentos" className="bg-white dark:bg-barber-cardDark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-barber-primary group transition-all duration-300 flex items-center gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors">
              <CalendarDaysIcon className="w-8 h-8 text-gray-400 group-hover:text-barber-primary transition-colors" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Meus Agendamentos</h3>
              <p className="text-gray-400 text-sm">Consulte o seu histórico e horários.</p>
            </div>
          </Link>

          <Link to="/agendar" className="bg-white dark:bg-barber-cardDark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-barber-primary group transition-all duration-300 flex items-center gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors">
              <ClockIcon className="w-8 h-8 text-gray-400 group-hover:text-barber-primary transition-colors" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Catálogo de Serviços</h3>
              <p className="text-gray-400 text-sm">Explore os nossos cortes e tratamentos.</p>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================================
  // INTERFACE 2: VISITANTES (Aparece quando NÃO está logado)
  // =========================================================================
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full gap-10">

      <section className="relative w-full h-[60vh] md:h-[70vh] rounded-[2.5rem] overflow-hidden shadow-2xl mt-4">
        <img
          src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2070&auto=format&fit=crop"
          alt="Barbearia"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        <div className="absolute z-10 bottom-0 left-0 w-full p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
              Descubra o <br />
              <span className="text-barber-primary">melhor estilo</span> para você.
            </h1>
            <p className="text-gray-300 text-lg md:text-xl font-light">
              Agende seu corte sem filas, escolha seu barbeiro favorito e desfrute de uma experiência premium.
            </p>
          </div>

          <button
            onClick={handleAgendarClick}
            className="flex items-center justify-center gap-3 bg-barber-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 hover:bg-orange-600 transition-all duration-300 shadow-[0_10px_40px_rgba(255,107,0,0.4)] whitespace-nowrap cursor-pointer"
          >
            <ScissorsIcon className="w-6 h-6" />
            Agendar Agora
          </button>
        </div>
      </section>

      <section className="py-6 px-2">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nossos Serviços</h2>
          <button
            onClick={handleAgendarClick}
            className="text-barber-primary font-medium hover:underline bg-transparent border-none cursor-pointer"
          >
            Ver todos
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-barber-cardDark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:-translate-y-2 transition-transform duration-300 group">
            <div className="bg-orange-50 dark:bg-orange-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ScissorsIcon className="h-8 w-8 text-barber-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Corte & Estilo</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Técnicas clássicas e degradês modernos, respeitando o seu perfil.
            </p>
          </div>

          <div className="bg-white dark:bg-barber-cardDark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:-translate-y-2 transition-transform duration-300 group">
            <div className="bg-orange-50 dark:bg-orange-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <SparklesIcon className="h-8 w-8 text-barber-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Barboterapia</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Toalha quente, alinhamento perfeito e hidratação completa.
            </p>
          </div>

          <div className="bg-white dark:bg-barber-cardDark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:-translate-y-2 transition-transform duration-300 group">
            <div className="bg-orange-50 dark:bg-orange-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <CalendarDaysIcon className="h-8 w-8 text-barber-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gestão de Tempo</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Agende pelo aplicativo e seja atendido sem espera.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
