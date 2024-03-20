import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    const mongoUri = process.env.MONGO_URI!;
    mongoose.connect(mongoUri);
  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
