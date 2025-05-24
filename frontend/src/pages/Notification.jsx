import React, { useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { RxCross2 } from 'react-icons/rx'
import api from '../services/api'
import {toast} from 'react-hot-toast'
import Topbar from '../components/Topbar'
function Notification() {

  const {notification , } = useContext(AuthContext)

  const handleNotificationMsg=(type)=>{
    if(type =='like'){
      return 'Liked your post'
    }else if(type =='comment'){
      return 'Commented on your post'
    }

  }

  const deleteOneNotification=async(id)=>{
    await api.delete(`/notification/deleteOne/${id}`)
    .then((res)=>{
      toast.success(res.data.msg)
    })
    .catch((err)=>console.log(err))
  }

  const cleanAllNotification=async()=>{
    await api.delete(`/notification/delete`)
    .then((res)=>{
      toast.success(res.data.msg)
    })
    .catch((err)=>console.log(err))
  }
  
  return (
    <div className='w-full h-[100vh] bg-gray-200 flex flex-col relative'>
    <Topbar/>
    <div className='w-full justify-center  flex gap-2  flex-col mt-17 '>
    <h1 className='  text-xl font-bold bg-white p-2 md:w-[70%] w-full flex items-center justify-between md:mx-auto '>{ `Notification(${notification?.length})` } {notification.length >0 && <button onClick={()=>cleanAllNotification()} className='border cursor-pointer border-red-600 rounded-full  text-red-600 font-semibold px-2 py-1 flex items-center justify-center gap-2 text-center'>Clean All</button>}</h1>

      {
        notification?.length >0 &&
      
   <div className=' flex flex-col h-[70vh] overflow-auto bg-white   md:w-[70%] w-full md:mx-auto gap-2'>   {
     
    notification?.map((noti,index)=>(
      <div key={index} className='relative flex items-center h-min-50 bg-white hover:bg-gray-100 border-b-1 border-gray-300 shadow-md p-2 '>
      <div className=' flex items-start gap-2'>
      <img src={noti?.relatedUser?.profilePic || `https://i.pravatar.cc/250?u=${noti?.relatedUser?._id}`} alt="/profile" className='w-13 h-13 border border-gray-500 p-1 rounded-full object-cover ' />
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-1'>
        <h1 className=' font-semibold'>{noti?.relatedUser?.name}</h1>
        <h1>{handleNotificationMsg(noti.type)}</h1>
        </div>
        <div className='flex gap-2'>
      {noti?.relatedPost?.image && <img src={noti?.relatedPost?.image } alt="/profile" className='w-15 h-15  object-cover ' /> }
       <h1>{noti?.relatedPost?.content}</h1>
        </div>

       
      </div>
      </div>
    <RxCross2 onClick={()=>deleteOneNotification(noti?._id)} className='absolute top-2  right-2 text-xl  cursor-pointer hover:text-red-500 opacity-100 z-50' />
      
         
    </div>
    ))
    
    
    }

  
 </div>
}
        
       </div>
   
  </div>
  )
}

export default Notification

