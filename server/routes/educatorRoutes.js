import express from 'express'
import { addCourse, educatorDashboardData, getCourseData, getEducatorCourses, getEnrolledStudentsData, updateCourse, updateRoleToEducator } from '../controller/educatorController.js'
import { upload } from '../configs/multer.js'
import { protectEducator } from '../middlewares/authMiddleware.js'

const educatorRouter=express.Router()

// add educator role
educatorRouter.get('/update-role', updateRoleToEducator)
educatorRouter.post('/add-course', protectEducator, addCourse)
educatorRouter.get('/courses', protectEducator, getEducatorCourses)
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData)
educatorRouter.get('/course/:id', protectEducator, getCourseData);
educatorRouter.patch('/update-course/:id', protectEducator, updateCourse);


export default educatorRouter