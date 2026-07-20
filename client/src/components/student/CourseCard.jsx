import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({course}) => {
  const {currency,calculateRating}=useContext(AppContext)
  return (
    <Link to={'/course/' + course._id} onClick={()=>scrollTo(0,0)} className='border border-gray-500/30 pb-6 overflow-hidden rounded-lg'>
        {/*<img className='w-full h-40 object-cover rounded-t-xl'src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.courseTitle)}&background=1f2937&color=ffffff&size=300&bold=true`} alt=''/>*/}
        {/*<div className='w-full bg-gradient-to-r from-purple-400 to-blue-500 p-6 text-white rounded-t-xl'>
          <h2 className='text-lg font-semibold'>{course.courseTitle}</h2>
        </div>*/}

        <div className="relative w-full h-40 overflow-hidden rounded-t-xl">
  {/* The Background Image */}
          <img 
           src={assets.thumbnail} 
           alt="Course Thumbnail Background"
           className="absolute inset-0 w-full h-full object-cover"
          />
  
  {/* The Centered Title Overlay */}
         <div className="absolute inset-0 flex items-center justify-center bg-black/10">
           <h3 className="text-white text-2xl font-bold uppercase tracking-widest drop-shadow-md text-center px-4">
            {course.courseTitle}
           </h3>
         </div>
       </div>
        <div className='p-3 text-left'>
          <h3 className='text-base font-semibold truncate'>{course.courseTitle}</h3>
          <p className='text-gray-500'>{course.educator.name}</p>
          <div className='flex items-center space-x-2'>
            <p>{calculateRating(course)}</p>
            <div className='flex'>
              {[...Array(5)].map((_,i)=>(<img key={i} src={i<Math.floor(calculateRating(course))?assets.star:assets.star_blank} alt=''/>))}
            </div>
            <p className='text-gray-500'>{course.courseRatings.length}</p>
          </div>
          <p className='text-base font-semibold text-gray-800'>{currency}{(course.coursePrice-course.discount*course.coursePrice/100).toFixed(2)}</p>
        </div>
    </Link>
  )
}

export default CourseCard