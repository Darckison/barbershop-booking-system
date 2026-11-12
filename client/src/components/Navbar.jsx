import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-3 sm:p-4 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO AJUSTADO - Texto agora usa red-600 garantindo a cor da barbearia */}
        <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-1.5 sm:gap-3 group">
          <img 
            src="/logo.png" 
            alt="Krattos Barber" 
            className="h-8 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform" 
          />
          <span className="text-[15px] sm:text-xl md:text-2xl font-black text-gray-900 dark:text-white whitespace-nowrap tracking-tight sm:tracking-normal">
            Krattos<span className="text-red-600">Barber</span>
          </span>
        </Link>
        
        <div className="flex gap-2 sm:gap-4 items-center">
          {/* Seletor de Tema com detalhes em vermelho premium */}
          <div className="flex bg-gray-100 dark:bg-[#121212] rounded-full p-0.5 sm:p-1 border border-gray-200 dark:border-gray-800">
            <button onClick={() => setTheme('light')} className={`p-1 sm:p-1.5 rounded-full transition ${theme === 'light' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-500 hover:dark:text-gray-300'}`}>
              <SunIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button onClick={() => setTheme('system')} className={`p-1 sm:p-1.5 rounded-full transition ${theme === 'system' ? 'bg-white dark:bg-gray-800 text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-500 hover:dark:text-gray-300'}`}>
              <ComputerDesktopIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button onClick={() => setTheme('dark')} className={`p-1 sm:p-1.5 rounded-full transition ${theme === 'dark' ? 'bg-gray-700 dark:bg-gray-800 text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-500 hover:dark:text-gray-300'}`}>
              <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {!isAdmin && (
            <Link to="/" className="hidden md:block font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors">Início</Link>
          )}
          
          {user ? (
            <>
              {isAdmin ? (
                <Link to="/admin" className="font-bold text-red-600 hover:text-red-500 transition-colors text-sm sm:text-base">Painel Admin</Link>
              ) : (
                <>
                  <Link to="/meus-agendamentos" className="hidden md:block font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 transition-colors">Meus Agendamentos</Link>
                  {/* Botão Agendar com brilho vermelho (glow) */}
                  <Link to="/agendar" className="bg-red-600 text-white px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base rounded-full font-bold hover:bg-red-700 transition shadow-[0_0_15px_rgba(220,38,38,0.4)]">Agendar</Link>
                </>
              )}
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 font-medium ml-1 sm:ml-2 text-sm sm:text-base transition">Sair</button>
            </>
          ) : (
            /* Botão Entrar com brilho vermelho (glow) */
            <Link to="/login" className="bg-red-600 text-white px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base rounded-full font-bold hover:bg-red-700 transition shadow-[0_0_15px_rgba(220,38,38,0.4)]">Entrar</Link>
          )}
        </div>
      </div>
    </nav>
  );
}