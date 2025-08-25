import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetter from '../components/NewsLetter'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-20'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>54709 Wiilms Station <br />Suite 350, Washington, USA</p>
          <p className='text-gray-700'>Tel: (415) 555-0132 <br />Email: prakash@forever.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at Forever</p>
          <p className='text-gray-500'>Learn more about our team and job openings</p>
         <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white cursor-pointer transition-all duration-500'>Explore Jobs</button>

        </div>
      </div>
      <NewsLetter/>
    </div>
  )
}

export default Contact