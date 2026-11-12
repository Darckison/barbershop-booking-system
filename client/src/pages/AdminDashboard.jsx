import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import {
  PlusIcon, PencilSquareIcon, TrashIcon,
  ArrowPathIcon, XMarkIcon, CalendarDaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { io } from 'socket.io-client';

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('appointments');
  const [abaAtiva, setAbaAtiva] = useState('hoje');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '', durationMinutes: '' });

  useEffect(() => {
    if (!isAdmin) return;
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(backendUrl);

    socket.on('novo-agendamento', (dados) => {
      toast.success(dados.mensagem, { icon: '💈', duration: 6000, style: { border: '2px solid #DC2626', background: '#121212', color: '#fff', padding: '16px' } });
      setTimeout(() => setRefreshTrigger(prev => prev + 1), 500);
    });
    return () => socket.disconnect();
  }, [isAdmin]);

  const fetchAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch (error) {
      if (error.name === 'CanceledError' || error.message === 'canceled') return;
      toast.error(`Falha ao carregar agendamentos`);
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  const fetchServices = useCallback(async () => {
    setLoadingServices(true);
    try {
      const { data } = await api.get('/services');
      setServices(data);
    } catch (error) {
      toast.error('Erro ao carregar serviços.');
    } finally {
      setLoadingServices(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      if (activeTab === 'appointments') fetchAppointments();
      if (activeTab === 'services') fetchServices();
    }
  }, [activeTab, isAdmin, refreshTrigger, fetchAppointments, fetchServices]);

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingServiceId(service._id);
      setServiceForm({ name: service.name, description: service.description, price: service.price, durationMinutes: service.durationMinutes });
    } else {
      setEditingServiceId(null);
      setServiceForm({ name: '', description: '', price: '', durationMinutes: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (editingServiceId) await api.put(`/services/${editingServiceId}`, serviceForm);
      else await api.post('/services', serviceForm);
      toast.success(editingServiceId ? 'Serviço atualizado!' : 'Novo serviço criado!');
      setIsModalOpen(false);
      fetchServices();
    } catch (error) {
      toast.error('Erro ao salvar serviço.');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Tem certeza que deseja apagar este serviço?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Serviço apagado!');
      fetchServices();
    } catch (error) { toast.error('Erro ao apagar serviço.'); }
  };

  const formatarDataIso = (dataObj) => {
    const ano = dataObj.getFullYear();
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const dia = String(dataObj.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const hoje = new Date();
  const dataHojeStr = formatarDataIso(hoje);

  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  const dataAmanhaStr = formatarDataIso(amanha);

  const agendamentosFiltrados = appointments.filter(appt => {
    if (!appt || !appt.date) return false;
    let dataAgendamento = appt.date.split('T')[0];
    if (dataAgendamento.includes('/')) {
      const partes = dataAgendamento.split('/');
      if (partes[0].length === 2) dataAgendamento = `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    if (abaAtiva === 'hoje') return dataAgendamento === dataHojeStr;
    if (abaAtiva === 'amanha') return dataAgendamento === dataAmanhaStr;
    return true;
  });

  const Spinner = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <ArrowPathIcon className="w-10 h-10 animate-spin text-red-600 mb-4" />
      <p className="text-gray-700 dark:text-gray-300 font-medium">A carregar dados do servidor...</p>
    </div>
  );

  if (authLoading || !isAdmin) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto w-full animate-in fade-in duration-500 text-gray-900 dark:text-white">
      {/* Título limpo e profissional */}
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2">Painel de Gestão</h2>
        <p className="text-gray-600 dark:text-gray-300">Área exclusiva para administração da Krattos Barber.</p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4 overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveTab('appointments')} className={`px-6 py-3 rounded-full font-bold transition whitespace-nowrap ${activeTab === 'appointments' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-white dark:bg-[#121212] text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'}`}>Agenda Geral</button>
        <button onClick={() => setActiveTab('services')} className={`px-6 py-3 rounded-full font-bold transition whitespace-nowrap ${activeTab === 'services' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-white dark:bg-[#121212] text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800'}`}>CRUD de Serviços</button>
      </div>

      {activeTab === 'appointments' && (
        <div>
          <div className="flex gap-3 mb-6">
            <button onClick={() => setAbaAtiva('hoje')} className={`flex flex-col items-center justify-center w-28 py-3 rounded-2xl font-bold transition border ${abaAtiva === 'hoje' ? 'bg-red-600 text-white border-transparent shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-white dark:bg-[#121212] text-gray-800 dark:text-white border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <span className="text-sm">HOJE</span>
              <span className="text-xs font-normal mt-1">{dataHojeStr.split('-').reverse().slice(0,2).join('/')}</span>
            </button>
            <button onClick={() => setAbaAtiva('amanha')} className={`flex flex-col items-center justify-center w-28 py-3 rounded-2xl font-bold transition border ${abaAtiva === 'amanha' ? 'bg-red-600 text-white border-transparent shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-white dark:bg-[#121212] text-gray-800 dark:text-white border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <span className="text-sm">AMANHÃ</span>
              <span className="text-xs font-normal mt-1">{dataAmanhaStr.split('-').reverse().slice(0,2).join('/')}</span>
            </button>
            <button onClick={() => setAbaAtiva('todos')} className={`flex flex-col items-center justify-center w-32 py-3 rounded-2xl font-bold transition border ${abaAtiva === 'todos' ? 'bg-red-600 text-white border-transparent shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-white dark:bg-[#121212] text-gray-800 dark:text-white border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <span className="text-sm">TODOS</span>
              <span className="text-xs font-normal mt-1 text-gray-500 dark:text-gray-400">Histórico</span>
            </button>
          </div>

          {loadingAppointments ? <Spinner /> : (
            <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800/60 rounded-3xl p-6 overflow-x-auto shadow-sm relative">
              <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-red-600/0 via-red-600/50 to-red-600/0"></div>
              
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500">
                    <th className="py-4 px-4 font-medium text-gray-700 dark:text-gray-400">Cliente</th>
                    <th className="py-4 px-4 font-medium text-gray-700 dark:text-gray-400">Serviço</th>
                    <th className="py-4 px-4 font-medium text-gray-700 dark:text-gray-400">Data / Hora</th>
                    <th className="py-4 px-4 font-medium text-gray-700 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-gray-500">
                        Nenhum agendamento registado para esta data.
                      </td>
                    </tr>
                  ) : (
                    agendamentosFiltrados.map(appt => (
                      <tr key={appt._id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">{appt.user?.name || 'Desconhecido'}</td>
                        <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{appt.service?.name}</td>
                        <td className="py-4 px-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <CalendarDaysIcon className="w-4 h-4 text-red-600 dark:text-red-500" />
                          {appt.date.includes('/') ? appt.date : appt.date.split('T')[0].split('-').reverse().join('/')} às <span className="font-bold text-gray-900 dark:text-white">{appt.startTime}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${appt.status === 'cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/50' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50'}`}>{appt.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'services' && (
        <div>
          <div className="flex justify-end mb-6">
            <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] transition"><PlusIcon className="w-5 h-5" /> Adicionar Serviço</button>
          </div>
          {loadingServices ? <Spinner /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(service => (
                <div key={service._id} className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 p-6 rounded-3xl hover:border-red-600/50 transition-all group relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600/0 group-hover:bg-red-600/80 transition-all"></div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{service.name}</h3>
                    <span className="font-black text-red-600 dark:text-red-500">R$ {Number(service.price).toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{service.description}</p>
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 mb-6"><ClockIcon className="w-4 h-4 text-gray-400" /><span>{service.durationMinutes} min</span></div>
                  <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(service)} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 py-2 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"><PencilSquareIcon className="w-4 h-4" /> Editar</button>
                    <button onClick={() => handleDeleteService(service._id)} className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/50 py-2 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition"><TrashIcon className="w-4 h-4" /> Apagar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 w-full max-w-lg relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"><XMarkIcon className="w-6 h-6" /></button>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-red-600 rounded-full"></span>
              {editingServiceId ? 'Editar Serviço' : 'Novo Serviço'}
            </h3>
            <form onSubmit={handleSaveService} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Nome</label>
                <input required type="text" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-gray-900 dark:text-white focus:border-red-600 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Descrição</label>
                <textarea required rows="2" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-gray-900 dark:text-white focus:border-red-600 outline-none resize-none transition"></textarea>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Preço (R$)</label>
                  <input required type="number" step="0.01" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-gray-900 dark:text-white focus:border-red-600 outline-none transition" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Tempo (min)</label>
                  <input required type="number" value={serviceForm.durationMinutes} onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: e.target.value })} className="w-full bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-gray-900 dark:text-white focus:border-red-600 outline-none transition" />
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white font-bold py-4 rounded-full hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition mt-4">{editingServiceId ? 'Salvar' : 'Criar Serviço'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}