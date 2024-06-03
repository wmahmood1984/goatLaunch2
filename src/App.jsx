import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router'
import Home from './components/Home'
import Admin from './components/Admin'
import Add from './components/Add'
import Details from './components/Details'
import { ToastContainer } from 'react-toastify'
import Sidebar from './components/Sidebar'
import LeaderBoard from './components/LeaderBoard'



export default function App() {

  const [selected, setSelected] = useState(0);


  return (
  <div>
          <ToastContainer />
      <Sidebar selected={selected} setSelected={setSelected} />
    <Routes>
      <Route path='leaderboard' element={<LeaderBoard/>}></Route>
      <Route
          path="add"
          element={<Add selected={selected} setSelected={setSelected} />}
        ></Route>
        <Route path="adminpanel" element={<Admin />}></Route>
        <Route path="details/:id" element={<Details />}></Route>
        <Route path='/' element={<Home/>}>
      </Route>
    </Routes>

  </div>
  

)
}

