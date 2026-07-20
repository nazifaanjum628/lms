import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import {UserButton,useUser} from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const educatorData=dummyEducatorData
  const {user}=useUser()
  return (
    <div className='flex items-center justify-between px-4 md:px-8 bg-gradient-to-r from-blue-50 via-purple-50 to-violet-50 border-b border-blue-200/50 py-4 shadow-sm'>
      <Link to='/'>
  <span className='text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-700 via-violet-700 to-purple-700 bg-clip-text text-transparent tracking-tight'>
    Learnify
  </span>
</Link>
      {/*<Link to='/'>
        <img src={assets.Learnify} alt="logo" className='w-28 lg:w-32' />
        </Link>*/}
        <div className='flex items-center gap-5 text-gray-600 relative font-medium'>
          <p className='hidden sm:block'>Hi! {user?user.fullName:'Developers'}</p>
          {user?<UserButton/>:<img className='max-w-8' src={assets.profile_img}/>}
        </div>
    </div>
  )
}

export default Navbar