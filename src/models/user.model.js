import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true, //to make it searchable (optimized)
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String, //cloudinary url
    required: true,
  },
  coverImage: {
    type: String, //cloudinary url
  },
  watchHistory: [
    {
        type: Schema.Types.ObjectId,
        ref: "Video"
    }
  ],
  password: {
    type: String,
    required: [true, 'Password is required'] // custom err messege with true field 
  },
  refreshToken: {
    type: String
  }
}, {timestamps: true});


//hook
userSchema.pre("save", async function (next) { //do not use call-back functions as they do not have current context (this)
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10); //(password that need to be hashed, rounds)
        return;
    } else return;
})

//custom method
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}
//methods to generate jwt tokens
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {                           //payload
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET, //access token secret
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY  //expiry
        }
    )
}
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {                           //payload
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET, //access token secret
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY  //expiry
        }
    )
}

export const User = mongoose.model("User", userSchema);
