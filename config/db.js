import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    console.log("MONGO_URI:", process.env.MONGO_URI);
  } catch (error) {
    console.error("Database Connection Failed", error);
    process.exit(1);
  }
};

export default connectDB;
