import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeftIcon, ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('client'); // 'client' ou 'admin'
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/');
  };

  const fillTestCredentials = () => {
    if (loginType === 'admin') {
      setEmail('admin@barber.com');
      setPassword('Admin@123');
    } else {
      setEmail('cliente@teste.com');
      setPassword('Cliente@123');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh]">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-barber-cardDark p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-barber-primary mb-6 transition w-fit">
          <ArrowLeftIcon className="w-5 h-5" /> Voltar para o início
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            {loginType === 'admin' ? 'Acesso Restrito' : 'Bem-vindo de volta'}
          </h2>
          <p className="text-gray-500">
            {loginType === 'admin' ? 'Área exclusiva para a gestão da barbearia.' : 'Faça login para gerir os seus horários.'}
          </p>
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">E-mail</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e)=>setEmail(e.target.value)} 
            required 
            placeholder={loginType === 'admin' ? "admin@barber.com" : "seu@email.com"}
            className={`w-full bg-gray-50 dark:bg-[#121212] border rounded-2xl p-4 text-gray-900 dark:text-white focus:outline-none focus:ring-1 transition ${
              loginType === 'admin' 
                ? 'border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-200 dark:border-gray-700 focus:border-barber-primary focus:ring-barber-primary'
            }`} 
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Senha</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)} 
            required 
            placeholder="••••••••"
            className={`w-full bg-gray-50 dark:bg-[#121212] border rounded-2xl p-4 text-gray-900 dark:text-white focus:outline-none focus:ring-1 transition ${
              loginType === 'admin' 
                ? 'border-gray-200 dark:border-gray-700 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-200 dark:border-gray-700 focus:border-barber-primary focus:ring-barber-primary'
            }`} 
          />
        </div>
        
        <button 
          type="submit" 
          className={`w-full text-white font-bold p-4 rounded-full transition shadow-lg mb-6 ${
            loginType === 'admin'
              ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
              : 'bg-barber-primary hover:bg-orange-600 shadow-orange-500/30'
          }`}
        >
          {loginType === 'admin' ? 'Entrar no Painel' : 'Entrar'}
        </button>

        <p onClick={fillTestCredentials} className="text-center text-xs text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 mb-4 transition-colors">
          *Dica para a apresentação: Clique aqui para preencher os dados de teste
        </p>

        {loginType === 'client' && (
          <p className="text-center text-gray-500 text-sm mb-2">
            Ainda não tem conta?{' '}
            <Link to="/register" className="text-barber-primary font-bold hover:underline">
              Cadastre-se aqui
            </Link>
          </p>
        )}

        {/* O SEGREDO DO UX: Link discreto separado por uma linha */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={() => {
              setLoginType(loginType === 'client' ? 'admin' : 'client');
              setEmail('');
              setPassword('');
            }}
            className="text-xs font-medium text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex items-center justify-center gap-2 mx-auto w-fit"
          >
            {loginType === 'client' ? (
              <><ShieldCheckIcon className="w-4 h-4" /> Acesso para Funcionários</>
            ) : (
              <><UserIcon className="w-4 h-4" /> Voltar para Login de Cliente</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
