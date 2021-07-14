const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const studentSchema = new mongoose.Schema({
    firstname : {
        type: String,
        required:true
    },
    lastname : {
        type: String,
        required:true
    },
    emailaddress: {
        type: String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    confirmpassword: {
        type: String,
        required:true
    }
})

studentSchema.pre("save",async function(next){
    if(this.isModified("password")){
    //  const PasswordHash = await bcyrpt.hash(password,10);
    console.log(`current password is ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`current password is ${this.password}`);
    this.confirmpassword = undefined;
    }
    next();
})
// now we need to create a collection
const Register = new mongoose.model("Register",studentSchema);
module.exports = Register;