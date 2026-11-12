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
import FiltrosDashboard from '../components/FiltrosDashboard';

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

  // ==========================================
  // MÁGICA DO TEMPO REAL COM SOCKET.IO
  // ==========================================
  useEffect(() => {
    if (!isAdmin) return;

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(backendUrl);

    socket.on('novo-agendamento', (dados) => {
      toast.success(dados.mensagem, {
        icon: '🔔',
        duration: 6000,
        style: { border: '2px solid #FF6B00', padding: '16px' }
      });

      setTimeout(() => {
        setRefreshTrigger(prev => prev + 1);
      }, 500);
    });

    return () => {
      socket.disconnect();
    };
  }, [isAdmin]);

  // --- LÓGICA DE AGENDAMENTOS (Protegida) ---
  const fetchAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch (error) {
      if (error.name === 'CanceledError' || error.message === 'canceled') return;
      const erroReal = error.response?.data?.message || error.message;
      toast.error(`Falha: ${erroReal}`);
      console.error("ERRO DETALHADO:", error);
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  // --- LÓGICA DE SERVIÇOS ---
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
      setServiceForm({
        name: service.name, description: service.description,
        price: service.price, durationMinutes: service.durationMinutes
      });
    } else {
      setEditingServiceId(null);
      setServiceForm({ name: '', description: '', price: '', durationMinutes: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (editingServiceId) {
        await api.put(`/services/${editingServiceId}`, serviceForm);
        toast.success('Serviço atualizado!');
      } else {
        await api.post('/services', serviceForm);
        toast.success('Novo serviço criado!');
      }
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
      toast.success('Serviço apagado com sucesso!');
      fetchServices();
    } catch (error) {
      toast.error('Erro ao apagar serviço.');
    }
  };

  // ==========================================
  // MOTOR DE FILTRAGEM DE DATAS 
  // ==========================================
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
    // Garante que pega apenas a data (YYYY-MM-DD), cortando possíveis horas do banco
    const dataAgendamento = appt.date.split('T')[0]; 
    
    // Transforma a palavra da aba em minúscula e remove acentos (AMANHÃ -> amanha)
    const aba = String(abaAtiva).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    if (aba === 'hoje') return dataAgendamento === dataHojeStr;
    if (aba === 'amanha') return dataAgendamento === dataAmanhaStr;
    
    return true; // Se for "todos", passa direto
  });
  // ==========================================

  const Spinner = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <ArrowPathIcon className="w-10 h-10 animate-spin text-barber-primary mb-4" />
      <p className="text-gray-500 font-medium">A carregar dados do servidor...</p>
    </div>
  );

  if (authLoading || !isAdmin) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto w-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Painel de Gestão</h2>
        <p className="text-gray-500">Área exclusiva para administração da Krattos Barber.</p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-6 py-3 rounded-full font-bold transition whitespace-nowrap ${activeTab === 'appointments' ? 'bg-barber-primary text-white shadow-lg' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          Agenda Geral
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-6 py-3 rounded-full font-bold transition whitespace-nowrap ${activeTab === 'services' ? 'bg-barber-primary text-white shadow-lg' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          CRUD de Serviços
        </button>
      </div>

      {activeTab === 'appointments' && (
        <div>
          <FiltrosDashboard abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />

          {loadingAppointments ? <Spinner /> : (
            <div className="bg-white dark:bg-barber-cardDark border border-gray-100 dark:border-gray-800 rounded-3xl p-6 overflow-x-auto shadow-sm">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500">
                    <th className="py-4 px-4 font-medium">Cliente</th>
                    <th className="py-4 px-4 font-medium">Serviço</th>
                    <th className="py-4 px-4 font-medium">Data / Hora</th>
                    <th className="py-4 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentosFiltrados.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-10 text-gray-500">Nenhum agendamento para esta data.</td></tr>
                  ) : (
                    agendamentosFiltrados.map(appt => (
                      <tr key={appt._id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                        <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">
                          {appt.user?.name || 'Desconhecido'}
                        </td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{appt.service?.name}</td>
                        <td className="py-4 px-4 text-gray-600 dark:text-gray-300 flex items-center gap-2">
                          <CalendarDaysIcon className="w-4 h-4 text-barber-primary" />
                          {appt.date.split('-').reverse().join('/')} às {appt.startTime}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${appt.status === 'cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-green-100 text-green-600 dark:bg-green-900/30'}`}>
                            {appt.status}
                          </span>
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
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-gray-900 text-white dark:bg-white dark:text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition"
            >
              <PlusIcon className="w-5 h-5" /> Adicionar Serviço
            </button>
          </div>

          {loadingServices ? <Spinner /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(service => (
                <div key={service._id} className="bg-white dark:bg-barber-cardDark border border-gray-100 dark:border-gray-800 p-6 rounded-3xl shadow-sm hover:border-barber-primary transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{service.name}</h3>
                    <span className="font-black text-barber-primary">R$ {Number(service.price).toFixed(2)}</span>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-4">{service.description}</p>

                  <div className="flex items-center gap-1 text-sm font-medium text-gray-400 mb-6">
                    <ClockIcon className="w-4 h-4" />
                    <span>{service.durationMinutes} minutos</span>
                  </div>

                  <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(service)} className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 py-2 rounded-xl font-bold hover:bg-blue-100 transition">
                      <PencilSquareIcon className="w-4 h-4" /> Editar
                    </button>
                    <button onClick={() => handleDeleteService(service._id)} className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 py-2 rounded-xl font-bold hover:bg-red-100 transition">
                      <TrashIcon className="w-4 h-4" /> Apagar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-barber-cardDark rounded-3xl p-8 w-full max-w-lg shadow-2xl relative zoom-in-95">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
              {editingServiceId ? 'Editar Serviço' : 'Novo Serviço'}
            </h3>
            <form onSubmit={handleSaveService} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Nome do Serviço</label>
                <input required type="text" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:outline-none focus:border-barber-primary" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Descrição</label>
                <textarea required rows="2" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:outline-none focus:border-barber-primary resize-none"></textarea>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Preço (R$)</label>
                  <input required type="number" step="0.01" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:outline-none focus:border-barber-primary" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 ml-1">Duração (min)</label>
                  <input required type="number" value={serviceForm.durationMinutes} onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: e.target.value })} className="w-full bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white focus:outline-none focus:border-barber-primary" />
                </div>
              </div>
              <button type="submit" className="w-full bg-barber-primary text-white font-bold py-4 rounded-full hover:bg-orange-600 transition shadow-lg mt-4">
                {editingServiceId ? 'Salvar Alterações' : 'Criar Serviço'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}