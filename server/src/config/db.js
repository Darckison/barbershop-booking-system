const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // CORRIGIDO: Agora o nome está exatamente igual à variável do Render (MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[MongoDB] Conectado com sucesso: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Erro ao conectar: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;