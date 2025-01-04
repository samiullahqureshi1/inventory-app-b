import mongoose from "mongoose";
const db_name = `Cosmetic`;

export const db_connection = async () => {
    try {
        const db_instance = await mongoose.connect(`${process.env.MONGODB_URI}${db_name}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 30000, // 30 seconds
            socketTimeoutMS: 45000, // 45 seconds
        });
        
        console.log(`Data Base Connected: ${db_instance.connection.host}`)
    } catch (error) {
        console.log(`Error Occurs:`, error.message)
    }
}