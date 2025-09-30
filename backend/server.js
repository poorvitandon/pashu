const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'pashu_secret_key';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection (Mock - using in-memory for prototype)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pashu_db';

// Mock MongoDB connection for prototype
console.log('🚀 P.A.S.H.U Backend Server Starting...');
console.log('📊 Database: MongoDB (Mock Connection)');

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Mock Database Schemas (for reference)
const UserSchema = {
  id: String,
  name: String,
  phone: String,
  aadhaar: String,
  state: String,
  district: String,
  createdAt: Date,
  isVerified: Boolean
};

const CattleSchema = {
  id: String,
  digitalId: String,
  userId: String,
  breed: String,
  name: String,
  age: Number,
  weight: Number,
  healthStatus: String,
  milkYield: String,
  imageUrl: String,
  qrCode: String,
  registrationDate: Date,
  lastCheckup: Date
};

// Mock Data Storage (In production, this would be MongoDB)
let mockUsers = [
  {
    id: '1',
    name: 'Ramesh Kumar',
    phone: '9876543210',
    aadhaar: '123456789012',
    state: 'Haryana',
    district: 'Gurgaon',
    isVerified: true
  }
];

let mockCattle = [
  {
    id: '1',
    digitalId: 'IN-HR-001-2024',
    userId: '1',
    breed: 'Gir',
    name: 'Lakshmi',
    age: 4,
    weight: 385,
    healthStatus: 'Good',
    milkYield: '8 L/day',
    registrationDate: new Date('2024-01-10'),
    lastCheckup: new Date('2024-01-15')
  }
];

let mockSchemes = [
  {
    id: '1',
    name: 'Rashtriya Gokul Mission',
    nameHi: 'राष्ट्रीय गोकुल मिशन',
    description: 'Development and conservation of indigenous bovine breeds',
    descriptionHi: 'देशी गोवंशीय नस्लों का विकास और संरक्षण',
    eligibility: ['Farmers with indigenous cattle breeds', 'Cooperative societies'],
    benefits: 'Financial assistance for breeding, feed, and infrastructure',
    applicableBreeds: ['Gir', 'Sahiwal', 'Tharparkar'],
    ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    subsidy: 'Up to ₹5 lakhs'
  }
];

// Mock AI Breed Recognition Service
const mockBreedRecognition = (imageBuffer) => {
  const breeds = [
    {
      breed: 'Gir',
      confidence: 95.2,
      characteristics: ['Heat tolerant', 'Disease resistant', 'Good milk producer'],
      avgWeight: '385-400 kg',
      avgMilkYield: '6-10 L/day',
      origin: 'Gujarat'
    },
    {
      breed: 'Sahiwal',
      confidence: 92.8,
      characteristics: ['High milk yield', 'Heat tolerant', 'Docile nature'],
      avgWeight: '450-500 kg',
      avgMilkYield: '8-12 L/day',
      origin: 'Punjab'
    },
    {
      breed: 'Murrah',
      confidence: 94.6,
      characteristics: ['High milk yield', 'Long lactation period', 'Black coat'],
      avgWeight: '500-800 kg',
      avgMilkYield: '12-18 L/day',
      origin: 'Haryana'
    }
  ];

  // Simulate AI processing delay and return random breed
  const selectedBreed = breeds[Math.floor(Math.random() * breeds.length)];
  const confidenceVariation = (Math.random() - 0.5) * 10;
  const adjustedConfidence = Math.max(75, Math.min(99, selectedBreed.confidence + confidenceVariation));

  return {
    ...selectedBreed,
    confidence: Math.round(adjustedConfidence * 10) / 10,
    processedAt: new Date().toISOString()
  };
};

// API Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'P.A.S.H.U Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// User Authentication Routes
app.post('/api/auth/aadhaar-login', async (req, res) => {
  try {
    const { aadhaarNumber } = req.body;

    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid 12-digit Aadhaar number required' 
      });
    }

    // Mock Aadhaar verification
    setTimeout(() => {
      const user = mockUsers.find(u => u.aadhaar === aadhaarNumber) || {
        id: Date.now().toString(),
        name: 'New Farmer',
        aadhaar: aadhaarNumber,
        phone: '9876543210',
        state: 'Haryana',
        district: 'Gurgaon',
        isVerified: true
      };

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        success: true,
        message: 'Aadhaar authentication successful',
        user: user,
        token: token
      });
    }, 2000);

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Authentication failed', 
      error: error.message 
    });
  }
});

app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || phoneNumber.length !== 10) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid 10-digit phone number required' 
      });
    }

    // Mock OTP sending
    setTimeout(() => {
      res.json({
        success: true,
        message: 'OTP sent successfully',
        otp: '123456', // Mock OTP for testing
        expiresIn: 300 // 5 minutes
      });
    }, 1500);

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP', 
      error: error.message 
    });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (otp !== '123456') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP' 
      });
    }

    // Mock user creation/login
    const user = mockUsers.find(u => u.phone === phoneNumber) || {
      id: Date.now().toString(),
      name: 'New Farmer',
      phone: phoneNumber,
      state: 'Punjab',
      district: 'Ludhiana',
      isVerified: true
    };

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: 'OTP verification successful',
      user: user,
      token: token
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'OTP verification failed', 
      error: error.message 
    });
  }
});

// Breed Recognition Routes
app.post('/api/ai/recognize-breed', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Image file required' 
      });
    }

    // Simulate AI processing delay
    setTimeout(() => {
      const prediction = mockBreedRecognition(req.file.buffer);
      
      res.json({
        success: true,
        message: 'Breed recognition completed',
        prediction: prediction,
        imageUrl: `/uploads/${req.file.filename}`
      });
    }, 3000);

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Breed recognition failed', 
      error: error.message 
    });
  }
});

// Cattle Management Routes
app.get('/api/cattle/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userCattle = mockCattle.filter(cattle => cattle.userId === userId);

    res.json({
      success: true,
      cattle: userCattle,
      total: userCattle.length
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch cattle data', 
      error: error.message 
    });
  }
});

app.post('/api/cattle', (req, res) => {
  try {
    const { userId, breed, name, age, weight, milkYield } = req.body;

    const newCattle = {
      id: Date.now().toString(),
      digitalId: `IN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId,
      breed,
      name,
      age,
      weight,
      milkYield,
      healthStatus: 'Good',
      registrationDate: new Date(),
      lastCheckup: new Date()
    };

    mockCattle.push(newCattle);

    res.json({
      success: true,
      message: 'Cattle profile created successfully',
      cattle: newCattle
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create cattle profile', 
      error: error.message 
    });
  }
});

// Government Schemes Routes
app.get('/api/schemes', (req, res) => {
  try {
    const { breed } = req.query;

    let filteredSchemes = mockSchemes;
    if (breed && breed !== 'All') {
      filteredSchemes = mockSchemes.filter(scheme => 
        scheme.applicableBreeds.includes(breed) || 
        scheme.applicableBreeds.includes('All breeds')
      );
    }

    res.json({
      success: true,
      schemes: filteredSchemes,
      total: filteredSchemes.length
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch schemes', 
      error: error.message 
    });
  }
});

// Veterinary Services Routes
app.get('/api/vets', (req, res) => {
  try {
    const { state, district } = req.query;

    const mockVets = [
      {
        id: '1',
        name: 'Dr. Rajesh Kumar',
        qualification: 'BVSc & AH, MVSc',
        phone: '+91-9876543210',
        email: 'dr.rajesh@vet.gov.in',
        address: 'Government Veterinary Hospital, Civil Lines',
        district: district || 'Delhi',
        state: state || 'Delhi',
        specialization: ['Cattle Medicine', 'Reproduction', 'Surgery'],
        availability: 'Mon-Sat: 9 AM - 5 PM',
        rating: 4.8,
        experience: '15 years'
      }
    ];

    res.json({
      success: true,
      vets: mockVets,
      total: mockVets.length
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch veterinary officers', 
      error: error.message 
    });
  }
});

app.post('/api/vets/book-appointment', (req, res) => {
  try {
    const { vetId, farmerPhone, preferredDate } = req.body;

    // Mock appointment booking
    setTimeout(() => {
      res.json({
        success: true,
        appointmentId: `APT${Date.now()}`,
        message: 'Appointment booked successfully. You will receive a confirmation SMS shortly.',
        scheduledDate: preferredDate,
        status: 'confirmed'
      });
    }, 1000);

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to book appointment', 
      error: error.message 
    });
  }
});

// Analytics and Reports Routes
app.get('/api/analytics/breed-distribution', (req, res) => {
  try {
    const mockDistribution = {
      'Haryana': { 'Gir': 1200, 'Sahiwal': 800, 'Murrah': 1500 },
      'Punjab': { 'Sahiwal': 2000, 'Murrah': 1800, 'Nili-Ravi': 600 },
      'Gujarat': { 'Gir': 3000, 'Kankrej': 1200, 'Jaffarabadi': 800 },
      'Rajasthan': { 'Tharparkar': 1500, 'Gir': 1000, 'Kankrej': 500 }
    };

    res.json({
      success: true,
      distribution: mockDistribution,
      totalStates: Object.keys(mockDistribution).length,
      totalAnimals: Object.values(mockDistribution).reduce((total, state) => 
        total + Object.values(state).reduce((sum, count) => sum + count, 0), 0
      )
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch breed distribution', 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 P.A.S.H.U Backend Server running on port ${PORT}`);
  console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log('🐄 Ready to serve livestock management requests!');
});

module.exports = app;