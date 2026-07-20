import express from 'express'
import { getAllCourse, getCourseId, getRecommendation } from '../controller/courseController.js'
import { requireAuth } from '@clerk/express'

const courseRouter=express.Router()

courseRouter.get('/all', getAllCourse)
courseRouter.get('/recommendations', requireAuth(), getRecommendation)
courseRouter.get('/:id', getCourseId)


export default courseRouter;