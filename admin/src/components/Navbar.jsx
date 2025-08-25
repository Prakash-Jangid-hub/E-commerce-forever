import React, { useContext } from 'react'
import { assets } from '../assets/admin_assets/assets'
import { AuthContext } from '../context/authContext.jsx'

const Navbar = () => {
  const {logout} = useContext(AuthContext)
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
        <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
        <button onClick={logout} className='bg-gray-600 cursor-pointer text-white px-5 py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar