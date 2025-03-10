import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URI);
    console.log(`MongoDB connected!`);
    // console.log(`MongoDB connected!: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error connection: ${error.message}`);
    process.exit(1);
  }
};

export default connectMongoDB;
