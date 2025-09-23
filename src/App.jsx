import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LustreToaster } from './components/lustreToaster'
import Appointment from './pages/appointment'
import HomePage from './pages/homePage'
import About from './pages/aboutPage'
import Contact from './pages/contact'
import Register from './pages/register'
import DateAndTimeSelect from './pages/dateAndTimeSelect'
import Login from './pages/login'
import ResetPassword from './pages/resetPassword'
import ForgotPassword from './pages/forgotPassword'
import Success from './pages/success'
import NotFoundPage from './pages/notFoundPage'
import AdminPage from './pages/adminPage'
import User from './pages/user'

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="w-full min-h-screen">
          <Routes>
            {/* Home Sections */}
            <Route path="/" element={<HomePage section="home" />} />
            <Route path="/pricing" element={<HomePage section="pricing" />} />
            <Route path="/services" element={<HomePage section="services" />} />
            <Route path="/products" element={<HomePage section="products" />} />
            <Route path="/team" element={<HomePage section="team" />} />
            <Route path="/reviews" element={<HomePage section="reviews" />} />

            {/* Other Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/user" element={<User />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/success" element={<Success />} />
            <Route path="/dateAndTimeSelect" element={<DateAndTimeSelect />} />


            {/* Admin */}
            <Route path="/admin/*" element={<AdminPage />} />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>

      <LustreToaster />
    </>
  )
}

export default App
