require('dotenv').config();
const mongoose = require('mongoose');
const Availability = require('./models/Availability');

const seedConfig = async () => {
  // Lista com os dois bancos de dados (o local e o da nuvem)
  const bancosDeDados = [
    { nome: 'LOCAL (Seu Computador)', uri: process.env.MONGODB_URI },
    { nome: 'NUVEM (Render/Atlas)', uri: process.env.MONGODB_URI_NUVEM }
  ];

  for (const banco of bancosDeDados) {
    if (!banco.uri) {
      console.log(`⚠️ Link para o banco ${banco.nome} não encontrado no .env. Ignorando...`);
      continue;
    }

    try {
      console.log(`\n⏳ A ligar ao banco de dados: ${banco.nome}...`);
      await mongoose.connect(banco.uri);
      
      // Limpa apenas a tabela de horários
      await Availability.deleteMany({});
        
      const defaultWorkingHours = Array.from({length: 7}, (_, i) => ({
        dayOfWeek: i, 
        isOpen: i !== 0, 
        openTime: '09:00', 
        closeTime: '19:00', 
        breakStart: '12:00', 
        breakEnd: '13:00'
      }));

      await Availability.create({ 
        workingHours: defaultWorkingHours, 
        blockedDates: [], 
        slotIntervalMinutes: 30 
      });
        
      console.log(`🚀 Horários injetados com sucesso no banco: ${banco.nome}!`);
      
      // Desliga deste banco para poder conectar ao próximo
      await mongoose.disconnect();

    } catch (err) {
      console.error(`❌ Erro ao injetar no banco ${banco.nome}:`, err);
    }
  }

  console.log('\n✅ Processo concluído para todos os ambientes!');
  process.exit(0);
};

seedConfig();