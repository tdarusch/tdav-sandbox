import { useState } from 'react'
import { Route, Routes } from 'react-router'
import TopNavigation from './Components/TopNavigation/TopNavigation'
import Home from './Components/Home/Home'
import Portfolio from './Components/Portfolio/Portfolio'
import Sandbox from './Components/Sandbox/Sandbox'
import Contact from './Components/Contact/Contact'

function App() {

  return (
    <Routes>
      <Route path='/' element={<TopNavigation />}>
        <Route path='portfolio' element={<Portfolio />} />
        <Route path='sandbox' element={<Sandbox />} />
        <Route path='contact' element={<Contact />} />
      </Route>
    </Routes>
  )
};

export default App
