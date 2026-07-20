import Stripe from "stripe";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";

//get all courses
export const getAllCourse=async(req, res)=>{
    try {
        const courses=await Course.find({isPublished:true}).select(['-courseContent', '-enrolledStudents']).populate({path:'educator'})
        res.json({success:true, courses})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
   
}// get course by id
export const getCourseId=async(req, res)=>{
    const {id}=req.params
    try {
        const courseData=await Course.findById(id).populate({path:'educator'})
        //remove lecture url if isPreviewFree is false
        courseData.courseContent.forEach(chapter=>{
            //chapter.chapterId = crypto.randomUUID();
            chapter.chapterContent.forEach(lecture=>{
                //lecture.lectureId = crypto.randomUUID()
                if(!lecture.isPreviewFree){
                    lecture.lectureUrl="";

                }
            })
        })
        res.json({success:true, courseData})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const completeLecture = async (req, res) => {
  try {
    const { lectureId } = req.body;
    const { userId } = req.auth();

    const user = await User.findById(userId);

    if (!user.completedLectures.includes(lectureId)) {
      user.completedLectures.push(lectureId);

      // Give XP
      user.xp += 10;

      //STREAK
      
      const today = new Date().toDateString();

      if (user.lastActive !== today) {
        user.streak += 1;
        user.lastActive = today;
      }

      //BADGE 
      if (user.xp >= 100 && !user.badges.includes("Beginner")) {
        user.badges.push("Beginner");
      }



      // Level up logic
      if (user.xp >= user.level * 100) {
        user.level += 1;
      }

      await user.save();
    }

    res.json({ success: true,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      badges: user.badges });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const getRecommendation = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // 1. Get all courses the user is enrolled in
    const enrollments = await Purchase.find({ 
      userId, 
      payment: 'completed' 
    }).select('courseId');

    const enrolledCourseIds = enrollments.map(e => e.courseId.toString());

    // 2. Handle New Users or users with no successful purchases
    if (enrolledCourseIds.length === 0) {
      const popular = await Course.find({ isPublished: true })
        .sort({ rating: -1, enrolledStudents: -1 })
        .limit(4);
      return res.json({ success: true, recommendations: popular, type: 'popular' });
    }

    // 3. Extract Categories and Tags from enrolled courses
    const enrolledCourses = await Course.find({
      _id: { $in: enrolledCourseIds }
    }).select('category tags');

    const categories = [...new Set(enrolledCourses.map(c => c.category).filter(Boolean))];
    const tags = [...new Set(enrolledCourses.flatMap(c => c.tags || []).filter(Boolean))];

    let recommendations = [];

    // 4. Personalized Search (only if user has history data)
    if (categories.length > 0 || tags.length > 0) {
      recommendations = await Course.find({
        _id: { $nin: enrolledCourseIds },
        isPublished: true,
        $or: [
          { category: { $in: categories } },
          { tags: { $in: tags } },
        ]
      })
      .sort({ enrolledStudents: -1 }) // Sort by most students for quality
      .limit(4);
    }

    // 5. Fallback/Fill: If we found < 4 recommendations, fill the rest with top-rated/popular courses
    if (recommendations.length < 4) {
      const currentRecIds = recommendations.map(r => r._id.toString());
      const excludeIds = [...enrolledCourseIds, ...currentRecIds];

      const filler = await Course.find({
        _id: { $nin: excludeIds },
        isPublished: true
      })
      .sort({ enrolledStudents: -1 })
      .limit(4 - recommendations.length);

      recommendations = [...recommendations, ...filler];
    }

    res.json({ 
      success: true, 
      recommendations, 
      type: enrolledCourseIds.length > 0 ? 'personalized' : 'popular' 
    });

  } catch (error) {
    console.error("Recommendation Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


{/*export const getRecommendation = async (req, res) => {
  try {
    const userId = req.auth.userId;
    console.log('userId:', userId); 

    // 1. Get all courses the user is enrolled in
    const enrollments = await Purchase.find({ 
      userId, 
      payment: 'completed'  // ← only count successful purchases
    }).select('courseId');
    console.log('enrollments found:', enrollments); // ← log 2
    console.log('enrolledCourseIds:', enrollments.map(e => e.courseId.toString()))

    const enrolledCourseIds = enrollments.map(e => e.courseId.toString());

    if (enrolledCourseIds.length === 0) {
      // New user - return popular courses instead
      const popular = await Course.find({ isPublished: true })
        .sort({ enrolledStudents: -1 })
        .limit(4);
      return res.json({ success: true, recommendations: popular, type: 'popular' });
    }

    // 2. Get categories/tags from enrolled courses
    const enrolledCourses = await Course.find({
      _id: { $in: enrolledCourseIds }
    }).select('category tags');
    console.log('enrolledCourses:', enrolledCourses);

    const categories = [...new Set(enrolledCourses.map(c => c.category))];
    const tags = [...new Set(enrolledCourses.flatMap(c => c.tags || []))];
    console.log('categories:', categories); // ← add this
console.log('tags:', tags);

    // 3. Find similar courses not yet enrolled in
    
    const recommendations = await Course.find({
      _id: { $nin: enrolledCourseIds },   // exclude enrolled
      isPublished: true,
      $or: [
        { category: { $in: categories } }, // same category
        { tags: { $in: tags } },           // same tags
      ]
    })
    .sort({ createdAt: -1 })        // sort by popularity
    .limit(4);
    

    console.log('recommendations found:', recommendations.map(r => r.courseTitle));

    res.json({ success: true, recommendations, type: 'personalized' });
  

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
*/}