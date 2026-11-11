import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { CheckCircleIcon, ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function NewAppointment() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    api.get('/services')
      .then(res => setServices(res.data))
      .catch(() => toast.error('Erro ao carregar serviços'));
    
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    if (selectedService && selectedDate && user) {
      api.get(`/appointments/available-slots?date=${selectedDate}&serviceId=${selectedService._id}`)
        .then(res => {
          if (res.data.isOperational) {
            setAvailableSlots(res.data.slots);
          } else {
            setAvailableSlots([]);
            toast.error(res.data.reason || 'Barbearia fechada nesta data.');
          }
          setSelectedTime('');
        })
        .catch(() => toast.error('Erro ao buscar horários livres'));
    }
  }, [selectedService, selectedDate, user]);

  const handleBooking = async () => {
    try {
      await api.post('/appointments', {
        serviceId: selectedService._id,
        date: selectedDate,
        startTime: selectedTime,
        notes
      });
      toast.success('Agendamento confirmado com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao agendar.');
      if (error.response?.status === 409) {
        setStep(2);
        setSelectedTime('');
      }
    }
  };

  const handleServiceClick = (service) => {
    if (!user) {
      toast('Faça login ou crie uma conta para agendar este serviço!', { icon: '🔒' });
      navigate('/login');
      return;
    }
    setSelectedService(service);
    setStep(2);
  };

  const nextDays = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      full: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''),
      dayNum: d.getDate()
    };
  });

  if (authLoading) return null;

  return (
    <div className="max-w-4xl mx-auto w-full px-2">
      {step > 1 && (
        <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-gray-500 hover:text-barber-primary mb-8 transition font-medium">
          <ArrowLeftIcon className="w-5 h-5" /> Voltar
        </button>
      )}

      {/* PASSO 1: SERVIÇOS (Aberto a todos com visual PREMIUM) */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Cabeçalho centralizado e elegante */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
              O que vamos <span className="text-barber-primary">fazer hoje?</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
              Krattos Barber – Estilo, atitude e personalidade
            </p>
          </div>

          {/* Grid de Serviços Aprimorada */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map(service => (
              <div 
                key={service._id}
                onClick={() => handleServiceClick(service)}
                className="group relative bg-white dark:bg-barber-cardDark border border-gray-100 dark:border-gray-800 p-8 rounded-[2rem] cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-barber-primary dark:hover:border-barber-primary hover:shadow-[0_20px_40px_rgba(255,107,0,0.1)]"
              >
                {/* Efeito de luz de fundo no hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent dark:from-orange-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-barber-primary transition-colors leading-tight">
                        {service.name}
                      </h3>
                      {/* Preço dentro de uma "tag" bonita */}
                      <span className="bg-orange-50 dark:bg-orange-500/10 text-barber-primary font-black px-4 py-1.5 rounded-full text-lg whitespace-nowrap border border-orange-100 dark:border-orange-500/20">
                        R$ {service.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-base mb-8 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Rodapé do cartão com linha de detalhe estendida */}
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-auto">
                    <ClockIcon className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-barber-primary transition-colors" /> 
                    <span className="group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{service.durationMinutes} min</span>
                    <div className="flex-grow border-b border-gray-100 dark:border-gray-800 ml-3 group-hover:border-barber-primary/30 transition-colors"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PASSO 2: DATA E HORA */}
      {step === 2 && selectedService && user && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Escolha a data e hora</h2>
            <p className="text-gray-500">Para o serviço: <strong className="text-barber-primary text-lg">{selectedService.name}</strong></p>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-6 mb-8 scrollbar-hide snap-x">
            {nextDays.map((dateObj) => {
              const isSelected = selectedDate === dateObj.full;
              return (
                <div 
                  key={dateObj.full}
                  onClick={() => setSelectedDate(dateObj.full)}
                  className={`snap-center flex flex-col items-center justify-center min-w-[80px] h-24 rounded-3xl cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'bg-barber-primary text-white shadow-[0_10px_25px_rgba(255,107,0,0.4)] scale-105' 
                      : 'bg-white dark:bg-barber-cardDark text-gray-500 border border-gray-100 dark:border-gray-800 hover:border-barber-primary hover:text-barber-primary'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider mb-1">{dateObj.dayName}</span>
                  <span className="text-2xl font-black">{dateObj.dayNum}</span>
                </div>
              );
            })}
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Horários Disponíveis</h3>
          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-10">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    !slot.available 
                      ? 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 line-through cursor-not-allowed border border-transparent'
                      : selectedTime === slot.time
                        ? 'bg-barber-primary text-white shadow-[0_8px_20px_rgba(255,107,0,0.4)] scale-105 border border-barber-primary'
                        : 'bg-white dark:bg-barber-cardDark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-barber-primary hover:text-barber-primary'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/10 text-red-500 p-6 rounded-3xl mb-10 border border-red-100 dark:border-red-900/30 text-center font-medium">
              Não há horários disponíveis para esta data. Escolha outro dia!
            </div>
          )}

          <button 
            disabled={!selectedTime}
            onClick={() => setStep(3)}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black py-5 rounded-full hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl"
          >
            Continuar para Confirmação
          </button>
        </div>
      )}

      {/* PASSO 3: CONFIRMAÇÃO */}
      {step === 3 && selectedService && user && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="bg-orange-50 dark:bg-orange-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-12 h-12 text-barber-primary" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Quase lá!</h2>
            <p className="text-gray-500">Revise os dados do seu agendamento.</p>
          </div>

          <div className="bg-white dark:bg-barber-cardDark border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-xl mb-8 relative overflow-hidden">
            {/* Detalhe de design no canto do card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-barber-primary/5 rounded-bl-full pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-800 relative z-10">
              <span className="text-gray-500 font-medium">Serviço</span>
              <span className="font-bold text-gray-900 dark:text-white text-right">{selectedService.name}</span>
            </div>
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-800 relative z-10">
              <span className="text-gray-500 font-medium">Data</span>
              <span className="font-bold text-gray-900 dark:text-white text-right">{selectedDate.split('-').reverse().join('/')}</span>
            </div>
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-800 relative z-10">
              <span className="text-gray-500 font-medium">Hora</span>
              <span className="font-bold text-gray-900 dark:text-white text-right text-lg">{selectedTime}</span>
            </div>
            <div className="flex justify-between items-center relative z-10">
              <span className="text-gray-500 font-medium">Total a Pagar</span>
              <span className="font-black text-2xl text-barber-primary">R$ {selectedService.price.toFixed(2)}</span>
            </div>
          </div>

          <textarea
            placeholder="Deixe uma observação para o barbeiro... (Opcional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-white dark:bg-barber-cardDark border border-gray-200 dark:border-gray-700 rounded-3xl p-6 text-gray-900 dark:text-white focus:border-barber-primary focus:ring-1 focus:ring-barber-primary outline-none mb-8 resize-none shadow-sm transition-all"
            rows="3"
          ></textarea>

          <button 
            onClick={handleBooking}
            className="w-full bg-barber-primary text-white font-black py-5 rounded-full hover:bg-orange-600 hover:scale-[1.02] transition-all duration-300 shadow-[0_10px_30px_rgba(255,107,0,0.4)]"
          >
            Confirmar e Agendar
          </button>
        </div>
      )}
    </div>
  );
}