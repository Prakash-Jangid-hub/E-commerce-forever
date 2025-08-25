import axios from 'axios'
import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const Signup = () => {

    const { backendUrl, navigate, setToken } = useContext(ShopContext)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const formSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${backendUrl}/user/register`, {
                name,
                email,
                password
            }, {
                withCredentials: true
            })

            navigate("/")
            setToken(response.data.token)
            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={formSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 '>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>Signup</p>
                <hr className='prata-regular border-none h-[1.5px] w-8 bg-gray-800' />
            </div>

            <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />

            <div className='w-full flex justify-between text-sm mt-[-8px]'>
                <p className='cursor-pointer'>Forgot your password?</p>
                <p onClick={() => navigate("/login")} className='cursor-pointer'>Login Here</p>
            </div>

            <button type='submit' className='cursor-pointer bg-black text-white font-light px-8 py-2 mt-4'>Signup</button>

        </form>
    )
}

export default Signup