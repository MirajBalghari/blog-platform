import React, { useContext } from 'react'
import { Routes ,Route, Navigate} from 'react-router-dom'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import  AuthContext  from './context/AuthContext'
import MainHome from './pages/MainHome'
import Notification from './pages/Notification'

function App() {
  const {authUser} = useContext(AuthContext)
  return (
    <div>
      <Routes>
        <Route path='/sign-up' element={authUser? <Navigate to={'/'}/>:<SignUp/>}/>
        <Route path='/login' element={authUser?<Navigate to={'/'}/>:<Login/>}/>
        <Route path='/' element={authUser?<MainHome/>:<Navigate to={'/login'}/>}/>
        <Route path='/notification' element={authUser?<Notification/>:<Navigate to={'/login'}/>}/>

        <Route path='*' element={<h1 className='text-red-500 text-xl'>404 Page not found</h1>}/>

      </Routes>
    </div>
  )
}

export default App

