import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const {isEducator}=useContext(AppContext)
  const menuItems=[
    {name:'Dashboard', path:'/educator', icon:assets.home_icon},
    {name:'Add Course', path:'/educator/add-course', icon:assets.add_icon},
    {name:'My Courses', path:'/educator/my-courses', icon:assets.my_course_icon},
    {name:'Student Enrolled', path:'/educator/student-enrolled', icon:assets.person_tick_icon},
  ];
  return isEducator &&(
    <div className='md:w-64 w-16 border-r border-blue-200/50 min-h-screen text-base bg-gradient-to-b from-blue-50/40 via-purple-50/30 to-violet-50/40 py-2 flex flex-col'>
      {menuItems.map((item)=>(
        <NavLink
        to={item.path}
        key={item.name}
        end={item.path==='/educator'}
        className={({isActive})=>`flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 transition-all duration-200 ${isActive?'bg-gradient-to-r from-blue-100/60 to-violet-100/60 border-r-[6px] border-violet-600 shadow-sm':'hover:bg-blue-100/40 border-r-[6px] border-transparent hover:border-blue-200/60'}`}>
          <img src={item.icon} alt="" className='w-6 h-6' />
          <p className='md:block hidden text-center font-medium text-gray-700'>{item.name}</p>
        </NavLink>
      ))}
        
    </div>
  )
}

export default Sidebar