const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
{
  duration: Number,
  doctor: String,
  date: String,
  status: String,
  patient: String
}, {timestamps: true}
);

module.exports = mongoose.model("Appointment", appointmentSchema)
