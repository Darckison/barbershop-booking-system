import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // IMPORT NOVO

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, phone, password);
    if (success) navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] py-8">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-barber-cardDark p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        
        {/* BOTÃO VOLTAR AQUI */}
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-barber-primary mb-6 transition w-fit">
          <ArrowLeftIcon className="w-5 h-5" /> Voltar para o início
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Criar Conta</h2>
          <p className="text-gray-500">Junte-se a nós e agende sem filas.</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Nome Completo</label>
          <input type="text" value={name} onChange={(e)=>setName(e.target.value)} required placeholder="João Silva" className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white focus:outline-none focus:border-barber-primary focus:ring-1 focus:ring-barber-primary transition" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">E-mail</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="seu@email.com" className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white focus:outline-none focus:border-barber-primary focus:ring-1 focus:ring-barber-primary transition" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Telefone (WhatsApp)</label>
          <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} required placeholder="(00) 90000-0000" className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white focus:outline-none focus:border-barber-primary focus:ring-1 focus:ring-barber-primary transition" />
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">Senha</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required placeholder="Mínimo 6 caracteres" className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white focus:outline-none focus:border-barber-primary focus:ring-1 focus:ring-barber-primary transition" />
        </div>
        
        <button type="submit" className="w-full bg-barber-primary text-white font-bold p-4 rounded-full hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 mb-6">
          Registar
        </button>

        <p className="text-center text-gray-500 text-sm">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-barber-primary font-bold hover:underline">
            Faça login
          </Link>
        </p>
      </form>
    </div>
  );
}