import mongoose from "mongoose";

export async function connect() {
    console.log("DB_URL ",process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

 
    console.log("connected to mongodb");
} 