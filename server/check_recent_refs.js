import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const bookingSchema = new mongoose.Schema({}, { strict: false });
const Booking = mongoose.model('Booking', bookingSchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_CONN);
  console.log("Connected to MongoDB");
  
  const recent = await Booking.find().sort({ createdAt: -1 }).limit(5);
  console.log("Recent Bookings:");
  recent.forEach(b => {
    console.log(`- Ref: ${b.bookingRef}, ID: ${b._id}, Created: ${b.createdAt}`);
  });
  
  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
