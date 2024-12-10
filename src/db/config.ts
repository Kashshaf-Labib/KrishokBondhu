// import mongoose from "mongoose";

// const connectDB = async () => {
//   if (!process.env.MONGODB_URI) {
//     throw new Error("MONGODB_URI is not defined");
//   }
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       dbName: process.env.DBNAME,
//     });
//     console.log("Connected to MongoDB");
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err);
//     process.exit(1);
//   }
// };

// export default connectDB;

import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

interface MongooseConn {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConn = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "krishokbondhu",
      // bufferCommands: false,
      // connectTimeoutMS: 10000,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
