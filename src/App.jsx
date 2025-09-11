import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage'
import About from './pages/aboutPage'
import Contact from './pages/contact'

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

          </Routes>
        </div>
      </BrowserRouter>


    </>
  )
}

export default App
