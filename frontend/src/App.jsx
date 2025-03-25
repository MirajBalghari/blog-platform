import React, { useContext } from 'react'
import { Routes ,Route, Navigate} from 'react-router-dom'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { AuthContext } from './context/AuthContext'
import MainHome from './pages/MainHome'

function App() {
  const {authUser} = useContext(AuthContext)
  return (
    <div>
      <Routes>
        <Route path='/sign-up' element={authUser? <Navigate to={'/'}/>:<SignUp/>}/>
        <Route path='/login' element={authUser?<Navigate to={'/'}/>:<Login/>}/>
        <Route path='/' element={authUser?<MainHome/>:<Navigate to={'/login'}/>}/>

        <Route path='*' element={<h1 className='text-red-500 text-xl'>404 Page not found</h1>}/>

      </Routes>
    </div>
  )
}

export default App



// import React from 'react'
// import { Routes ,Route, } from 'react-router-dom'
// import SignUp from './pages/SignUp'
// import Login from './pages/Login'
// import Home from './pages/Home'
// function App() {
//   return (
//     <div>
//       <Routes>
//         <Route path='/sign-up' element={<SignUp/>}/>
//         <Route path='/login' element={<Login/>}/>
//         <Route path='/' element={<Home/>}/>
//         <Route path='*' element={<h1 className='text-red-500 text-xl'>Page not found</h1>}/>

//       </Routes>
//     </div>
//   )
// }

// export default App
