import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Lead from '../models/Lead';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-leads';

const seedUsers = [
  { name: 'Admin User', email: 'admin@smartleads.com', password: 'admin123', role: 'admin' as const },
  { name: 'Sales User', email: 'sales@smartleads.com', password: 'sales123', role: 'sales' as const },
];

const leadNames = [
  'Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Neha Gupta', 'Vikram Patel',
  'Sneha Reddy', 'Arjun Nair', 'Pooja Mehta', 'Rajan Verma', 'Kavya Iyer',
  'Suresh Bhat', 'Ananya Das', 'Rohit Joshi', 'Divya Rao', 'Kiran Pillai',
];

const statuses = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
const sources = ['Website', 'Instagram', 'Referral'] as const;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create users
    const createdUsers = await User.create(seedUsers);
    const adminUser = createdUsers[0];
    const salesUser = createdUsers[1];
    console.log(`👤 Created ${createdUsers.length} users`);

    // Create leads
    const leads = leadNames.map((name, i) => ({
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      status: statuses[i % statuses.length],
      source: sources[i % sources.length],
      notes: i % 3 === 0 ? `Follow up scheduled for next week` : undefined,
      createdBy: i % 3 === 0 ? salesUser._id : adminUser._id,
    }));

    await Lead.create(leads);
    console.log(`📋 Created ${leads.length} leads`);

    console.log('\n🎉 Seed complete!');
    console.log('─────────────────────────────────────');
    console.log('Admin:  admin@smartleads.com / admin123');
    console.log('Sales:  sales@smartleads.com / sales123');
    console.log('─────────────────────────────────────');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
