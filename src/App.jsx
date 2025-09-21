// App.jsx
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LustreToaster } from './components/lustreToaster'

import HomePage from './pages/homePage'
import About from './pages/aboutPage'
import Contact from './pages/contact'
import DateAndTimeSelect from './pages/dateAndTimeSelect'
import Appointment from './pages/appointment'
import Register from './pages/register'
import Login from './pages/login'
import ResetPassword from './pages/resetPassword'
import ForgotPassword from './pages/forgotPassword'
import NotFoundPage from './pages/notFoundPage'
import AdminPage from './pages/adminPage'
import User from './pages/user'

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="w-full min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/dateAndTimeSelect" element={<DateAndTimeSelect />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/user" element={<User />} />


            <Route path="/admin/*" element={<AdminPage />} />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>

      {/* Custom Toaster */}
      <LustreToaster />
    </>
  )
}

export default App
