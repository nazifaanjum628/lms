import mongoose from 'mongoose'
const userSchema=new mongoose.Schema(
    {
   _id:{type:String, required:true},
    name:{type:String, required:true},
    email:{type:String, required:true},
    imageUrl:{type:String, required:true},
    enrolledCourses:[{
        type:mongoose.Schema.Types.ObjectId,
         ref:'Course'
        }
    ],
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date },
    badges: { type: [String], default: [] },

completedLectures: [{ 
    lectureId: String,
    lectureTitle: String,      
    courseId: String,       
    completedAt: Date }], 
}, {timestamps:true}
);
const User=mongoose.model('User', userSchema);
export default User