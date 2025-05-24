import React, { useContext } from 'react'
import AllPost from './AllPost';
import AuthContext from '../context/AuthContext';
import { useEffect } from 'react';
import socket from '../services/socket';


function Home() {

  const { posts, authUser } = useContext(AuthContext)

  useEffect(() => {
    socket.emit('register', authUser?._id)

  }, [authUser?._id])





  return (
    <div>
      {
        posts.length > 0 &&
        <div>
          {
            posts?.map((post, index) => (

              <AllPost key={index} post={post} />

            ))
          }
        </div>
      }
    </div>
  )
}

export default Home




