import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-violet-50/80 border-t border-blue-200/50 py-4'>
      <div className='flex items-center gap-4'>
        {/* <img className='hidden md:block w-20' src={assets.Learnify} alt="logo" /> */}
        <div className='hidden md:block h-7 w-px bg-blue-300/40'></div>
        <p className='py-4 text-center text-xs md:text-sm text-gray-600 font-medium'>All Rights Reserved</p>
      </div>
      <div className='flex items-center gap-3 max-md:mt-4'>
        <a href="#">
          <img src={assets.facebook_icon} alt="facebook_icon" className='opacity-70 hover:opacity-100 transition-opacity' />
        </a>
        <a href="#">
          <img src={assets.twitter_icon} alt="twitter_icon" className='opacity-70 hover:opacity-100 transition-opacity' />
        </a>
        <a href="#">
          <img src={assets.instagram_icon} alt="instagram_icon" className='opacity-70 hover:opacity-100 transition-opacity' />
        </a>
      </div>

    </footer>
  )
}

export default Footer