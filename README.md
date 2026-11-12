# 💈 Krattos Barber - Sistema de Agendamento Full Stack

🔗 **Acesso ao Sistema em Produção:** https://barbershop-booking-system-six.vercel.app

Projeto Final de Arquitetura Web: "O Sistema Full Stack".
Uma aplicação web completa desenvolvida com arquitetura em camadas (MVC adaptado para API), comunicação cliente-servidor, persistência de dados e atualizações em tempo real.

## 🚀 Tecnologias Utilizadas

**Frontend (/client):**
- React.js (Vite)
- React Router DOM (SPA)
- Tailwind CSS (Responsividade e UI)
- Socket.io-client (WebSockets em tempo real)
- Deploy: Vercel

**Backend (/server):**
- Node.js com Express
- MongoDB com Mongoose (Persistência de dados)
- JWT e bcrypt (Autenticação e Hash de senhas)
- Socket.io (Emissão de eventos em tempo real)
- Deploy: Render

## ✨ Funcionalidades e Diferenciais
- **Controle de Acesso (AuthZ/AuthN):** Sistema de login seguro com níveis de acesso (Admin e Cliente). Senhas protegidas com Hash (bcrypt).
- **Dashboard de Gestão Dinâmico:** Painel administrativo com filtros cronológicos automatizados (Agendamentos de Hoje, Amanhã e Histórico).
- **CRUD Completo de Serviços:** Gestão total do catálogo de serviços (Create, Read, Update, Delete), incluindo preços, descrições e tempo de duração.
- **Diferencial (Bônus):** Integração com **WebSockets (Socket.io)**. Quando um cliente realiza um agendamento, o Painel de Gestão do Admin é atualizado instantaneamente com uma notificação ao vivo, sem necessidade de recarregar a página.

---

## ⚙️ Como rodar o projeto localmente

Para executar este projeto, você precisará do [Node.js](https://nodejs.org/) instalado e de uma conexão com o [MongoDB](https://www.mongodb.com/).

### 1. Clonar o repositório
```bash
git clone [https://github.com/Darckison/barbershop-booking-system.git](https://github.com/Darckison/barbershop-booking-system.git)
cd barbershop-booking-system
