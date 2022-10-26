import mongoose from 'mongoose';

async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.log(err);
  }
}

export default connectMongo;