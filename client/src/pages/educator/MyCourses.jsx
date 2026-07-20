import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const MyCourses = () => {

  const navigate = useNavigate();

  const {currency, backendUrl, isEducator, getToken}=useContext(AppContext)
  const [courses,setCourses]=useState(null)
  const fetchEducatorCourses=async()=>{
    try {
      const token=await getToken()
      const {data}=await axios.get(backendUrl+'/api/educator/courses', {headers:{Authorization:`Bearer ${token}`}})

      data.success && setCourses(data.courses)
    
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    if(isEducator){
    fetchEducatorCourses()
    }
  },[isEducator])

  return courses ? (
  <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-violet-50 flex flex-col items-start md:p-8 p-4 font-sans animate-in fade-in duration-500'>
    
    <div className='w-full max-w-5xl mx-auto'>
      {/* Header Section */}
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-700 via-violet-700 to-purple-700 bg-clip-text text-transparent'>My Courses</h2>
          <p className='text-sm text-gray-600 mt-2 font-medium'>View and manage your published course portfolio.</p>
        </div>
        <button 
          onClick={() => navigate('/educator/add-course')}
          className='bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 hover:from-blue-700 hover:via-violet-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95'
        >
          + Add New Course
        </button>
      </div>

      {/* Table Container */}
      <div className='bg-white shadow-2xl rounded-2xl border border-blue-100/50 overflow-hidden w-full backdrop-blur-sm bg-opacity-95'>
        <div className='bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 h-1'></div>
        <table className='w-full text-left border-collapse'>
          <thead className='bg-gradient-to-r from-blue-50/80 to-violet-50/80 border-b border-blue-100'>
            <tr className='text-gray-700 text-xs font-bold uppercase tracking-wider'>
              <th className='px-6 py-4'>All Courses</th>
              <th className='px-6 py-4'>Earnings</th>
              <th className='px-6 py-4'>Students</th>
              <th className='px-6 py-4'>Published On</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-blue-50'>
            {courses.map((course) => (
              <tr key={course._id} className='hover:bg-gradient-to-r hover:from-blue-100/60 hover:to-violet-100/60 transition-colors group'>
                <td 
                  onClick={() => navigate(`/educator/course/${course._id}`)} 
                  className='px-6 py-4 flex items-center gap-4 cursor-pointer'
                >
                  {/* Original Thumbnail Logic */}
                  <div className="relative w-28 sm:w-36 aspect-video overflow-hidden rounded-lg shadow-md flex-shrink-0 hidden md:block bg-gradient-to-br from-blue-200 to-violet-200 border border-blue-100">
                    <img 
                      src={assets.thumbnail} 
                      alt="" 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-2 bg-gradient-to-t from-black/40 to-transparent">
                      <p className="text-white text-[9px] sm:text-[11px] font-bold uppercase tracking-tight text-center leading-[1.2] break-words whitespace-normal">
                        {course.courseTitle}
                      </p>
                    </div>
                  </div>

                  <div className='flex-1 min-w-0'>
                    <p className='font-semibold text-gray-800 group-hover:text-violet-700 transition-colors whitespace-normal break-words'>
                      {course.courseTitle}
                    </p>
                  </div>
                </td>

                <td className='px-6 py-4'>
                  <span className='font-medium text-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1 rounded-full border border-green-200'>
                    {currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - (course.discount * course.coursePrice / 100)))}
                  </span>
                </td>

                <td className='px-6 py-4'>
                  <span className='text-gray-700 font-medium bg-gradient-to-r from-blue-50 to-violet-50 px-3 py-1 rounded-full border border-blue-200'>{course.enrolledStudents.length}</span>
                </td>

                <td className='px-6 py-4 text-sm text-gray-600 font-medium'>
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {courses.length === 0 && (
          <div className='p-16 text-center text-gray-400 font-medium'>
            No courses found.
          </div>
        )}
      </div>
    </div>
  </div>
) : <Loading />


  {/*return courses?(
    <div className='h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
        <div className='w-full'>
          <h2 className='pb-4 text-lg font-medium'>My Courses</h2>
          <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
            <table className='md:table-auto table-fixed w-full overflow-hidden'>
              <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
              <tr>
                <th className='px-4 py-3 font-semibold truncate'>All Courses</th>
                <th className='px-4 py-3 font-semibold truncate'>Earnings</th>
                <th className='px-4 py-3 font-semibold truncate'>Students</th>
                <th className='px-4 py-3 font-semibold truncate'>Published On</th>
              </tr>
              </thead>
              <tbody className='text-sm text-gray-500'>
  {courses.map((course) => (
    <tr key={course._id} className='border-b border-gray-500/20'>
      <td 
  onClick={() => navigate(`/player/${course._id}`)} 
  className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-4 cursor-pointer group'
>
  {/* 1. Larger, flexible-height thumbnail */}
  {/*<div className="relative w-28 sm:w-36 aspect-video overflow-hidden rounded shadow-md flex-shrink-0 hidden md:block">
    <img 
      src={assets.thumbnail} 
      alt="" 
      className="absolute inset-0 w-full h-full object-cover" 
    />
    
    {/* 2. Flex-col container that allows text to stack vertically */}
    {/*<div className="absolute inset-0 flex items-center justify-center p-2 bg-black/10">
      <p className="text-white text-[9px] sm:text-[11px] font-bold uppercase tracking-tight text-center leading-[1.2] break-words whitespace-normal overflow-visible">
        {course.courseTitle}
      </p>
    </div>
  </div>

  {/* 3. Main Title - Also set to wrap instead of truncate */}
  {/*<div className='flex-1 min-w-0'>
    <p className='font-medium text-gray-800 group-hover:text-blue-600 transition-colors whitespace-normal break-words'>
      {course.courseTitle}
    </p>
  </div>
</td>

      



        {/* Main Course Title Text */}
        

      {/*<td className='px-4 py-3'>
        {currency} {Math.floor(course.enrolledStudents.length * (course.coursePrice - (course.discount * course.coursePrice / 100)))}
      </td>
      <td className='px-4 py-3'>{course.enrolledStudents.length}</td>
      <td className='px-4 py-3'>{new Date(course.createdAt).toLocaleDateString()}</td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        </div>
    </div>
  ): <Loading/>*/}
}

export default MyCourses