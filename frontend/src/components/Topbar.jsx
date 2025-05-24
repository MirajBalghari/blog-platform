import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import { MdHome } from "react-icons/md";
import { IoCreateSharp } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";



function Topbar() {

  const { authUser, profileImage } = useContext(AuthContext)








  return (
    <div className="flex  justify-between items-center  w-full   h-16  bg-[#eee] shadow-md  fixed top-0 left-0 right-0 z-50">
      <div className="flex  justify-between items-center">
        <Link to={'/'} className="btn btn-ghost  text-2xl md:text-xl"><MdHome className='mt-0.5' /> <span className='hidden md:flex' >Home</span></Link>
        <button className="btn btn-ghost  text-2xl  md:text-xl " onClick={() => document.getElementById('my_modal_1').showModal()}><IoCreateSharp /> <span className='hidden md:flex' >Create</span></button>
        <Link to={'/notification'} className="btn btn-ghost  text-2xl  md:text-xl"><IoIosNotifications className='mt-0.5 ' /><span className='hidden md:flex'>Notification</span></Link>

      </div>
      <button className="mr-8  " onClick={() => document.getElementById('my_modal_3').showModal()}>

        <div className="w-10 rounded-full">
          <div className="ring-primary hover:ring-green-500  h-10 w-10  ring-offset-base-100 rounded-full ring ring-offset-2">
            <img src={authUser?.profilePic || profileImage} alt='Profile Image'
              className="w-full h-full object-cover rounded-full" />
          </div>
        </div>
      </button>


    </div>

  )
}

export default Topbar
