import mongoose from 'mongoose';
const { Schema } = mongoose;
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    minlength: 2,
    maxlength: 50,
    require: [true, 'Name is required']
  },
  email: {
    type: String,
    trim: true,
    require: [true, 'Email is required'],
    unique: true,
    lowecase: true,
  },
  password: {
    type: String,
    trim: true,
    select: false,
    minlength: 6,
    require: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['customer', 'seller', 'admin'],
    default: 'customer',
  },
  isVerifiyed: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    select: false,
  },
  refreshToken: {
    type: String,
    select: false,
  },
  resetPasswordToken: {
    type: String,
    select: false,
  },
  resetPasswordTokenExpires: {
    type: Date,
    select: false,
  },
  
},{timestamps: true});

userSchema.pre('save', async function () {
  if(!this.isModified('password')) return next();
  this.password =  bcrypt.hash(this.password, 10);
  next();
})

userSchema.method.comparePassword = async function (clearPassword) {
  return bcrypt.compare(clearPassword, this.password)
}

export default mongoose.model("User", userSchema)

