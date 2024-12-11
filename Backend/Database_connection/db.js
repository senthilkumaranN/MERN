const mongoose = require('mongoose');


const connectdb = async ()=>{
    try{
       await mongoose.connect(process.env.MONGO_URL)
       console.log("database connected successfully")
    }catch(error){
        console.log("database connection error :",error);
        process.exit(1)
    }
}

module.exports = connectdb