import Stripe from "stripe"
import User from "../models/User.js"
import Course from "../models/Course.js"
import { Purchase } from "../models/Purchase.js"
import { CourseProgress } from "../models/CourseProgress.js"

// get user data
export const getUserData=async(req, res)=>{
    try {
        const userId=req.auth.userId
        const user=await User.findById(userId)

        if(!user){
            return res.json({success:false, message:'User Not Found'})
        }

        res.json({success:true, user})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// users enrolled courses with lecture links
export const userEnrolledCourses=async(req, res)=>{
    try {
        const userId=req.auth.userId
        const userData=await User.findById(userId)
        const courses = await Course.find({
  _id: { $in: userData.enrolledCourses }
});
        res.json({success:true, enrolledCourses:courses})//userData.enrolledCourses})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// purchase course
export const purchaseCourse=async(req, res)=>{
    try {
        const {courseId}=req.body
        const origin=req.headers.origin
        const userId=req.auth.userId
        const userData=await User.findById(userId)
        const courseData=await Course.findById(courseId)

        if(!userData || !courseData){
            return res.json({success:false, message:'Data Not Found'})
        }

        const purchaseData={
            courseId:courseData._id,
            userId,
            amount:(courseData.coursePrice-courseData.discount*courseData.coursePrice/100).toFixed(2),
        }

        const newPurchase=await Purchase.create(purchaseData)

        // stripe gateway initialize
        const stripeInstance=new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency=process.env.CURRENCY.toLowerCase()

        // creating line items for stripe
        const line_items=[{
            price_data:{
                currency,
                product_data:{
                    name:courseData.courseTitle
                },
                unit_amount:Math.floor(newPurchase.amount)*100
            },
            quantity:1
        }]
        const session=await stripeInstance.checkout.sessions.create({
            success_url:`${origin}/loading/my-enrollments`,
            cancel_url:`${origin}/course/${courseId}`,
            line_items:line_items,
            mode:'payment',
            //client_reference_id: courseId,
            payment_intent_data:{
      metadata:{
          purchaseId:newPurchase._id.toString()
      }
  }
            //metadata:{
               // purchaseId:newPurchase._id.toString()
           // }
        
        })
        res.json({success:true, session_url:session.url})
        
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

//update user course progress
export const updateUserCourseProgress=async(req, res)=>{
    try {
        const userId=req.auth.userId
        const {courseId, lectureId}=req.body
        const progressData=await CourseProgress.findOne({userId, courseId})

        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success:true, message:'Lecture Already Completed'})
            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()

        }
        else{
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted:[lectureId]
            })
        }

        
    // 1. Fetch the course to find the lecture title
        const course = await Course.findById(courseId);
        if (!course) return res.json({ success: false, message: "Course not found" });

        // 2. Find the lecture title from courseContent 
        let lectureTitle = "";
        course.courseContent.forEach(chapter => {
            const lecture = chapter.chapterContent.find(lec => lec.lectureId === lectureId);
            if (lecture) lectureTitle = lecture.lectureTitle;
        });

        

        // 3. Update the Gamification block to include the title
        const user = await User.findById(userId);

        if (user && !user.completedLectures.some(l => l.lectureId === lectureId)) {
            user.completedLectures.push({
                lectureId,
                lectureTitle, 
                courseId,
                completedAt: new Date()
            });

  // XP
  user.xp += 50;

  // LEVEL
  user.level = Math.floor(user.xp / 100) + 1;

  // STREAK
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (user.lastActive !== today) {
    user.streak = user.lastActive === yesterday ? user.streak + 1 : 1;
    user.lastActive = today;
  }

  // BADGES
  if (user.xp >= 100 && !user.badges.includes("Beginner")) {
    user.badges.push("Beginner");
  }

  await user.save();
}


        res.json({success:true, message:'Progress Updated'})
    } catch (error) {
        res.json({success:false, message:error.message})
    }

    

    
}

//get user course progress
export const getUserCourseProgress=async(req, res)=>{
    try {
        const userId=req.auth.userId
        const {courseId}=req.body
        const progressData=await CourseProgress.findOne({userId, courseId})

        res.json({success:true, progressData})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

// add user ratings to course
export const addUserRating=async(req, res)=>{
    const userId=req.auth.userId
    const {courseId, rating}=req.body;

    console.log("USER ID:", userId);
    console.log("COURSE ID:", courseId);
    console.log("RATING:", rating);

    if(!courseId || !userId || !rating || rating<1 || rating>5){
        return res.json({success:false, message:'Invalid Details'});
    }
    try {
        const course=await Course.findById(courseId);
        console.log("Course Found:", course)
        if(!course){
            return res.json({success:false, message:'Course not found'});
        }

        const user=await User.findById(userId);
        console.log("User enrolled courses:", user.enrolledCourses)
        if(!user || !user.enrolledCourses.some(id=>id.toString()===courseId)){
            return res.json({success:false, message:'User has not purchased this course'});
        }

        console.log("Before rating:", course.courseRatings)

        const existingRatingIndex=course.courseRatings.findIndex(r=>r.userId===userId)

        if(existingRatingIndex>-1){
            course.courseRatings[existingRatingIndex].rating=rating;
            
        }
        else{
            course.courseRatings.push({userId, rating});
        }
        await course.save();
        console.log("After rating:", course.courseRatings)
        return res.json({success:true, message:'Rating added'})

    } catch (error) {
        console.log("Error:", error)
        res.json({success:false, message:error.message})
    }
}

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .sort({ xp: -1 })   
      .limit(10)
      .select("name xp level"); 

    res.json({ success: true, leaderboard });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// controllers/userController.js


{/*export const updateCourseProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.body;
    const user = await User.findById(req.auth.userId);

    console.log("Before update:", user.xp, user.level, user.streak);

    // prevent duplicate
    if (!user.completedLectures.some(l => l.lectureId === lectureId)) {

      user.completedLectures.push({
        lectureId,
        courseId,
        completedAt: new Date()
      });

      // XP
      user.xp += 10;

      // LEVEL
      user.level = Math.floor(user.xp / 100);

      // STREAK
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      if (user.lastActive !== today) {
        user.streak = user.lastActive === yesterday ? user.streak + 1 : 1;
        user.lastActive = today;
      }

      // BADGES
      if (user.xp >= 100 && !user.badges.includes("Beginner")) {
        user.badges.push("Beginner");
      }

      await user.save();  // 🔥 MUST HAVE
    }

    res.json({
      success: true,
      message: "Lecture completed",
      user
    });

    console.log("After update:", user.xp, user.level, user.streak);

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};*/}