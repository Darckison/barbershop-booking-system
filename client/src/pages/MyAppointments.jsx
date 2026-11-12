import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { CalendarDaysIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function MyAppointments() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
      return;
    }
    if (user) {
      fetchAppointments();
    }
  }, [user, authLoading, navigate]);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments/my');
      setAppointments(data);
    } catch (error) {
      toast.error('Erro ao carregar os seus agendamentos.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Tem a certeza que deseja cancelar este horário?')) return;
    
    try {
      await api.patch(`/appointments/${id}/cancel`);
      toast.success('Agendamento cancelado com sucesso.');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao cancelar.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pendente</span>;
      case 'confirmed': return <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Confirmado</span>;
      case 'cancelled': return <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Cancelado</span>;
      case 'done': return <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Concluído</span>;
      default: return null;
    }
  };

  if (authLoading || loading) return <div className="text-center py-20 text-gray-400">A carregar os seus horários...</div>;

  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Os Meus Agendamentos</h2>
          <p className="text-gray-400">Acompanhe o seu histórico na Krattos Barber.</p>
        </div>
        <Link to="/agendar" className="hidden md:flex bg-red-600 text-white px-5 py-2 rounded-full font-bold hover:bg-red-700 transition shadow-[0_0_15px_rgba(220,38,38,0.4)]">
          Novo Agendamento
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-[#121212] border border-gray-800 rounded-3xl p-10 text-center">
          <CalendarDaysIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Nenhum agendamento encontrado</h3>
          <p className="text-gray-400 mb-6">Ainda não marcou nenhum horário connosco.</p>
          <Link to="/agendar" className="inline-block bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            Agendar Agora
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map(appt => (
            <div key={appt._id} className="bg-[#121212] border border-gray-800/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:border-red-600/50 transition-colors relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600/0 via-red-600/60 to-red-600/0"></div>
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  {getStatusBadge(appt.status)}
                  <span className="text-xl font-black text-red-500">R$ {appt.service.price.toFixed(2)}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">{appt.service.name}</h3>
                
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <CalendarDaysIcon className="w-5 h-5 text-red-500" />
                  <span>{appt.date.split('-').reverse().join('/')}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <ClockIcon className="w-5 h-5 text-red-500" />
                  <span>{appt.startTime} • {appt.service.durationMinutes} min</span>
                </div>
              </div>

              {/* Só pode cancelar se estiver Pendente ou Confirmado */}
              {(appt.status === 'pending' || appt.status === 'confirmed') && (
                <button 
                  onClick={() => handleCancel(appt._id)}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-red-500 bg-red-900/20 hover:bg-red-900/40 border border-red-900/30 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" /> Cancelar Horário
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}