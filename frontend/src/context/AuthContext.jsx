import { createContext, useEffect, useState, } from 'react';
import api from '../services/api';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [authUser, setAuthUser] = useState(undefined)
  const [posts, setpost] = useState([])
  const [notification, setNotification] = useState([])
  const [allUser, setAllUser] = useState([])

  const profileImage = authUser?.profilePic ?
    authUser?.profilePic :
    `https://i.pravatar.cc/250?u=${authUser?._id}`


  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return;

    const getAuth = async () => {
      await api.get('/user/profile')
        .then((res) => {
          setAuthUser(res.data.user)
        })
        .catch((err) => console.log(err))

    }


    getAuth()
  }, [])



  const getAllPost = async () => {
    await api.get('/post/getallpost')
      .then((res) => {
        setpost(res.data.post)
      }).catch((err) => console.log(err))

  }
  const getNotification = async () => {
    await api.get('/notification/get')
      .then((res) => {
        setNotification(res.data.notification)
      }).catch((err) => console.log(err))
  }

  const getAllUser = async () => {
    await api.get('/user/alluser')
      .then((res) => {
        setAllUser(res.data.user);

      }).catch((err) => console.log(err))
  }


  useEffect(() => {
    getAllPost()
    getAllUser()
        getNotification()

  }, [])




  return (
    <AuthContext.Provider value={{ authUser, allUser, setAuthUser, profileImage, notification, posts, setpost, getAllPost }} >
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext