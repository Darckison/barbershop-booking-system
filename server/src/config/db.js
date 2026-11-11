const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[MongoDB] Conectado com sucesso: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Erro ao conectar: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;