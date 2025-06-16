// src/database.js
/*import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

let isConnected = false;

const connection = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI_PRODUCTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log(`✅ Database connected: ${db.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error);
    throw error;
  }
};

export default connection;*/

import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

const connection = async()=>{
    try {
        const {connection} = await mongoose.connect(process.env.MONGODB_URI_PRODUCTION)
        console.log(`Database is connected on ${connection.host} - ${connection.port}`)
    } catch (error) {
        console.log(error);
    }
}

export default  connection