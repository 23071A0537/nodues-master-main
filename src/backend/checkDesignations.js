const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const { FacultyDesignation } = require('./models/FacultyDesignation');

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully\n');
    
    const allDesignations = await FacultyDesignation.find({});
    
    console.log(`Total records found: ${allDesignations.length}\n`);
    
    allDesignations.forEach(record => {
      console.log(`Staff Type: ${record.staffType}`);
      console.log(`Number of designations: ${record.designations.length}`);
      console.log(`Designations: ${record.designations.slice(0, 5).join(', ')}...`);
      console.log('---');
    });
    
    process.exit(0);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
