import React, { useContext, useEffect, useState } from 'react'
import { BsThreeDots } from "react-icons/bs";
import AuthContext from '../context/AuthContext'
import toast from 'react-hot-toast';
import UpdatePost from './updatePost';
import api from '../services/api';
import { AiFillLike } from "react-icons/ai";
import { LiaComment } from "react-icons/lia";
import { IoSend } from "react-icons/io5";
import socket from '../services/socket';
import moment from 'moment'

function AllPost({ post }) {

  const { authUser, } = useContext(AuthContext)
  const [postId, setPostId] = useState(null)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(post?.comment || [])
  const [showComment, setShowComment] = useState(false)
  const [likes, setlikes] = useState(post?.like || [])


  const profileImage = post?.author?.profilePic ?
    post?.author?.profilePic :
    `https://i.pravatar.cc/250?u=${post?.author?._id}`





  const deltePost = async (postId) => {
    await api.delete(`/post/deletepost/${postId}`)
      .then((res) => {
        toast.success(res.data.msg)
        setTimeout(() => {
          window.location.reload()

        }, 1000);
      }).catch((err) => console.log(err))
  }


  const handleLike = async (postId) => {
    await api.get(`/post/like/${postId}`)
      .then((res) => {
        toast.success(res.data.msg)
        setlikes(res.data.post.like)
      })
      .catch((err) => console.log(err))
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) {
      toast.error('comment cannot be empty')
      return;
    }
    await api.post(`/post/comment/${post?._id}`, { content: comment })
      .then((res) => {
        setComments(res.data.post.comment)
        toast.success(res.data.msg)
      })
      .catch((err) => console.log(err))
    setComment('')
  }
  useEffect(() => {
    socket.on('updateLike', ({ postId, like }) => {
      if (postId == post?._id) {
        setlikes(like)
      }
    })
    socket.on('sendComment', ({ postId, comm }) => {
      if (postId == post?._id) {
        setComments(comm)
      }
    })
    return () => {
      socket.off('updateLike')
      socket.off('sendComment')

    }
  }, [post?._id])


  const checkLike = likes?.includes(authUser?._id)


  return (
    <div className='flex flex-col  gap-3  bg-white justify-center items-center  w-full md:mt-0 mb-2 '>
      <UpdatePost postId={postId} />

      <div className="card  border bg-base-100 border-gray-200  h-min-500 w-full p-2  shadow-sm ">
        <div className="card-body">
          <div className="flex gap-2">
            <div role="button" className="w-10 hover:cursor-pointer  rounded-full btn btn-ghost btn-circle avatar">
              <img className='rounded-full'
                src={profileImage}
                alt="profile Image"
              />
            </div>
            <div className='hover:cursor-pointer'>
              <h2 className="card-title">{post?.author?.name}</h2>
              <h5 className='-mt-1'>{moment(post?.createdAt).fromNow()}</h5>
            </div>

            {authUser?._id === post?.author?._id ?
              <div className="dropdown dropdown-end absolute top-6 right-8">
                <div tabIndex={0} role="button" className="text-xl"><BsThreeDots /></div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1  p-2 shadow-sm">
                  <li>
                    <button className="" onClick={() => { setPostId(post?._id) + document.getElementById('my_modal_5').showModal() }}>Edit</button>
                  </li>
                  <li onClick={() => deltePost(post?._id)}><button>Delete</button></li>
                </ul>
              </div> :
              <div>

              </div>

            }

          </div>
          <h2 className="card-title">{post?.title}</h2>
          <p>{post?.caption}</p>
        </div>
        <figure>
          <img className='w-full h-full md:w-full md:h-full object-cover '
            src={post?.image}
            alt={post?.title ? `${post?.title} Image` : 'Post Image'} />
        </figure>
        <div className='w-full flex justify-between my-2 '>
          <div className='flex gap-1 items-center'>
            <AiFillLike className='text-blue-600 text-xl' />
            <span>{likes?.length}</span>
          </div>
          <div className='flex gap-1 items-center'>

            <span>{comments?.length}</span>
            <h4>Comment</h4>
          </div>
        </div>
        <div className='min-h-0.5 bg-gray-700 rounded-full  w-full '></div>
        <div className='flex gap-4 items-center justify-between mx-3 my-5 '>
          <div onClick={() => handleLike(post?._id)} className={`${checkLike ? 'text-blue-600' : ''} cursor-pointer items-center flex gap-1 text-xl `}>
            <AiFillLike className='' />
            <p className='text-base'>{checkLike ? 'Liked' : 'like'}</p>
          </div>
          <div onClick={() => setShowComment(!showComment)} className='cursor-pointer items-center flex gap-1 text-xl '>
            <LiaComment className='' />
            <p className='text-base'>Comment</p>
          </div>
        </div>
        <div>
          {
            showComment &&
            <div className='flex flex-col gap-5'>
              <form onSubmit={handleComment} className='flex w-full items-center justify-center gap-2'>
                <input type="text" onChange={(e) => setComment(e.target.value)} value={comment} name='comment' placeholder='Whrite comment' className='focus:outline-none border-b-1 w-[80%] px-2 py-1' />
                <button type='submit'> <IoSend className='text-xl text-blue-600 cursor-pointer' /></button>
              </form>
              <div className='flex flex-col gap-4  w-full '>
                {
                  comments.map((com, index) => (
                    <div key={index} className='flex items-center gap-3 border-b-1 w-full shadow-md p-2'>
                      <img src={com?.user?.profilePic || `https://i.pravatar.cc/250?u=${com?.user?._id}`} alt='image' className='w-10 h-10 border border-blue-500 p-1 rounded-full' />
                      <div>
                        <h1 className='font-semibold text-base'>{com?.user?.name}</h1>
                        <p>{com?.content}</p>
                      </div>
                    </div>
                  ))
                }

              </div>
            </div>
          }
        </div>

      </div>

    </div>
  )
}

export default AllPost
