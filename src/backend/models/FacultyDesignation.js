const mongoose = require('mongoose');

const facultyDesignationSchema = new mongoose.Schema({
  staffType: {
    type: String,
    enum: ['teaching', 'non-teaching'],
    required: true,
    unique: true
  },
  designations: [{
    type: String,
    required: true
  }]
}, {
  timestamps: true
});

const FacultyDesignation = mongoose.model('FacultyDesignation', facultyDesignationSchema);

// Default designation data
const defaultDesignations = {
  teaching: [
    "Professor",
    "Assistant Professor",
    "Senior Assistant Professor",
    "Associate Professor",
    "Professor of Practice",
    "Dean (Student Progression)",
    "Dean (IQAC)",
    "Dean (Academics)",
    "Deputy Dean (Administration & Finance)",
    "Head of Department",
    "Head (Innovation, Incubation & Entrepreneurship)",
    "Director (Advancement)",
    "Principal",
    "Controller of Examinations",
    "RDC Head",
    "Assistant Computer Programmer"
  ],
  "non-teaching": [
    "Skilled Assistant",
    "Jr.Assistant",
    "JCP",
    "Computer Operator",
    "Nurse",
    "Plumber",
    "Attender",
    "Jr. Assistant",
    "Professor of Practice",
    "Manager - Marketing",
    "Sweeper / Helper",
    "Record Assistant",
    "Asst. Comp. Programmer",
    "Junior Computer  Programmer",
    "Network &H/W Programmer",
    "Other Satff",
    "Driver",
    "Chief Security & Vigilance Officer",
    "Site Engineer",
    "Library Assistant",
    "FOE",
    "ADMIN OFFICER",
    "Soft Skills Trainer",
    "Head of the Department",
    "Medical Officer",
    "Residential Supervisior",
    "Executive Assistant",
    "Helper",
    "Jr.Accountant",
    "Trainer",
    "Jr. Skilled Assistant",
    "Sr. Skilled Asst.",
    "Site Supervisor",
    "House Keeper",
    "Sr. Site Supervisor",
    "Network and H/w Programmer",
    "Assistant Administrative Officer",
    "G M ( A & F)",
    "Sweeper",
    "Corporate Relation Officer",
    "Manager Estates",
    "Manager",
    "Team lead for CSR Funds",
    "Executive Stores",
    "Networking Assistant",
    "Electrician",
    "Non Resident Hostel Supervisor",
    "Yoga Teacher",
    "HR Manager",
    "Manager - Marketing & Communications",
    "Senior Accountant",
    "Consultant / Advisor",
    "Sr. Asst. Librarian",
    "computer programmer",
    "sys.adm",
    "Officer - Learning & Development",
    "Accounts Officer",
    "Sr Assistant",
    "Basketball Trainer",
    "Assistant Training Placement Officer",
    "Gym Trainer",
    "Mason",
    "Project Manager",
    "Head Corporate Relations",
    "Supervisor",
    "Jr. Asst. Librarian",
    "Legal Advisor",
    "Superintendent",
    "Purchase Manager",
    "Senior Manager",
    "Assistant Professor",
    "Accountant",
    "Head - Purchase",
    "Jr.SE",
    "Senior Engineer",
    "Sr. Instructor",
    "Jr Network Engineer",
    "Sr. Manager",
    "Senior Administrative Assistant",
    "Security"
  ]
};

// Initialize function to populate default data
async function initializeDesignations() {
  try {
    const teachingExists = await FacultyDesignation.findOne({ staffType: 'teaching' });
    const nonTeachingExists = await FacultyDesignation.findOne({ staffType: 'non-teaching' });

    if (!teachingExists) {
      await FacultyDesignation.create({
        staffType: 'teaching',
        designations: defaultDesignations.teaching
      });
      console.log('Teaching designations initialized');
    }

    if (!nonTeachingExists) {
      await FacultyDesignation.create({
        staffType: 'non-teaching',
        designations: defaultDesignations['non-teaching']
      });
      console.log('Non-teaching designations initialized');
    }
  } catch (error) {
    console.error('Error initializing faculty designations:', error);
  }
}

module.exports = {
  FacultyDesignation,
  initializeDesignations,
  defaultDesignations
};

// Run initialization if this file is executed directly
if (require.main === module) {
  const mongoose = require('mongoose');
  
  // Load environment variables if .env exists
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
  
  const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/nodues';
  
  console.log('Connecting to MongoDB...');
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB successfully');
      console.log('Initializing faculty designations...');
      await initializeDesignations();
      console.log('Faculty designations initialized successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    });
}
