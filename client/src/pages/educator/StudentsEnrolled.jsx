import React, { useEffect, useState } from 'react'
import { assets, dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const StudentsEnrolled = () => {

  const navigate = useNavigate();

  const {backendUrl, getToken, isEducator}=useContext(AppContext)

  const [enrolledStudents,setEnrolledStudents]=useState(null)
  const fetchEnrolledStudents=async()=>{
    try {
      const token=await getToken()
      const {data}=await axios.get(backendUrl+'/api/educator/enrolled-students', {headers:{Authorization:`Bearer ${token}`}})
      console.log("Full API Response:", data);
      if(data.success){
        setEnrolledStudents(data.enrolledStudents.reverse())
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(()=>{
  if(isEducator){
    fetchEnrolledStudents()
  }
    
  },[isEducator])

  return enrolledStudents ? (
  <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-violet-50 flex flex-col items-start md:p-8 p-4 font-sans animate-in fade-in duration-500'>
    
    <div className='w-full max-w-5xl mx-auto'>
      {/* Header Section */}
      <div className='mb-8'>
        <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-700 via-violet-700 to-purple-700 bg-clip-text text-transparent'>Enrolled Students</h2>
        <p className='text-sm text-gray-600 mt-2 font-medium'>Manage and view all students currently enrolled in your courses.</p>
      </div>

      {/* Table Container */}
      <div className='bg-blue-50 shadow-2xl rounded-2xl border border-blue-100/50 overflow-hidden w-full backdrop-blur-sm bg-opacity-95'>
        <div className='bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 h-1'></div>
        <table className='w-full text-left border-collapse'>
          <thead className='bg-gradient-to-r from-blue-100/80 to-violet-100/80 border-b border-blue-100'>
            <tr className='text-gray-700 text-xs font-bold uppercase tracking-wider'>
              <th className='px-6 py-4 text-center hidden sm:table-cell w-16'>#</th>
              <th className='px-6 py-4'>Student Name</th>
              <th className='px-6 py-4'>Enrolled Course Title</th>
              <th className='px-6 py-4 hidden sm:table-cell'>Enrollment Date</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-blue-50'>
            {enrolledStudents.map((item, index) => (
              <tr key={index} className='hover:bg-gradient-to-r hover:from-blue-100/60 hover:to-violet-100/60 transition-colors group'>
                
                
                <td className='px-6 py-4 text-center text-gray-500 font-medium hidden sm:table-cell'>
                  {index + 1}
                </td>

                
                <td className='px-6 py-4'>
                  <div className='flex items-center gap-3'>
                    <img 
                      src={item.student.imageUrl} 
                      alt="" 
                      className='w-9 h-9 rounded-full border-2 border-blue-200 shadow-md object-cover' 
                    />
                    <span className='font-semibold text-gray-700 group-hover:text-violet-700 transition-colors truncate'>{item.student.name}</span>
                  </div>
                </td>

                
                <td 
                  onClick={() => navigate(`/player/${item.courseId}`)} 
                  className='px-6 py-4 cursor-pointer group/title'
                >
                  <div className='flex items-center gap-4'>
                    
                    <div className="relative w-20 h-12 flex-shrink-0 overflow-hidden rounded-lg shadow-md hidden sm:block bg-gradient-to-br from-blue-200 to-violet-200 border border-blue-100">
                      <img src={assets.thumbnail} className="absolute inset-0 w-full h-full object-cover" alt="" />
                      <div className="absolute inset-0 flex items-center justify-center p-1 bg-gradient-to-t from-black/40 to-transparent">
                        <p className="text-white text-[7px] font-bold uppercase text-center leading-tight whitespace-normal break-words">
                          {item.courseTitle}
                        </p>
                      </div>
                    </div>
                    
                    
                    <span className='group-hover/title:text-violet-700 transition-colors font-medium text-gray-700 text-sm whitespace-normal break-words min-w-0 max-w-[250px]'>
                      {item.courseTitle}
                    </span>
                  </div>
                </td>

                
                <td className='px-6 py-4 text-sm text-gray-500 hidden sm:table-cell'>
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        {enrolledStudents.length === 0 && (
          <div className='p-16 text-center text-gray-400 font-medium'>
            No students enrolled yet.
          </div>
        )}
      </div>
    </div>
  </div>
) : <Loading />


  {/*return enrolledStudents?(
    <div className='min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
        <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
          <table className='md:table-auto table-fixed w-full overflow-hidden pb-4'>
            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
            <tr>
              <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
              <th className='px-4 py-3 font-semibold'>Student Name</th>
              <th className='px-4 py-3 font-semibold'>Enrolled Course Title</th>
              <th className='px-4 py-3 font-semibold hidden sm:table-cell'>Date</th>
            </tr>
            </thead>
            <tbody className='text-sm text-gray-500'>
  {enrolledStudents.map((item, index) => (
    <tr key={index} className='border-b border-gray-500/20'>
      
      {/* 1. # Column */}
      {/*<td className='px-4 py-3 text-center hidden sm:table-cell'>
        {index + 1}
      </td>

      {/* 2. Student Name Column */}
      {/*<td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
        <img src={item.student.imageUrl} alt="" className='w-9 h-9 rounded-full' />
        <span className='truncate'>{item.student.name}</span>
      </td>

      {/* 3. Course Title Column (Clickable & Wrapped) */}
      {/*<td 
        onClick={() => navigate(`/player/${item.courseId}`)} 
        className='px-4 py-3 cursor-pointer group'
      >
        <div className='flex items-center gap-3'>
          {/* Thumbnail overlay */}
          {/*<div className="relative w-20 h-12 flex-shrink-0 overflow-hidden rounded hidden sm:block">
            <img src={assets.thumbnail} className="absolute inset-0 w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 flex items-center justify-center p-1 bg-black/10">
              <p className="text-white text-[7px] font-bold uppercase text-center leading-tight whitespace-normal break-words">
                {item.courseTitle}
              </p>
            </div>
          </div>
          
          {/* Title Text - This will wrap to the next line if long */}
          {/*<span className='group-hover:text-blue-600 transition-colors font-medium whitespace-normal break-words min-w-0'>
            {item.courseTitle}
          </span>
        </div>
      </td>

      {/* 4. Date Column */}
      {/*<td className='px-4 py-3 hidden sm:table-cell'>
        {new Date(item.purchaseDate).toLocaleDateString()}
      </td>

    </tr>
  ))}
</tbody>
          </table>
        </div>
    </div>
  ): <Loading/>*/}
}

export default StudentsEnrolled