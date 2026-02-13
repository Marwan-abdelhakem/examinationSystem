import mongoose from "mongoose"

const connectDb = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/examinationSystem")
        console.log("Database connect Successfully")
    } catch (error) {
        console.log("Database connection Error", error.message)
    }
}

export default connectDb