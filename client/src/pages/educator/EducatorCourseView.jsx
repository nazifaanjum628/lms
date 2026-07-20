import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import Loading from '../../components/student/Loading'
import { toast } from 'react-toastify'
//import LiveClassManager from '../../components/educator/LiveClassManager'

const EducatorCourseView = () => {
  const { id } = useParams()
  const { backendUrl, getToken, currency } = useContext(AppContext)
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null)
  const [activeLecture, setActiveLecture] = useState(null)

  
  const getYouTubeID = (url) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null;
  }

  const fetchCourseDetails = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(`${backendUrl}/api/educator/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setCourseData(data.course)
        // Default to the first lecture of the first chapter if it exists
        if (data.course.courseContent?.[0]?.chapterContent?.[0]) {
          setActiveLecture(data.course.courseContent[0].chapterContent[0])
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCourseDetails()
  }, [id])

  return courseData ? (
    <div className='p-4 md:p-8 max-w-7xl mx-auto font-sans'>
      
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>{courseData.courseTitle}</h1>
        <p className='text-gray-500 mt-1'>Educator Management Portal</p>
      </div>

      <div className='flex flex-col lg:flex-row gap-10'>
        
        {/* LEFT COLUMN: Player & Description */}
        <div className='flex-1'>
          
          {/* Styled Video Player Container */}
          <div style={{
            background: '#000', borderRadius: '16px',
            overflow: 'hidden', aspectRatio: '16/9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #E5E7EB', marginBottom: '24px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            {activeLecture?.lectureUrl ? (
              getYouTubeID(activeLecture.lectureUrl) ? (
                <iframe
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  src={`https://www.youtube.com/embed/${getYouTubeID(activeLecture.lectureUrl)}`}
                  title='Course Preview'
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeLecture.lectureUrl}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  controls
                  controlsList="nodownload"
                />
              )
            ) : (
              <div className='text-center text-gray-400'>
                <div className='text-4xl mb-2'>🎬</div>
                <p className='text-sm uppercase tracking-widest font-bold'>No Lecture Selected</p>
              </div>
            )}
          </div>

          <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm'>
            <h2 className='text-xl font-bold text-gray-800 mb-3'>
               {activeLecture ? `Now Viewing: ${activeLecture.lectureTitle}` : 'Course Description'}
            </h2>
            <div className='text-gray-600 leading-relaxed'
    dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
  ></div>
          </div>

            {/*<LiveClassManager courseId={id} />*/}

        </div>

        {/* RIGHT COLUMN: Stats & Curriculum */}
        <div className='w-full lg:w-96 space-y-6'>
          
          {/* Quick Stats Card */}
          <div className='bg-gradient-to-br from-blue-300 to-violet-300 text-white p-6 rounded-2xl shadow-lg'>
            <h3 className='font-bold text-lg mb-4 border-b border-white/20 pb-2'>Course Overview</h3>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='opacity-80'>Price</span>
                <span className='text-xl font-bold'>{currency}{courseData.coursePrice}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='opacity-80'>Total Students</span>
                <span className='text-xl font-bold'>{courseData.enrolledStudents.length}</span>
              </div>
              <button 
  onClick={() => navigate(`/educator/edit-course/${id}`)}
  className='w-full bg-white text-violet-700 py-3 rounded-xl font-bold mt-2 hover:bg-gray-100 transition-all active:scale-95'
>
  Edit Course Details
</button>
            </div>
          </div>

          {/* Curriculum Selector */}
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
            <div className='p-4 border-b border-gray-100 bg-gray-50'>
              <h3 className='font-bold text-gray-800'>Course Curriculum</h3>
            </div>
            <div className='max-h-[400px] overflow-y-auto'>
              {courseData.courseContent.map((chapter, cIndex) => (
                <div key={cIndex} className='border-b last:border-0'>
                  <div className='px-4 py-2 bg-gray-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider'>
                    Chapter {cIndex + 1}: {chapter.chapterTitle}
                  </div>
                  {chapter.chapterContent.map((lecture, lIndex) => (
                    <div 
                      key={lIndex}
                      onClick={() => setActiveLecture(lecture)}
                      className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-all hover:bg-blue-50 ${activeLecture?.lectureId === lecture.lectureId ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                    >
                      <span className={`text-xs ${activeLecture?.lectureId === lecture.lectureId ? 'text-blue-600' : 'text-gray-400'}`}>▶</span>
                      <div className='flex-1'>
                        <p className={`text-sm ${activeLecture?.lectureId === lecture.lectureId ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
                          {lecture.lectureTitle}
                        </p>
                        <p className='text-[10px] text-gray-400'>{lecture.lectureDuration} Min</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  ) : <Loading />
}

export default EducatorCourseView



