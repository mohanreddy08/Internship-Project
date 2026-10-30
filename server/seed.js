const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

const seedData = async (isAutoSeed = false) => {
  try {
    if (!isAutoSeed) {
      console.log('Connecting to database...');
      await connectDB();
    }

    // Check if auto-seed and data already exists
    if (isAutoSeed) {
      const existingEvents = await Event.countDocuments();
      if (existingEvents > 0) {
        console.log('Database already populated with events. Skipping auto-seed.');
        return;
      }
    }

    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    console.log('Cleared User, Event, and Registration collections.');

    // Hash default password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 1. Create Users
    console.log('Seeding users...');
    const admin = await User.create({
      name: 'Dr. Ramesh Kumar (Club Lead)',
      email: 'admin@campussync.edu',
      password: hashedPassword,
      rollNumber: 'ADMIN01',
      department: 'CSE',
      role: 'admin',
    });

    const student1 = await User.create({
      name: 'Aarav Sharma',
      email: 'student@campussync.edu',
      password: hashedPassword,
      rollNumber: '24CSE101',
      department: 'CSE',
      role: 'student',
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@campussync.edu',
      password: hashedPassword,
      rollNumber: '24ECE205',
      department: 'ECE',
      role: 'student',
    });

    const student3 = await User.create({
      name: 'Vikram Verma',
      email: 'vikram@campussync.edu',
      password: hashedPassword,
      rollNumber: '24MECH301',
      department: 'MECH',
      role: 'student',
    });

    console.log('Users seeded:');
    console.log(`  - Admin: ${admin.email} (password123)`);
    console.log(`  - Student 1: ${student1.email} (password123)`);
    console.log(`  - Student 2: ${student2.email} (password123)`);

    // 2. Create 5 Realistic Engineering College Events
    console.log('Seeding 5 realistic events...');

    // Event 1: CodeFusion 24-Hr Hackathon
    const event1 = await Event.create({
      title: 'CodeFusion 24-Hr Hackathon',
      description: 'The flagship annual 24-hour hackathon bringing together college innovators to build impactful web, mobile, and AI solutions with mentor support and prizes worth ₹1,00,000.',
      clubName: 'ACM Student Chapter & Coding Club',
      department: 'CSE',
      category: 'Hackathon',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      venue: 'Main Auditorium & Innovation Labs',
      maxCapacity: 100,
      registeredCount: 1,
      createdBy: admin._id,
    });

    // Event 2: MERN Stack Web Dev Workshop
    const event2 = await Event.create({
      title: 'MERN Stack Web Dev Workshop',
      description: 'Hands-on intensive masterclass on modern full-stack development with React, Node.js, Express, and MongoDB. Build and deploy a real-world project within 6 hours.',
      clubName: 'Web Developers Guild',
      department: 'IT',
      category: 'Workshop',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      venue: 'Lab 402, IT Block',
      maxCapacity: 50,
      registeredCount: 0,
      createdBy: admin._id,
    });

    // Event 3: Lakshya Techno-Cultural Fest
    const event3 = await Event.create({
      title: 'Lakshya Techno-Cultural Fest',
      description: 'The mega annual inter-collegiate cultural and technical festival featuring battle of bands, dance wars, gaming arena, robotics combats, and celebrity guest performances.',
      clubName: 'Student Affairs Council',
      department: 'CSE',
      category: 'Fest',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      venue: 'College Open Air Theatre (OAT)',
      maxCapacity: 500,
      registeredCount: 0,
      createdBy: admin._id,
    });

    // Event 4: AI & Prompt Engineering Seminar
    const event4 = await Event.create({
      title: 'AI & Prompt Engineering Seminar',
      description: 'Keynote discourse by industry AI leaders exploring generative AI architectures, LLM fine-tuning, retrieval-augmented generation (RAG), and career avenues in AI.',
      clubName: 'AI & Machine Learning Club',
      department: 'ECE',
      category: 'Seminar',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      venue: 'Seminar Hall B, APJ Abdul Kalam Block',
      maxCapacity: 80,
      registeredCount: 0,
      createdBy: admin._id,
    });

    // Event 5: IoT & Robotics Bootcamp (Capacity: 2, registeredCount: 2 for waitlist testing)
    const event5 = await Event.create({
      title: 'IoT & Robotics Bootcamp',
      description: 'Hands-on hardware lab with Arduino, ESP32, ROS, and sensor arrays. Limited seats due to individual physical kit allotment. Waitlist opens automatically once full.',
      clubName: 'Robotics & Automation Society',
      department: 'EEE',
      category: 'Workshop',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      venue: 'Mechatronics & IoT Center of Excellence',
      maxCapacity: 2,
      registeredCount: 2, // Full - waitlist demonstration
      createdBy: admin._id,
    });

    console.log('5 Events seeded successfully.');

    // 3. Seed Initial Registrations
    console.log('Seeding initial registrations...');
    // Confirmed pass for student1 on CodeFusion Hackathon
    await Registration.create({
      eventId: event1._id,
      userId: student1._id,
      passId: 'CSYNC-HACK01',
      status: 'confirmed',
      registeredAt: new Date(),
    });

    // Two registrations filling IoT & Robotics Bootcamp (spot 1 and 2)
    await Registration.create({
      eventId: event5._id,
      userId: student2._id,
      passId: 'CSYNC-ROBO01',
      status: 'confirmed',
      registeredAt: new Date(Date.now() - 3600000),
    });

    await Registration.create({
      eventId: event5._id,
      userId: student3._id,
      passId: 'CSYNC-ROBO02',
      status: 'confirmed',
      registeredAt: new Date(Date.now() - 1800000),
    });

    console.log('Initial registrations seeded successfully.');
    console.log('✅ CampusSync Database seeding complete!');

    if (!isAutoSeed) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Database seeding failed:', error);
    if (!isAutoSeed) {
      process.exit(1);
    }
  }
};

// If run directly: `node seed.js`
if (require.main === module) {
  seedData(false);
}

module.exports = seedData;
