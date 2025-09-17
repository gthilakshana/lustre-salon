import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage'
import About from './pages/aboutPage'
import Contact from './pages/contact'
import DateAndTimeSelect from './pages/dateAndTimeSelect'
import Appointment from './pages/appointment'
import Register from './pages/register'
import Login from './pages/login'
import ResetPassword from './pages/resetPassword'
import ForgotPassword from './pages/forgotPassword'
import AdminPage from './pages/adminPage'
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="w-full h-[100vh]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/dateAndTimeSelect" element={<DateAndTimeSelect />} />
            <Route path="/appointment" element={<Appointment />} />
          </Routes>
        </div>
      </BrowserRouter>


      <Toaster
        position="down-right"
        toastOptions={{
          success: {
            style: { background: "#10b981", color: "white" },
          },
          error: {
            style: { background: "#ef4444", color: "white" },
          },
        }}
      />
    </>
  )
}

export default App
