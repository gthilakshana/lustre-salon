import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/homePage'

function App() {


  return (
    <>

      <BrowserRouter>
        <div className="w-full h-[100vh]">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </BrowserRouter>


    </>
  )
}

export default App
