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
    <nav className="bg-white/80 dark:bg-barber-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-3 sm:p-4 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO - Redireciona para Admin se for Admin, caso contrário para a Home */}
        <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-2 sm:gap-3 group">
          <img 
            src="/logo.png" 
            alt="Krattos Barber" 
            className="h-9 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform" 
          />
          {/* Texto oculto no mobile (hidden) e visível a partir de telas pequenas (sm:block) */}
          <span className="hidden sm:block text-xl md:text-2xl font-black text-gray-900 dark:text-white">
            Krattos<span className="text-barber-primary">Barber</span>
          </span>
        </Link>
        
        {/* Container da direita com espaçamento menor no mobile (gap-2) */}
        <div className="flex gap-2 sm:gap-4 items-center">
          
          {/* Seletor de Tema (Ligeiramente mais compacto no mobile) */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-0.5 sm:p-1 border border-gray-200 dark:border-gray-700">
            <button onClick={() => setTheme('light')} className={`p-1 sm:p-1.5 rounded-full transition ${theme === 'light' ? 'bg-white text-barber-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
              <SunIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button onClick={() => setTheme('system')} className={`p-1 sm:p-1.5 rounded-full transition ${theme === 'system' ? 'bg-white dark:bg-gray-700 text-barber-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
              <ComputerDesktopIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button onClick={() => setTheme('dark')} className={`p-1 sm:p-1.5 rounded-full transition ${theme === 'dark' ? 'bg-gray-700 text-barber-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
              <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Oculta o link 'Início' se for Admin */}
          {!isAdmin && (
            <Link to="/" className="hidden md:block font-medium text-gray-700 dark:text-gray-200 hover:text-barber-primary transition-colors">Início</Link>
          )}
          
          {user ? (
            <>
              {isAdmin ? (
                <Link to="/admin" className="font-bold text-red-500 hover:text-red-600 transition-colors text-sm sm:text-base">Painel Admin</Link>
              ) : (
                <>
                  <Link to="/meus-agendamentos" className="hidden md:block font-medium text-gray-700 dark:text-gray-200 hover:text-barber-primary transition-colors">Meus Agendamentos</Link>
                  {/* Botão Agendar ajustado para mobile */}
                  <Link to="/agendar" className="bg-barber-primary text-white px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base rounded-full font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30">Agendar</Link>
                </>
              )}
              {/* Botão Sair */}
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 font-medium ml-1 sm:ml-2 text-sm sm:text-base">Sair</button>
            </>
          ) : (
            /* Botão Entrar ajustado para mobile */
            <Link to="/login" className="bg-barber-primary text-white px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base rounded-full font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30">Entrar</Link>
          )}
        </div>
      </div>
    </nav>
  );
}