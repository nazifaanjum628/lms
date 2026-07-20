import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Footer'

const Educator = () => {
  return (
    <div className='text-default min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-violet-50'>
        <Navbar/>
        <div className='flex'>
          <Sidebar/>
          <div className='flex-1 bg-gradient-to-br from-blue-50 via-purple-50 to-violet-50'>
            {<Outlet/>}
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Educator