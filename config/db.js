const mongoose = require("mongoose");

const connection = async()=>{
    try {
        await mongoose.connect("mongodb+srv://faizan:faizan@cluster0.dvtb7.mongodb.net/S3Bucket?retryWrites=true&w=majority")
    } catch (error) {
        console.log(error);
    }
}

module.exports = {connection}