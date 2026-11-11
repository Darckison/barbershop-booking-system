require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const http = require('http'); // 1. Importa o módulo http nativo do Node
const { Server } = require('socket.io'); // 2. Importa o Socket.io

// 3. Cria o servidor HTTP envolvendo o seu 'app' do Express
const server = http.createServer(app);

// 4. Configura o Socket.io com permissão (CORS) para o seu frontend
const io = new Server(server, {
  cors: {
    origin: "*", // Porta padrão do Vite (ajuste se a sua for diferente)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

// 5. Disponibiliza o 'io' globalmente no Express para usarmos nos controllers
app.set('io', io);

// Apenas para testar se a conexão está a funcionar quando ligar
io.on('connection', (socket) => {
  console.log('🟢 Painel Admin conectado em tempo real:', socket.id);
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  // 6. IMPORTANTE: Agora quem "escuta" a porta é o 'server', não o 'app'
  server.listen(PORT, () => {
    console.log(`[BarberTime API] Servidor rodando na porta ${PORT} com WebSockets ⚡`);
  });
});