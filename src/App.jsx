import Home from './pages/Home/Home'
import { Route, Routes } from 'react-router-dom'
import CampusMap from './pages/Map/CampusMap'
import Ask from './pages/Ask/Ask'
import NavigateCampus from './pages/Navigate/Navigate'
import Teachers from './pages/Teachers/Teachers'
import Rooms from './pages/Rooms/Rooms'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/campus-map' element={<CampusMap />} />
        <Route path='/ask' element={<Ask />} />
        <Route path='/teachers' element={<Teachers />} />
        <Route path='/rooms' element={<Rooms />} />
        <Route path='/navigate-campus' element={<NavigateCampus />} />

      </Routes>
    </>
  )
}

export default App
