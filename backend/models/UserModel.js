import mongoose from "mongoose";



// we will migrate Employer, JobSeeker, Admin to this single User schema

const userSchema = new mongoose.Schema({
    
});

export default mongoose.model("User", userSchema);
