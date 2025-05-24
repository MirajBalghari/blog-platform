import React, { useContext, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import AuthContext from '../context/AuthContext';
import { IoMdLogOut } from "react-icons/io";
import { MdPhotoCamera } from 'react-icons/md';
import api from '../services/api';



function Profilepic() {


  const { authUser, profileImage } = useContext(AuthContext)

  const logout = async () => {
    try {
      const res = await api.get('/user/logout');

      localStorage.clear('token')
      setTimeout(() => {
        window.location.reload()
      }, 1500);
      toast.success(res.data.msg)
    } catch (err) {
      console.error("Error fetching profile:", err);
    }

  }

  const fileRef = useRef(null)

  const [image, setImage] = useState(null)
  const [prevImage, setprevImage] = useState(null)

  const handleFile = (e) => {
    const seletImage = e.target.files[0]
    if (!seletImage) return;

    if (seletImage) {
      setImage(seletImage)
      setprevImage(URL.createObjectURL(seletImage))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) {
      toast.error('Please select an image first!');
      return;
    }
    const formData = new FormData()
    formData.append('file', image)
    console.log(image)
    await api.put('/user/editprofile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => {
      toast.success(res.data.msg)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    })
      .catch((err) => console.log(err))

  }




  return (
    <>
      <dialog id="my_modal_3" className="modal ">
        <div className="modal-box md:w-90 w-80">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>

          <form onSubmit={handleSubmit} className='flex flex-col items-center gap-2' >
            <input type="file" ref={fileRef} hidden name='file ' onChange={handleFile} />
            <div onClick={() => fileRef.current.click()}
              className='relative avator cursor-pointer'>
              <div className="ring-primary hover:ring-green-500  ring-offset-base-100 h-50 w-50 rounded-full ring ring-offset-2">
                <img src={prevImage || profileImage}
                  alt='Profile Image'
                  className="w-full h-full object-cover rounded-full"

                />
              </div>
              <MdPhotoCamera className="absolute bottom-0 right-6 text-4xl  hover:bg-gray-200 bg-white p-2 rounded-full border-1" />

            </div>

            <h1 className="text-xl font-bold">{authUser.name}</h1>
            <h4>{authUser.email}</h4>
            <button type="submit" className="w-35 cursor-pointer bg-blue-500 hover:bg-blue-700 p-1 text-white rounded-lg">
              Update Profile</button>
          </form>
          <button onClick={logout} className='hover:text-blue-500 cursor-pointer'><IoMdLogOut className='absolute right-8  bottom-5 text-center text-2xl' /></button>
        </div>
      </dialog>
    </>
  )
}

export default Profilepic



