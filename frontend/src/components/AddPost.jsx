import React, { useState } from 'react';
import { MdClose } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'

function AddPost() {
  const data = {
    title: '',
    caption: ''
  };

  const navigate = useNavigate();
  const [postData, setPostData] = useState(data);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const sendPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', postData.title);
    formData.append('caption', postData.caption);

    try {
      const res = await api.post('/post/addpost', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success(res.data.msg);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload post');
    }

    setPostData(data);
    setFile(null);
    setPreview(null);
  };

  return (
    <>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <div className="modal-action">
            <form method="dialog">
              <button className="btn"><MdClose /></button>
            </form>
          </div>

          <form onSubmit={sendPost}>
            <fieldset className="fieldset">

              {preview && (
                <div className="mt-3">
                  <img src={preview} alt="Post Image" className="w-32 h-32 object-cover rounded-md" />
                </div>
              )}
              <legend className="fieldset-legend">Pick a file</legend>
              <input onChange={handleFileChange} type="file" name='file' required className="file-input" />


              <legend className="fieldset-legend">Title</legend>
              <input onChange={handleInput} type="text" name='title' required className="input" placeholder="Type here" />

              <legend className="fieldset-legend">Caption</legend>
              <textarea onChange={handleInput} type="text" name='caption' className="textarea" placeholder="Captions"></textarea>
            </fieldset>

            <div className="card-actions w-full mt-5">
              <button type='submit' className="btn btn-primary"> Send <IoSend /></button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default AddPost;
