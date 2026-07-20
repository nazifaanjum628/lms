import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import {Line} from 'rc-progress'
import Footer from '../../components/student/Footer'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../../assets/assets'

const MyEnrollments = () => {

  const {enrolledCourses, calculateCourseDuration, navigate, userData, fetchUserEnrolledCourses, backendUrl, getToken, calculateNoOfLectures}=useContext(AppContext)
  const [progressArray, setProgressArray]=useState([])

  const getCourseProgress=async()=>{
    try {
      const token=await getToken();
      const tempProgressArray=await Promise.all(
        enrolledCourses.map(async(course)=>{
          const {data}=await axios.post(`${backendUrl}/api/user/get-course-progress`, {courseId:course._id}, {headers:{Authorization:`Bearer ${token}`}})
          let totalLectures=calculateNoOfLectures(course)

      const lectureCompleted=data.progressData?data.progressData.lectureCompleted.length:0;
      return {totalLectures, lectureCompleted}
        })
      )
      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(userData){
      fetchUserEnrolledCourses()
    }
  },[userData])

  useEffect(()=>{
    if(enrolledCourses.length>0){
      getCourseProgress()
    }
  },[enrolledCourses])

  return (
    <>
    <div className='md:px-36 px-8 pt-10 bg-gradient-to-b from-blue-200/70'>
        <h1 className='text-2xl font-semibold'>My Enrollments</h1>
        <table className='md:table-auto table-fixed w-full overflow-hidden border mt-10'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
            <tr>
              <th className='px-4 py-3 font-semibold truncate'>Course</th>
              <th className='px-4 py-3 font-semibold truncate'>Duration</th>
              <th className='px-4 py-3 font-semibold truncate'>Completed</th>
              <th className='px-4 py-3 font-semibold truncate'>Status</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {enrolledCourses.map((course,index)=>(
              <tr key={index} onClick={() => navigate('/player/' + course._id)} className='border-b border-gray-500/20 hover:bg-blue-100 cursor-pointer transition-colors'>
                {/*<td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                  <img src={course.courseThumbnail} alt="" className='w-14 sm:w-24 md:w-28'/>
                  <div className='flex-1'>
                    <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                    <Line strokeWidth={2} percent={progressArray[index]?(progressArray[index].lectureCompleted*100) / progressArray[index].totalLectures:0} className='bg-gray-300 rounded-full'/>
                  </div>
                </td>*/}
                <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
  {/* Custom Gradient Thumbnail */}
  <div className='relative w-14 sm:w-24 md:w-28 aspect-video overflow-hidden rounded shadow-sm flex-shrink-0'>
    <img 
      src={assets.thumbnail} 
      alt="" 
      className='absolute inset-0 w-full h-full object-cover' 
    />
    {/* Title Overlay */}
    <div className='absolute inset-0 flex items-center justify-center bg-black/5'>
      <p className='text-white text-[5px] sm:text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-center px-1 drop-shadow-md'>
        {course.courseTitle}
      </p>
    </div>
  </div>

  <div className='flex-1 min-w-0'>
    <p className='mb-1 max-sm:text-sm font-medium truncate'>{course.courseTitle}</p>
    <Line 
      strokeWidth={2} 
      percent={progressArray[index] ? (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLectures : 0} 
      className='bg-gray-300 rounded-full'
    />
  </div>
</td>


                <td className='px-4 py-3 max-sm:hidden'>
                  {calculateCourseDuration(course)}
                </td>
                <td className='px-4 py-3 max-sm:hidden'>
                 {progressArray[index] && `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures} `}<span>Lectures</span>
                </td>
                <td className='px-4 py-3 max-sm:text-right'>
                  <button className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-400 max-sm:text-xs text-white rounded' >
                    {progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1?'Completed':'On Going'}
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
    <Footer/>
    </>
  )
}

export default MyEnrollments