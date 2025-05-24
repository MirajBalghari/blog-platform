import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

function Login() {

  const initailuser = {
    email: '',
    password: ''
  }
  const [user, setUser] = useState(initailuser)
  const navigate = useNavigate()

  const handleInput = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post(`/user/login`, user, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then((res) => {
        toast.success(res.data.msg)
        localStorage.setItem('token', res.data.token)
        setTimeout(() => {
          window.location.reload()
        }, 1000);
        navigate('/')
      }).catch((err) => {
        if (err.response.data.msg) {
          return toast.error(err.response.data.msg)
        }
        else if (err.response.data.error.details[0].message) {
          return toast.error(err.response.data.error.details[0].message)

        }
      })
  }


  return (
    <>
      <div className="flex gap-3 flex-col mt-5 justify-center items-center">
        <h1 className="w-full text-center text-xl md:text-3xl font-bold p-1 md:p-3">Login</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center items-center gap-3 md:gap-6 mt-2 md:mt-5">

          <div className="flex gap-1 flex-col w-70 md:w-80 justify-center">
            <h3 className="font-semibold">Email</h3>
            <input onChange={handleInput} name='email' required
              className="bg-[#eee] p-2 rounded-md border-b border-gray-500 focus:outline-none focus:bg-[#ddd] placeholder:text-gray-400 placeholder:text-sm"
              type="email"
              placeholder="Forexample@gmail.com"
            />
          </div>
          <div className="flex gap-1 flex-col w-70 md:w-80 justify-center">
            <h3 className="font-semibold">Password</h3>
            <input onChange={handleInput} name='password' required
              className="bg-[#eee] p-2 rounded-md border-b border-gray-500 focus:outline-none focus:bg-[#ddd] placeholder:text-gray-400"
              type="password"
              placeholder="*****"
            />
          </div>
          <button type='submit' className="w-70 md:w-80 bg-[#019EFF] rounded-md md:text-xl p-1 md:p-2 font-semibold shadow-md mt-4">
            Login
          </button>
        </form>
        <p className="text-sm">
          Don't have an account?
          <span className="text-[#019eff] md:font-semibold">
            <Link to="/sign-up"> Sign Up</Link>
          </span>
        </p>
      </div>

    </>
  );
}

export default Login;
