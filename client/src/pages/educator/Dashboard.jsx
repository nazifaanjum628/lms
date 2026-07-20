import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate();
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext)
  const [dashboardData, setDashboardData] = useState(null)

  const fetchDashboardData = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(backendUrl + '/api/educator/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData()
    }
  }, [isEducator])

  return dashboardData ? (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-violet-50 p-4 md:p-8 font-sans'>
      {/* Page Header */}
      <div className='mb-10'>
        <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-700 via-violet-700 to-purple-700 bg-clip-text text-transparent mb-2'>Dashboard</h1>
        <p className='text-gray-600 font-medium'>Welcome back! Here's your teaching overview.</p>
      </div>
      
      {/* STATS CARDS */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
        
        {/* TOTAL ENROLLMENTS */}
        <div 
          onClick={() => navigate('/educator/student-enrolled')} 
          className='group relative bg-white backdrop-blur-xl shadow-xl rounded-3xl border border-blue-200/60 p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden'
        >
          <div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          <div className='relative z-10'>
            <div className='flex items-start justify-between mb-6'>
              <div className='p-4 bg-gradient-to-br from-blue-300 to-blue-600 rounded-2xl shadow-lg'>
                <img src={assets.patients_icon} alt="enrollments" className='w-8 ' />
              </div>
              <span className='text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full'>Enrollments</span>
            </div>
            <p className='text-4xl font-bold text-gray-900 mb-1'>{dashboardData.enrolledStudentsData.length}</p>
            <p className='text-sm font-semibold text-gray-600 tracking-wide'>Total Enrollments</p>
          </div>
        </div>

        {/* TOTAL COURSES */}
        <div 
          onClick={() => navigate('/educator/my-courses')} 
          className='group relative bg-white backdrop-blur-xl shadow-xl rounded-3xl border border-violet-200/60 p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden'
        >
          <div className='absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          <div className='relative z-10'>
            <div className='flex items-start justify-between mb-6'>
              <div className='p-4 bg-gradient-to-br from-violet-300 to-violet-600 rounded-2xl shadow-lg'>
                <img src={assets.appointments_icon} alt="courses" className='w-8 ' />
              </div>
              <span className='text-xs font-bold text-violet-600 bg-violet-100 px-3 py-1 rounded-full'>Courses</span>
            </div>
            <p className='text-4xl font-bold text-gray-900 mb-1'>{dashboardData.totalCourses}</p>
            <p className='text-sm font-semibold text-gray-600 tracking-wide'>Total Courses</p>
          </div>
        </div>

        {/* TOTAL EARNINGS */}
        <div 
          onClick={() => navigate('/educator/my-courses')} 
          className='group relative bg-white backdrop-blur-xl shadow-xl rounded-3xl border border-purple-200/60 p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden'
        >
          <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          <div className='relative z-10'>
            <div className='flex items-start justify-between mb-6'>
              <div className='p-4 bg-gradient-to-br from-purple-300 to-purple-600 rounded-2xl shadow-lg'>
                <img src={assets.earning_icon} alt="earnings" className='w-8 ' />
              </div>
              <span className='text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full'>Revenue</span>
            </div>
            <p className='text-4xl font-bold text-gray-900 mb-1'>{currency} {dashboardData.totalEarnings.toFixed(2)}</p>
            <p className='text-sm font-semibold text-gray-600 tracking-wide'>Total Earnings</p>
          </div>
        </div>
      </div>

      {/* LATEST ENROLLMENTS TABLE */}
      <div>
        <h2 className='text-2xl font-bold text-gray-900 mb-6'>Latest Enrollments</h2>
        <div className='bg-white backdrop-blur-xl shadow-2xl rounded-3xl border border-blue-200/60 overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 h-1'></div>
          <table className='w-full text-left'>
            <thead className='bg-gradient-to-r from-blue-50/80 to-violet-50/80 border-b border-blue-100'>
              <tr className='text-gray-600 text-xs font-bold uppercase tracking-wider'>
                <th className='px-6 py-4 text-center hidden sm:table-cell'>#</th>
                <th className='px-6 py-4'>Student Name</th>
                <th className='px-6 py-4'>Enrolled Course Title</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-blue-50'>
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr key={index} className='hover:bg-gradient-to-r hover:from-blue-100/60 hover:to-violet-100/60 transition-colors group'>
                  <td className='px-6 py-4 text-center text-gray-500 font-medium hidden sm:table-cell'>
                    {index + 1}
                  </td>
                  <td 
                   className='px-6 py-4 '>
                    <div className='flex items-center gap-3'>
                      <img src={item.student.imageUrl} alt="Profile" className='w-9 h-9 rounded-full shadow-md border-2 border-blue-200 object-cover' />
                      <span className='font-semibold text-gray-700 group-hover:text-violet-600 transition-colors'>{item.student.name}</span>
                    </div>
                  </td>
                  <td onClick={() => navigate(`/player/${item.courseId}`)} 
                    className='px-6 py-4 text-gray-600 font-medium cursor-pointer group-hover:text-violet-600 transition-colors'>{item.courseTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {dashboardData.enrolledStudentsData.length === 0 && (
            <div className='p-10 text-center text-gray-400 italic'>No enrollments yet.</div>
          )}
        </div>
      </div>
        
    </div>
  ) : <Loading />
}

export default Dashboard




{/*import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets, dummyDashboardData } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate();
  const {currency, backendUrl, isEducator, getToken}=useContext(AppContext)
  const [dashboardData, setDashboardData]=useState(null)
  const fetchDashboardData=async()=>{
    try {
      const token=await getToken()
      const {data}=await axios.get(backendUrl+'/api/educator/dashboard', {headers:{Authorization:`Bearer ${token}`}})
      if(data.success){
          setDashboardData(data.dashboardData)
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
      fetchDashboardData()
    }
  },[isEducator])
  return dashboardData? (
    <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='space-y-5'>
        <div className='flex flex-wrap gap-5 items-center'>
          <div onClick={() => navigate('/educator/student-enrolled')} className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md cursor-pointer hover:bg-blue-50 transition-colors'>
            <img src={assets.patients_icon} alt="patients_icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>{dashboardData.enrolledStudentsData.length}</p>
              <p className='text-base text-gray-500'>Total Enrollments</p>
            </div>
          </div>
          <div onClick={() => navigate('/educator/my-courses')} className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md cursor-pointer hover:bg-blue-50 transition-colors'>
            <img src={assets.appointments_icon} alt="appointments_icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600'>{dashboardData.totalCourses}</p>
              <p className='text-base text-gray-500'>Total Courses</p>
            </div>
          </div>
          <div onClick={() => navigate('/educator/my-courses')} className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md cursor-pointer hover:bg-blue-50 transition-colors'>
            <img src={assets.earning_icon} alt="earning_icon" />
            <div>
              <p className='text-2xl font-medium text-gray-600 truncate'>{currency} {dashboardData.totalEarnings.toFixed(2)}</p>
              <p className='text-base text-gray-500'>Total Earnings</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className='pb-4 text-lg font-medium'>Latest Enrollments</h2>
          <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
          <table className='table-fixed md:table-auto w-full overflow-hidden'>
            <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
              <tr>
                <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
                <th className='px-4 py-3 font-semibold'>Student Name</th>
                <th className='px-4 py-3 font-semibold'>Enrolled Course Title</th>
              </tr>
            </thead>
            <tbody className='text-sm text-gray-500'>
              {dashboardData.enrolledStudentsData.map((item,index)=>(
                <tr key={index} className='border-b border-gray-500/20'>
                  <td className='px-4 py-3 text-center hidden sm:table-cell'>
                    {index+1}
                  </td>
                  <td className='md:px-4 ps-2 py-3 flex items-center space-x-3'>
                    <img src={item.student.imageUrl} alt="Profile" className='w-9 h-9 rounded-full' />
                    <span className='truncate'>{item.student.name}</span>
                  </td>
                  <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
        
    </div>
  ) : <Loading/>
}

export default Dashboard*/}