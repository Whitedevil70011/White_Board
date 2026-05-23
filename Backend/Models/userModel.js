const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// valiadte 
const validator = require('validator');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{  
        type:String,
        required:true,
        unique:true
        }       

    },{
        timestamps:true,
        collection:"user" 
    }
)


userSchema.statics.registerUser = async function(name, email, password) {

    if (!validator.isEmail(email)) {
        throw new Error("Invalid email address");
    }

    if (!validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0
    })) {
        throw new Error("Password must be at least 6 characters with at least 1 number");
    }

    // check user already exists
    const existingUser = await this.findOne({ email });

    if(existingUser) {
        throw new Error("User already exists");
    }

    // create user with hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.create({
        name,
        email,
        password: hashedPassword
    });

    return user;
};



userSchema.statics.getUsers = async function() {

    try {

        const users = await this.find();

        return users;

    } catch(error) {

        throw new Error("Error getting users: " + error.message);
    }
};


userSchema.statics.getUser = async function(email) {
    try {
        const user = await this.findOne({ email });

        return user;
    } catch (error) {
        throw new Error("Error getting user: " + error.message);
    }
};


userSchema.statics.login = async function(email, password) {
    try {
        const user = await this.findOne({ email });
        if (!user) {
            throw new Error("Invalid login credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid login credentials");
        }

        return user;
    } catch (error) {
        throw new Error("Error logging in: " + error.message);
    }
};



const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;