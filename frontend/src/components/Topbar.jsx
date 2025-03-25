import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { MdHome } from "react-icons/md";
import { IoCreateSharp } from "react-icons/io5";

import api from '../services/api';
import { baseUrl } from '../services/url';


function Topbar() {

  const { authUser } = useContext(AuthContext)

  const profilePic = authUser.profilePic ?
    `${baseUrl}${authUser.profilePic}` :
    `https://i.pravatar.cc/250?u=${authUser._id}`


  const logout = async () => {
    try {
      const res = await api.get('/user/logout');
      console.log(res.data);
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
    <div className="flex md:flex-col  md:w-full  md:h-screen h-16 items-center bg-[#eee] shadow-md md:static fixed top-0 left-0 right-0 z-50">
      <div className="flex-1 md:flex md:gap-4 md:flex-col md:mt-5 md:w-90">
        <Link to={'/'} className="btn btn-ghost   text-xl"><MdHome className='mt-0.5' />Home</Link>
        <button className="btn btn-ghost  text-xl " onClick={() => document.getElementById('my_modal_1').showModal()}><IoCreateSharp />Create</button>
      </div>
      <button className="mr-8 md:mx-3 " onClick={() => document.getElementById('my_modal_3').showModal()}>

        <div className="w-10 md:w-[100%] rounded-full">
          <div className="ring-primary hover:ring-green-500 md:h-50 h-10 w-10  md:w-50 ring-offset-base-100 rounded-full ring ring-offset-2">
            <img src={profilePic} alt='Profile Image'
              className="w-full h-full object-cover rounded-full" />
          </div>
        </div>
      </button>
      <div className='hidden md:block md:mx-3 text-center'>
        <h1 className=' md:my-3 md:text-2xl md:font-bold'>{authUser.name}</h1>
        <h1 className='text-xl font-bold'>{authUser.email}</h1>

      </div>
      <button onClick={logout} className="btn hidden md:block md:my-3 btn-primary md:mb-10 md:mt-6 w-[40%]">Logout</button>

    </div>

  )
}

export default Topbar
