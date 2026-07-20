import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'
import { useRef } from 'react';
//import LiveClassSection from '../../components/student/LiveClassSection'

const Player = () => {

  const {enrolledCourses, calculateChapterTime, backendUrl, getToken, userData, fetchUserEnrolledCourses, setUserData}=useContext(AppContext)
  const {courseId}=useParams()
  const [courseData, setCourseData]=useState(null)
  const [openSections, setOpenSections]=useState({})
  const [playerData, setPlayerData]=useState(null)
  const [progressData, setProgressData]=useState(null)
  const [initialRating, setInitialRating]=useState(0)
  const playerWrapperRef = useRef(null);

  

  //to track if the user is in full screen or small 
    const [isFs, setIsFs] = useState(false);


  const getCourseData=()=>{
    enrolledCourses.map((course)=>{
      if(course._id===courseId){
        console.log("COURSE DATA:", course); 
        setCourseData(course)
        course.courseRatings.map((item)=>{
          if(item.userId===userData._id){
            setInitialRating(item.rating)
          }
        })
      }
    })
  }
  

  const toggleSection=(index)=>{
    setOpenSections((prev)=>(
      {...prev, [index]: !prev[index],

      }
    ));
  }
  
  useEffect(()=>{
    if(enrolledCourses.length>0 && userData){
      getCourseData()

    }
    
  },[enrolledCourses, userData])

  const markLectureAsCompleted=async(lectureId)=>{
    try {
      const token=await getToken()
      const {data}=await axios.post(backendUrl+'/api/user/update-course-progress', 
        {courseId, lectureId}, {headers:{Authorization:`Bearer ${token}`}})
      console.log("API RESPONSE:", data)

      if(data.success){
        toast.success("Lecture Completed! +50 XP earned")
        setUserData(data.user)
        getCourseProgress()
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getCourseProgress=async()=>{
    try {
      const token=await getToken()
      const {data}=await axios.post(backendUrl+'/api/user/get-course-progress', {courseId}, {headers:{Authorization:`Bearer ${token}`}})

      if(data.success){
        setProgressData(data.progressData)
      }
      else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }



  const handleRate=async(rating)=>{
    try {
      const token=await getToken()
      const {data}=await axios.post(backendUrl+'/api/user/add-rating', {courseId, rating}, {headers:{Authorization:`Bearer ${token}`}})
      console.log("Sending rating:", rating)

      if(data.success){
        toast.success(data.message)
        await fetchUserEnrolledCourses()
        
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  
  useEffect(()=>{
    getCourseProgress()

  },[])

  

const handleFullScreen = () => {
  const element = playerWrapperRef.current;
  if (element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) { // Safari support
      element.webkitRequestFullscreen();
    }
  }
};

useEffect(() => {
  const handleFsChange = () => {
    // Check if the current element is still the fullscreen element
    setIsFs(!!document.fullscreenElement);
  };
  document.addEventListener('fullscreenchange', handleFsChange);
  return () => document.removeEventListener('fullscreenchange', handleFsChange);
}, []);

const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      modestbranding: 1, 
      rel: 0,            
      fs: 0, // Disables native fullscreen so students are forced to use your "Watch Large" button
    },
  };



  
  const getYouTubeID = (url) => {
  if (!url) return null;

  const match = url.match(
    /(?:youtu\.be\/|youtube\.com.*v=)([^&?/]+)/
  );

  return match ? match[1] : null;
};


  return courseData?(
    
    <>
    <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36 bg-gradient-to-b from-blue-200/70'>
       {/*left column */}
       <div className='text-gray-800'>
        <h2 className='text-xl font-semibold'>Course Structure</h2>

        <div className='pt-5'>
            {courseData && courseData.courseContent.map((chapter, index)=>(
            <div key={index} className='border border-gray-300 bg-blue-50 mb-2 rounded'>
              <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={()=> toggleSection(index)}>
                <div className='flex items-center gap-2'>
                  <img className={`transform transition-transform ${openSections [index]?'rotate-180':''}`} src={assets.down_arrow_icon} alt="arrow icon" />
                  <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                </div>
                <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures-{calculateChapterTime(chapter)}</p>
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${openSections[index]?'max-h-96':'max-h-0'}`}>
                <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                  {chapter.chapterContent.map((lecture,i)=>(
                 <li key={i} className='flex items-start gap-2 py-1'>
                    <img src={progressData && progressData.lectureCompleted.includes(lecture.lectureId)?assets.blue_tick_icon:assets.play_icon} alt="play icon" className='w-4 h-4 mt-1'/>
                    <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                      <p>{lecture.lectureTitle}</p>
                      <div className='flex gap-2'>
                       {lecture.lectureUrl && <p onClick={()=>setPlayerData({
                        ...lecture, chapter:index+1, lecture:i+1
        
                        })} 
                        className='text-blue-500 cursor-pointer'>Watch</p> }
                        <p>{humanizeDuration(lecture.lectureDuration*60*1000, {units: ['h','m']})}</p>
                      </div>
                    </div>
                  </li>
                    ))}
                </ul>
              </div>
            </div>
            ))}
                      
         </div>
         <div className='flex items-center gap-2 py-3 mt-10'>
          <h1 className='text-xl font-bold'>Rate this course</h1>
          <Rating initialRating={initialRating} onRate={handleRate}/>
         </div>
       </div>
       {/*right column */}
       <div className='md:mt-10'>
        {playerData?(
          <div>
      
<div ref={playerWrapperRef} className='relative w-full aspect-video overflow-hidden rounded-md bg-black'>
  
  <YouTube
  videoId={getYouTubeID(playerData.lectureUrl)}
  opts={opts}
  className='w-full h-full'
    iframeClassName='w-full h-full block border-0' 
/>
  
  {/*<YouTube 
    videoId={playerData.lectureUrl.split('/').pop()} 
    opts={opts}
    className='w-full h-full'
    iframeClassName='w-full h-full block border-0' 
  />*/}
  
  {/* SHIELD */}
  <div className='absolute inset-0 z-10' style={{ pointerEvents: 'none' }}>
    
    {isFs ? (
    // LAYOUT FOR WATCH LARGE (FULLSCREEN)
    <>
      <div className='absolute top-0 left-0 w-full h-[15%]' style={{ pointerEvents: 'auto' }}></div>
      <div className='absolute bottom-0 left-0 w-[13%] h-[8%]' style={{ pointerEvents: 'auto' }}></div>
      <div className='absolute bottom-0 right-0 w-[23%] h-[8%]' style={{ pointerEvents: 'auto' }}></div>
      <div className='absolute top-0 right-0 w-[1%] h-full' style={{ pointerEvents: 'auto' }}></div>
    </>
  ) : (
    // LAYOUT FOR SMALL SCREEN
    <>
      <div className='absolute top-0 left-0 w-full h-[23%]' style={{ pointerEvents: 'auto' }}></div>
      <div className='absolute bottom-0 left-0 w-full h-[18%]' style={{ pointerEvents: 'auto' }}></div>
      <div className='absolute top-0 right-0 w-[1%] h-full' style={{ pointerEvents: 'auto' }}></div>
      <div className='absolute bottom-0 left-0 w-[15%] h-[18%]' style={{ pointerEvents: 'auto' }}></div>
    </>
  )}        

  </div>
</div>

      
           <div className='flex justify-between items-center mt-1'>
            <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
            <div className='flex items-center gap-4'>
                  {/* 3. Button to activate scaled fullscreen */}
                  <button
                    onClick={handleFullScreen}
                    className='text-sm text-blue-600 cursor-pointer hover:underline'>
                    Watch Large
                  </button>

            <button 
          disabled={progressData && progressData.lectureCompleted.includes(playerData.lectureId)}
          onClick={() => markLectureAsCompleted(playerData.lectureId)} 
          className={`font-medium transition-colors ${
            progressData && progressData.lectureCompleted.includes(playerData.lectureId)
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-blue-600 hover:text-blue-800 cursor-pointer'
          }`}
        >
          {progressData && progressData.lectureCompleted.includes(playerData.lectureId) 
            ? 'Completed' 
            : 'Mark Complete'}
        </button>
            {/*<button onClick={()=>markLectureAsCompleted(playerData.lectureId)} className='text-blue-600'>{progressData && progressData.lectureCompleted.includes(playerData.lectureId)?'Completed':'Mark Complete'}</button>*/}
           </div>
          </div>

          {playerData?.resources && playerData.resources.length > 0 && (
  <div className='mt-3'>
    <p className='text-sm font-semibold text-gray-700 mb-2'>Lecture Resources</p>
    <div className='flex flex-wrap gap-2'>
      {playerData.resources.map((file, i) => {
        const filename = file.url.split('/uploads/')[1];
        return (
              <a
                key={i}
                href={`${backendUrl}/api/resource/download/${filename}`}
                download={file.name}
                className='inline-flex items-center gap-2 bg-blue-50
                 hover:bg-blue-100 border border-blue-200 text-blue-700
                  dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-colors'
              >
          📄 {file.name}
        </a>
      )})}
    </div>
  </div>
)}
          
          {/*{playerData?.resourceUrl && (
            <a
  
    href={playerData.resourceUrl} // ← remove backendUrl prefix
    target="_blank"
    rel="noreferrer"
    download
    className="inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
  >
    📄 Download Resource
  </a>
)}*/}

          {/*{playerData?.resourceUrl && (
    <a
      href={backendUrl + playerData.resourceUrl}
      target="_blank"
      rel="noreferrer"
      className="inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
    >
      📄 Download Resource
    </a>
  )}*/}

          </div>
        )
      : (
  <div className='relative w-full aspect-video overflow-hidden rounded-md shadow-lg'>
    {/* Your Custom Gradient Image from assets */}
    <img 
      src={assets.thumbnail} 
      alt="Course Background" 
      className='absolute inset-0 w-full h-full object-cover' 
    />
    
    {/* Centered Dynamic Title Overlay */}
    <div className='absolute inset-0 flex items-center justify-center bg-black/10'>
      <h3 className='text-white text-xl md:text-3xl font-bold uppercase tracking-[0.2em] text-center px-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]'>
        {courseData.courseTitle}
      </h3>
    </div>
  </div>
)

      
      }
        
       </div>
    </div>
    {/*<LiveClassSection courseId={courseId} isEnrolled={true} />*/}
    <Footer/>
    </>
  ):<Loading/>

}

export default Player