import mongoose from "mongoose";

export const connectDB=async () => {
    try {
        const mongodbUrl = process.env.MONGODB_URL?.replace(
            /(mongodb(?:\+srv)?:\/\/[^/?]+)\/[^?]*(\?.*)?$/,
            "$1/interview$2"
        )
        await mongoose.connect(mongodbUrl)
        console.log("Connected DB")
    } catch (error) {
        console.log("MongoDb error",error)
    }
    
}