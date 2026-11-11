import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NewAppointment from './pages/NewAppointment';
import MyAppointments from './pages/MyAppointments';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/agendar" element={<NewAppointment />} />
            <Route path="/meus-agendamentos" element={<MyAppointments />} /> {/* ROTA NOVA */}
            <Route path="/admin" element={<AdminDashboard />} /> {/* ROTA DO ADMIN */}
          </Routes>
        </main>
        <Toaster position="bottom-right" toastOptions={{ className: 'dark:bg-barber-cardDark dark:text-white bg-white text-gray-900' }} />
      </div>
    </BrowserRouter>
  );
}

export default App;