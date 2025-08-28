const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Employee = require('./models/Employee');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await Employee.deleteMany({});

    // Create default admin
    const admin = new Admin({
      name: 'System Admin',
      mobileNumber: '9999999999',
      password: 'admin123'
    });
    await admin.save();

    // Create sample employees
    const employees = [
      {
        name: 'John Doe',
        mobileNumber: '8888888888',
        password: 'employee123',
        employeeId: 'EMP001'
      },
      {
        name: 'Jane Smith',
        mobileNumber: '7777777777',
        password: 'employee123',
        employeeId: 'EMP002'
      }
    ];

    for (const empData of employees) {
      const employee = new Employee(empData);
      await employee.save();
    }

    console.log('Database seeded successfully!');
    console.log('Admin Login: 9999999999 / admin123');
    console.log('Employee Login: 8888888888 / employee123');
    console.log('Employee ID for referral: EMP001');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();