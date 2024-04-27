import { Route, Routes } from 'react-router'
import TopNavigation from './Components/TopNavigation/TopNavigation'
import Portfolio from './Components/Portfolio/Portfolio'
import Sandbox from './Components/Sandbox/Sandbox'
import Contact from './Components/Contact/Contact'
import Documentation from './Components/Documentation/Documentation'

function App() {

  return (
    <Routes>
      <Route path='/' element={<TopNavigation />}>
        <Route path='portfolio' element={<Portfolio />} />
        <Route path='sandbox' element={<Sandbox />} />
        <Route path='contact' element={<Contact />} />
        <Route path='documentation' element={<Documentation />} />
      </Route>
    </Routes>
  )
};

export default App
