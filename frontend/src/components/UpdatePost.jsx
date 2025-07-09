import React, { useEffect, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { MdClose } from "react-icons/md";
import toast from 'react-hot-toast';
import api from '../services/api';


function UpdatePost({ postId }) {
  const [postData, setPostData] = useState({
    title: '',
    caption: '',
    image: ''
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [Addpreview, setAddPreview] = useState(null);

  useEffect(() => {
    if (postId) {
      const getOnePost = async () => {
        try {
          const res = await api.get(`/post/getonepost/${postId}`);
          // console.log(res)

          if (res.data.post) {
            setPostData({
              title: res.data.post.title,
              caption: res.data.post.caption,
              image: res.data.post.image
            });

            if (res.data.post.image) {
              setPreview(res.data.post.image);
            }
          }
        } catch (err) {
          console.error(err);
          toast.error('Failed to fetch post data');
        }
      };

      getOnePost();
    }
  }, [postId]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
  };

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAddPreview(URL.createObjectURL(selectedFile));
    }
  };

  const submitUpdatePost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('title', postData.title);
    formData.append('caption', postData.caption);

    try {
      const res = await api.put(`/post/updatepost/${postId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success(res.data.msg);
      setTimeout(() => {
        window.location.reload();

      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update post');
    }
  };


  return (
    <>
      <dialog id="my_modal_5" className="modal">
        <div className="modal-box">
          <div className="modal-action">
            <form method="dialog">
              <button className="btn"><MdClose /></button>
            </form>
          </div>

          <form onSubmit={submitUpdatePost}>
            <fieldset className="fieldset">

              {Addpreview ? (
                <div className="mt-3">
                  <img src={Addpreview} alt="New Post Image" className="w-32 h-32 object-cover rounded-md" />
                </div>
              ) : preview ? (
                <div className="mt-3">
                  <img src={preview} alt="Old Post Image" className="w-32 h-32 object-cover rounded-md" />
                </div>
              ) : null}

              <legend className="fieldset-legend">Pick a file</legend>
              <input type="file" className="file-input" name='image' onChange={handleFile} />

              <legend className="fieldset-legend">Title</legend>
              <input type="text" className="input" placeholder="Type here" name='title' value={postData.title} onChange={handleInput} required />

              <legend className="fieldset-legend">Caption</legend>
              <textarea className="textarea" placeholder="Captions" name='caption' value={postData.caption} onChange={handleInput} required></textarea>
            </fieldset>

            <div className="card-actions w-full mt-5">
              <button type="submit" className="btn btn-primary"> Send <IoSend /></button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default UpdatePost;
