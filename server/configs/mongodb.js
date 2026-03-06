import mongoose from "mongoose";

//connect to the MongoDB database
const connectDB=async()=>{
    mongoose.connection.on('connected',()=> console.log('Database Connected')) //register the event

    await mongoose.connect(`${process.env.MONGODB_URI}/lms`)  // connect to database
}
export default connectDB