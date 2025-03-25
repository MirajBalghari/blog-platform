import { createContext, useEffect, useState, } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [authUser, setAuthUser] = useState(undefined)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return;

    const getAuth = async () => {
      await api.get('/user/profile')
        .then((res) => {
          setAuthUser(res.data.user)
          console.log(res.data.user)
        })
        .catch((err) => console.log(err))

    }
    getAuth()
  }, [localStorage.getItem('token')])


  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }} >
      {children}
    </AuthContext.Provider>
  );
};


