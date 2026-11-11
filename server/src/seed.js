require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Service = require('./models/Service');
const Availability = require('./models/Availability');
const Appointment = require('./models/Appointment');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Limpando banco...');
    await User.deleteMany({});
    await Service.deleteMany({});
    await Availability.deleteMany({});
    await Appointment.deleteMany({});

    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const userPassword = await bcrypt.hash('Cliente@123', 10);

    await User.create({ name: 'Admin', email: 'admin@barber.com', phone: '95999990001', password: adminPassword, role: 'admin' });
    await User.create({ name: 'Cliente', email: 'cliente@teste.com', phone: '95999990002', password: userPassword, role: 'user' });

    // NOVOS SERVIÇOS DA KRATTOS BARBER
    await Service.insertMany([
      { name: 'Corte masculino', description: 'Corte tradicional com acabamento perfeito.', durationMinutes: 30, price: 40.0, active: true },
      { name: 'Degradê (Fade)', description: 'Corte com transição suave e design moderno.', durationMinutes: 40, price: 45.0, active: true },
      { name: 'Corte na tesoura', description: 'Corte 100% na tesoura para maior controle de volume e caimento.', durationMinutes: 45, price: 50.0, active: true },
      { name: 'Barba completa', description: 'Modelagem completa com toalha quente e navalha.', durationMinutes: 30, price: 35.0, active: true },
      { name: 'Desenho e acabamento de barba', description: 'Alinhamento rápido das linhas do pescoço e bochechas.', durationMinutes: 15, price: 20.0, active: true },
      { name: 'Sobrancelha', description: 'Limpeza e alinhamento na navalha.', durationMinutes: 10, price: 15.0, active: true },
      { name: 'Hidratação capilar', description: 'Tratamento profundo para fios ressecados.', durationMinutes: 20, price: 30.0, active: true },
      { name: 'Platinado e luzes', description: 'Descoloração global ou luzes no reflexo.', durationMinutes: 120, price: 120.0, active: true },
    ]);

    const defaultWorkingHours = Array.from({length: 7}, (_, i) => ({
      dayOfWeek: i, isOpen: i !== 0, openTime: '09:00', closeTime: '19:00', breakStart: '12:00', breakEnd: '13:00'
    }));

    await Availability.create({ workingHours: defaultWorkingHours, blockedDates: [], slotIntervalMinutes: 30 });

    console.log('Seed da Krattos Barber realizado com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();