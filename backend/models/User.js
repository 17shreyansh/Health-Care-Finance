const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  fatherName: { type: String, required: true },
  profileImage: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  employeeId: { type: String, required: true },
  userId: { type: String, unique: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  role: { type: String, default: 'user' },
  paymentStatus: { type: String, enum: ['pending', 'successful', 'rejected'], default: 'pending' },
  paymentAmount: { type: Number, default: 500 }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.userId) {
    this.userId = 'HC' + Date.now().toString().slice(-8);
  }
  if (!this.endDate) {
    this.endDate = new Date(Date.now() + 730 * 24 * 60 * 60 * 1000);
  }
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);