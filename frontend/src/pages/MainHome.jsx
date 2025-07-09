import React, { useContext } from 'react'
import Topbar from '../components/Topbar'
import Home from '../components/Home'
import AddPost from '../components/AddPost'
import Profilepic from '../components/Profilepic'
import UpdatePost from '../components/updatePost'
import AuthContext from '../context/AuthContext'
import toast from 'react-hot-toast'
import api from '../services/api'

function MainHome() {


  const { authUser, profileImage, allUser } = useContext(AuthContext)

  const logout = async () => {
    try {
      const res = await api.get('/user/logout');
      // console.log(res.data);
      localStorage.clear('token')
      setTimeout(() => {
        window.location.reload()
      }, 1500);
      toast.success(res.data.msg)
    } catch (err) {
      console.error("Error fetching profile:", err);
    }

  }


  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:gap-3 w-full bg-gray-100">
        <Topbar />

        <div className='md:w-[25%] hidden md:block w-full  bg-white min-h-90  mt-17 p-2'>

          <img src={profileImage} alt="/profile" className='w-30 h-30  rounded-full object-cover mx-auto' />
          <div className='mt-5 flex flex-col gap-2 w-full  justify-center'>
            <div className='mt-5 ml-5'>
              <h1 className='font-bold text-xl  text-blue-600'>{authUser?.name} </h1>
              <h1>{authUser?.email}</h1>

            </div>
            <button onClick={() => logout()} className='border cursor-pointer border-blue-600 rounded-full w-[90%] mx-auto text-blue-600 font-semibold p-2 flex items-center justify-center gap-2 text-center'>LogOut </button>

          </div>



        </div>
        <div className="w-full md:w-[50%] md:flex  mt-17">
          <Home />
        </div>
        <div className="w-full hidden md:flex flex-col md:w-[25%]   mt-17 bg-white min-h-100">
          <h1 className='font-semibold text-xl bg-gray-300 p-1 '> Users : {allUser?.length}</h1>

          <div className='flex flex-col gap-2 mt-2'>
            {
              allUser?.map((user, index) => (
                <div key={index} className='flex  hover:cursor-pointer items-center p-2 border-b-1 gap-2  border-gray-300 w-full  hover:bg-gray-200'>
                  <img src={user?.profilePic || `https://i.pravatar.cc/250?u=${user?._id}`} alt="/profile" className='w-10 h-10 rounded-full object-cover ' />
                  <div className=' flex flex-col  justify-center'>
                    <h1 className='font-semibold ' >{user?.name}</h1>
                    <h5 className='text-xs -mt-1 '>{user?.email}</h5>
                  </div>
                </div>
              ))


            }

          </div>
        </div>
      </div>

      <UpdatePost />
      <AddPost />
      <Profilepic />
    </>
  )
}

export default MainHome
