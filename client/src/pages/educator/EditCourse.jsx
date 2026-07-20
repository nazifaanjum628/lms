import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'

const EditCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { backendUrl, getToken } = useContext(AppContext)
  
  const [loading, setLoading] = useState(true)
  const [rawContent, setRawContent] = useState([]) // Stores the curriculum layout
  const [courseData, setCourseData] = useState({
    courseTitle: '',
    coursePrice: 0,
    discount: 0,
    courseDescription: ''
  })

  // State for selecting which specific lecture video to edit
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0)
  const [selectedLectureIndex, setSelectedLectureIndex] = useState(0)
  const [videoUrl, setVideoUrl] = useState('')

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  // Fetch current data to fill the form
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = await getToken()
        const { data } = await axios.get(`${backendUrl}/api/educator/course/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (data.success) {
          const cleanText = stripHtml(data.course.courseDescription);
          setCourseData({
            courseTitle: data.course.courseTitle,
            coursePrice: data.course.coursePrice,
            discount: data.course.discount || 0,
            courseDescription: cleanText
          })
          
          // Save the full content structure for video selection
          const content = data.course.courseContent || []
          setRawContent(content)

          // Auto-load the first available lecture's URL into the input field
          if (content[0]?.chapterContent[0]) {
            setVideoUrl(content[0].chapterContent[0].lectureUrl || '')
          }
        }
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [id])

  // Update the video input field whenever the user changes the dropdown selection
  useEffect(() => {
    if (rawContent[selectedChapterIndex]?.chapterContent[selectedLectureIndex]) {
      setVideoUrl(rawContent[selectedChapterIndex].chapterContent[selectedLectureIndex].lectureUrl || '')
    }
  }, [selectedChapterIndex, selectedLectureIndex, rawContent])

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const token = await getToken()

      // Deep clone the curriculum and inject the modified video link into the exact location
      const updatedContent = JSON.parse(JSON.stringify(rawContent))
      if (updatedContent[selectedChapterIndex]?.chapterContent[selectedLectureIndex]) {
        updatedContent[selectedChapterIndex].chapterContent[selectedLectureIndex].lectureUrl = videoUrl
      }

      // Package everything together for the backend patch request
      const payload = {
        ...courseData,
        courseContent: updatedContent 
      }

      const { data } = await axios.patch(`${backendUrl}/api/educator/update-course/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        toast.success("Course and video links updated successfully!")
        navigate(`/educator/course/${id}`)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return loading ? <Loading /> : (
    <div className='p-12 max-w-4xl mx-auto bg-blue-100 rounded-2xl shadow-sm border mt-10 font-sans'>
      <h2 className='text-2xl font-bold mb-6 text-blue-950'>Edit Course Details</h2>
      <form onSubmit={handleUpdate} className='space-y-4'>
        
        {/* Course Title */}
        <div>
          <label className='block text-sm font-medium text-gray-700'>Course Title</label>
          <input 
            type="text" 
            className='w-full border rounded-lg p-2.5 mt-1 bg-blue-50 focus:ring-2 focus:ring-blue-900 outline-none' 
            value={courseData.courseTitle}
            onChange={e => setCourseData({...courseData, courseTitle: e.target.value})}
            required
          />
        </div>

        {/* Price & Discount Row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Price</label>
            <input 
              type="number" 
              className='w-full border rounded-lg p-2.5 mt-1 bg-blue-50 focus:ring-2 focus:ring-blue-900 outline-none' 
              value={courseData.coursePrice}
              onChange={e => setCourseData({...courseData, coursePrice: Number(e.target.value)})}
              required
              min="0"
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Discount (%)</label>
            <input 
              type="number" 
              className='w-full border rounded-lg p-2.5 mt-1 bg-blue-50 focus:ring-2 focus:ring-blue-900 outline-none' 
              value={courseData.discount}
              onChange={e => setCourseData({...courseData, discount: Number(e.target.value)})}
              required
              min="0"
              max="100"
            />
          </div>
        </div>

        {/* VIDEO EDITING CONNECTOR HUB */}
        {rawContent.length > 0 && (
          <div className='bg-blue-50/50 p-5 rounded-xl border border-blue-200/60 space-y-4'>
            <h3 className='text-sm font-bold text-blue-950 uppercase tracking-wider'>Update Lecture Video Links</h3>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-xs font-semibold text-gray-600'>Select Chapter</label>
                <select 
                  className='w-full border rounded-lg p-2 mt-1 bg-white outline-none text-sm'
                  value={selectedChapterIndex}
                  onChange={e => {
                    setSelectedChapterIndex(Number(e.target.value))
                    setSelectedLectureIndex(0) 
                  }}
                >
                  {rawContent.map((chap, idx) => (
                    <option key={idx} value={idx}>Chapter {idx + 1}: {chap.chapterTitle}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-xs font-semibold text-gray-600'>Select Lecture</label>
                <select 
                  className='w-full border rounded-lg p-2 mt-1 bg-white outline-none text-sm'
                  value={selectedLectureIndex}
                  onChange={e => setSelectedLectureIndex(Number(e.target.value))}
                >
                  {rawContent[selectedChapterIndex]?.chapterContent?.map((lec, idx) => (
                    <option key={idx} value={idx}>Lecture {idx + 1}: {lec.lectureTitle}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className='block text-xs font-semibold text-gray-600'>Video URL (YouTube Link)</label>
              <input 
                type="text" 
                className='w-full border rounded-lg p-2.5 mt-1 bg-white focus:ring-2 focus:ring-blue-900 outline-none text-sm' 
                placeholder='Paste new video link here...'
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {/* Description Field */}
        <div>
          <label className='block text-sm font-medium text-gray-700'>Description</label>
          <textarea 
            className='w-full border rounded-lg p-2.5 mt-1 bg-blue-50 focus:ring-2 focus:ring-blue-900 outline-none' 
            rows="5"
            value={courseData.courseDescription}
            onChange={e => setCourseData({...courseData, courseDescription: e.target.value})}
            required
          />
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4 pt-4'>
          <button type='submit' className='flex-1 bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-950 transition-colors shadow-md active:scale-95'>
            Save Changes
          </button>
          <button type='button' onClick={() => navigate(-1)} className='flex-1 border bg-blue-50 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditCourse;



{/*import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'

const EditCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { backendUrl, getToken } = useContext(AppContext)
  
  const [loading, setLoading] = useState(true)
  const [courseData, setCourseData] = useState({
    courseTitle: '',
    coursePrice: 0,
    courseDescription: ''
  })

const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};


  // Fetch current data to fill the form
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = await getToken()
        const { data } = await axios.get(`${backendUrl}/api/educator/course/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (data.success) {
            const cleanText = stripHtml(data.course.courseDescription);
          setCourseData({
            courseTitle: data.course.courseTitle,
            coursePrice: data.course.coursePrice,
            courseDescription: data.course.courseDescription
          })
        }
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
  }, [id])

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const token = await getToken()
      const { data } = await axios.patch(`${backendUrl}/api/educator/update-course/${id}`, courseData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        toast.success("Course updated successfully!")
        navigate(`/educator/course/${id}`)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return loading ? <Loading /> : (
    <div className='p-12 max-w-4xl mx-auto bg-blue-100 rounded-2xl shadow-sm border mt-10'>
      <h2 className='text-2xl font-bold mb-6'>Edit Course Details</h2>
      <form onSubmit={handleUpdate} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Course Title</label>
          <input 
            type="text" 
            className='w-full border rounded-lg p-2.5 mt-1 bg-blue-50' 
            value={courseData.courseTitle}
            onChange={e => setCourseData({...courseData, courseTitle: e.target.value})}
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Price</label>
          <input 
            type="number" 
            className='w-full border rounded-lg p-2.5 mt-1 bg-blue-50' 
            value={courseData.coursePrice}
            onChange={e => setCourseData({...courseData, coursePrice: e.target.value})}
          />
        </div>
        <div >
          <label className='block text-sm font-medium text-gray-700'>Description</label>
          <textarea 
  className='w-full border rounded-lg p-2.5 mt-1 bg-blue-50' 
  rows="6"
  value={courseData.courseDescription}
  onChange={e => setCourseData({...courseData, courseDescription: e.target.value})}
/>
        </div>
        <div className='flex gap-4 pt-4'>
          <button type='submit' className='flex-1 bg-blue-900 text-white py-2 rounded-lg font-bold'>Save Changes</button>
          <button type='button' onClick={() => navigate(-1)} className='flex-1 border bg-blue-50 py-2 rounded-lg'>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default EditCourse
*/}