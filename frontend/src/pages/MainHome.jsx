import React from 'react'
import Topbar from '../components/Topbar'
import Home from '../components/Home'
import AddPost from '../components/AddPost'
import Profilepic from '../components/Profilepic'
import UpdatePost from '../components/updatePost'

function MainHome() {
  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:gap-4 ">
        <div className="w-full md:w-[27%] md:h-screen md:fixed md:left-0 ">
          <Topbar />
        </div>
        <div className="w-full md:w-[60%] md:flex md:ml-[30%] top-0">
          <Home />
        </div>
      </div>

      <UpdatePost />
      <AddPost />
      <Profilepic />
    </>
  )
}

export default MainHome
