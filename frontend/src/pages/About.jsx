import React from 'react'
import Title from "../components/Title"
import { assets } from '../assets/frontend_assets/assets'
import NewsLetter from "../components/NewsLetter"

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={"US"} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus maiores nemo ea quasi, eaque officia maxime itaque quia libero. Magni recusandae mollitia ducimus ea reiciendis quod nemo excepturi rem eum?</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore placeat vitae aperiam odit. Rem ut ab nihil? Officia beatae omnis possimus libero ut saepe, dolore incidunt laboriosam sequi dignissimos voluptates?</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem possimus ex facilis impedit quidem esse unde ipsam voluptatibus a! Quod!</p>
        </div>
      </div>

      <div className='text-xl py-4 '>
        <Title text1={'WHY'} text2={'CHOOSE US'}/>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequatur voluptatibus quis perspiciatis repellendus incidunt fugiat.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. At veniam vero accusamus sapiente eum explicabo.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Execptional Customer Service:</b>
          <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus quam illum molestiae in aperiam unde!</p>
        </div>
      </div>
      <NewsLetter/>

    </div>
  )
}

export default About