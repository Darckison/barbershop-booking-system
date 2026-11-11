import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('barber_token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (error) {
          localStorage.removeItem('barber_token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('barber_token', data.token);
      setUser(data.user);
      toast.success('Login realizado com sucesso!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
      return false;
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      await api.post('/auth/register', { name, email, phone, password });
      toast.success('Conta criada! A iniciar sessão...');
      return await login(email, password); // Faz login automático após registo
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar conta');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('barber_token');
    setUser(null);
    toast.success('Sessão terminada');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin: user?.role === 'admin' }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};