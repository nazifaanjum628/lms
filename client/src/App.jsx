import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import CoursesList from './pages/student/coursesList'
import Loading from './components/student/Loading'
import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Navbar from './components/student/Navbar'
import "quill/dist/quill.snow.css"
import { ToastContainer} from 'react-toastify';
import DashboardPage from './pages/student/DashboardPage'
import { useNavigate } from "react-router-dom";
import { useEffect} from 'react'
import EducatorCourseView from './pages/educator/EducatorCourseView'
import EditCourse from './pages/educator/EditCourse'

const App = () => {
  const isEducatorRoute=useMatch('/educator/*')
  {/*const navigate = useNavigate();
  useEffect(() => {
  const lastCourse = localStorage.getItem("lastCourse");

  if (lastCourse && window.location.pathname === "/") {
    navigate(`/course/${lastCourse}`);
    localStorage.removeItem("lastCourse");
  }
}, []);*/}
  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer/>
      {!isEducatorRoute && <Navbar/>}
      
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/course-list' element={<CoursesList />}/>
        <Route path='/course-list/:input' element={<CoursesList />}/>
        <Route path='/course/:id' element={<CourseDetails />}/>
        <Route path='/my-enrollments' element={<MyEnrollments />}/>
        <Route path='/player/:courseId' element={<Player />}/>
        <Route path='/loading/:path' element={<Loading />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        
        <Route path='/educator' element={<Educator/>}>
            <Route path='/educator' element={<Dashboard/>}/> 
            <Route path='add-course' element={<AddCourse/>}/> 
            <Route path='my-courses' element={<MyCourses/>}/> 
            <Route path='student-enrolled' element={<StudentsEnrolled/>} />
            <Route path='course/:id' element={<EducatorCourseView />} />
            <Route path='edit-course/:id' element={<EditCourse />} />



        </Route>
      



        
      </Routes>
    </div>
  )
}

export default App