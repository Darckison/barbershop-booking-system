# 💈 Krattos Barber - Sistema de Agendamento Full Stack

Projeto Final de Arquitetura Web: "O Sistema Full Stack".
Uma aplicação web completa desenvolvida com arquitetura em camadas (MVC adaptado para API), comunicação cliente-servidor, persistência de dados e atualizações em tempo real.

## 🚀 Tecnologias Utilizadas

**Frontend (/client):**
- React.js (Vite)
- React Router DOM (SPA)
- Tailwind CSS (Responsividade e UI)
- Socket.io-client (WebSockets em tempo real)

**Backend (/server):**
- Node.js com Express
- MongoDB com Mongoose (Persistência de dados)
- JWT e bcrypt (Autenticação e Hash de senhas)
- Socket.io (Emissão de eventos em tempo real)

## ✨ Funcionalidades e Diferenciais
- **Controle de Acesso (AuthZ/AuthN):** Sistema de login seguro com níveis de acesso (Admin e Cliente). A senha é armazenada com Hash (bcrypt).
- **CRUD Completo:** Gestão de serviços da barbearia exclusiva para o Admin (Create, Read, Update, Delete).
- **Diferencial (Bônus):** Integração com **WebSockets (Socket.io)**. Quando um cliente realiza um agendamento, o Painel de Gestão do Admin é atualizado instantaneamente com uma notificação ao vivo, sem necessidade de recarregar a página.

---

## ⚙️ Como rodar o projeto localmente

Para executar este projeto, você precisará do [Node.js](https://nodejs.org/) instalado em seu computador e de uma conexão com o [MongoDB](https://www.mongodb.com/).

### 1. Clonar o repositório
```bash
git clone https://github.com/Darckison/barbershop-booking-system.gi
cd barbershop-booking-system
```

### 2. Configurar e rodar o Backend
Abra um terminal e acesse a pasta do servidor:
```bash
cd server
npm install
```

Crie um arquivo `.env` na pasta `/server` com as seguintes variáveis de ambiente:
```env
PORT=5000
MONGO_URI=sua_string_de_conexao_do_mongodb_aqui
JWT_SECRET=sua_chave_secreta_super_segura_aqui
```

Inicie o servidor (ele rodará na porta 5000):
```bash
npm run dev
# ou npm start
```

### 3. Configurar e rodar o Frontend
Abra **outro** terminal e acesse a pasta do cliente:
```bash
cd client
npm install
```

Inicie a aplicação React:
```bash
npm run dev
```

Acesse o sistema no seu navegador: `http://localhost:5173`

---
**Desenvolvido por:** Darckison Almeida Trajanp e Wesley Silva Araújo
