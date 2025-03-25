import React, { useContext, useEffect, useState } from 'react'
import { BsThreeDots } from "react-icons/bs";
import { AuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast';
import UpdatePost from './updatePost';
import api from '../services/api';
import { baseUrl } from '../services/url'


function Home() {

  const { authUser } = useContext(AuthContext)
  const [posts, setpost] = useState([])
  const [postId, setPostId] = useState(null)

  useEffect(() => {
    const getAllPost = async () => {
      await api.get('/post/getallpost')
        .then((res) => {
          setpost(res.data.post)
        }).catch((err) => console.log(err))

    }
    getAllPost()



  }, [])

  const deltePost = async (postId) => {
    await api.delete(`/post/deletepost/${postId}`)
      .then((res) => {
        toast.success(res.data.msg)
        setTimeout(() => {
          window.location.reload()
          
        }, 1000);
        setpost((prevPosts) => prevPosts.filter((post) => post._id !== postId))
      }).catch((err) => console.log(err))
  }



  return (
    <div className='flex flex-col gap-3 mt-18 bg-white justify-center items-center w-full md:mt-0 mb-2 '>
      <UpdatePost postId={postId} />
      {
        posts.map((post, key) => {

          const profileImage = post.author.profilePic ?
            `${baseUrl}${post.author.profilePic}` :
            `https://i.pravatar.cc/250?u=${post.author._id}`

          return (
            <div key={key} className="card  border bg-base-100 border-gray-200  h-full w-full p-2  shadow-sm ">
              <div className="card-body">
                <div className="flex gap-2">
                  <div role="button" className="w-10 rounded-full btn btn-ghost btn-circle avatar">
                    <img className='rounded-full'
                      src={profileImage}
                      alt="profile Image"
                    />
                  </div>
                  <h2 className="card-title">{post.author.name}</h2>
                  {authUser._id === post.author._id ?
                    <div className="dropdown dropdown-end absolute top-6 right-8">
                      <div tabIndex={0} role="button" className="text-xl"><BsThreeDots /></div>
                      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1  p-2 shadow-sm">
                        <li>
                          <button className="" onClick={() => { setPostId(post._id) + document.getElementById('my_modal_5').showModal() }}>Edit</button>
                        </li>
                        <li onClick={() => deltePost(post._id)}><button>Delete</button></li>
                      </ul>
                    </div> :
                    <div>

                    </div>

                  }

                </div>
                <h2 className="card-title">{post.title}</h2>
                <p>{post.caption}</p>
              </div>
              <figure>
                <img className='w-full h-full md:w-full md:h-full object-cover '
                  src={`${baseUrl}/uploads/posts/${post.image}`}
                  alt={post.title ? `${post.title} Image` : 'Post Image'} />
              </figure>
            </div>
          )
        }
        )
      }





    </div>
  )
}

export default Home


