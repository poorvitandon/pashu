# P.A.S.H.U Backend API

## Overview
P.A.S.H.U (Precision Agriculture for Smart Husbandry) is a government-aligned mobile application prototype developed for Smart India Hackathon. This backend provides RESTful APIs for livestock management, breed recognition, and government scheme integration.

## Features
- **User Authentication**: Aadhaar and OTP-based authentication
- **Breed Recognition**: AI-powered cattle/buffalo breed identification
- **Cattle Management**: Digital profiles with unique IDs and QR codes
- **Government Schemes**: Integration with livestock-related government schemes
- **Veterinary Services**: Connect farmers with veterinary officers
- **Analytics**: Breed distribution and livestock statistics

## Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **AI Integration**: Mock TensorFlow Lite/PyTorch Mobile

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Setup
1. Clone the repository
```bash
git clone <repository-url>
cd pashu-backend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure environment variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pashu_db
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

5. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Aadhaar Login
```http
POST /api/auth/aadhaar-login
Content-Type: application/json

{
  "aadhaarNumber": "123456789012"
}
```

#### Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210"
}
```

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210",
  "otp": "123456"
}
```

### Breed Recognition Endpoints

#### Recognize Breed
```http
POST /api/ai/recognize-breed
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
- image: <image_file>
```

### Cattle Management Endpoints

#### Get User Cattle
```http
GET /api/cattle/:userId
Authorization: Bearer <token>
```

#### Create Cattle Profile
```http
POST /api/cattle
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "user_id",
  "breed": "Gir",
  "name": "Lakshmi",
  "age": 4,
  "weight": 385,
  "milkYield": "8 L/day"
}
```

### Government Schemes Endpoints

#### Get Schemes
```http
GET /api/schemes?breed=Gir
Authorization: Bearer <token>
```

### Veterinary Services Endpoints

#### Get Veterinary Officers
```http
GET /api/vets?state=Haryana&district=Gurgaon
Authorization: Bearer <token>
```

#### Book Appointment
```http
POST /api/vets/book-appointment
Content-Type: application/json
Authorization: Bearer <token>

{
  "vetId": "vet_id",
  "farmerPhone": "9876543210",
  "preferredDate": "2024-02-01"
}
```

### Analytics Endpoints

#### Get Breed Distribution
```http
GET /api/analytics/breed-distribution
Authorization: Bearer <token>
```

## Database Schema

### User Model
```javascript
{
  name: String,
  phone: String (unique),
  aadhaar: String (unique),
  state: String,
  district: String,
  isVerified: Boolean,
  registrationDate: Date,
  lastLogin: Date
}
```

### Cattle Model
```javascript
{
  digitalId: String (unique),
  userId: ObjectId (ref: User),
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
}
```

## AI Service Integration

The AI service provides mock breed recognition functionality. In production, this would integrate with:

- **TensorFlow Lite**: For mobile-optimized model inference
- **PyTorch Mobile**: Alternative mobile ML framework
- **Cloud ML APIs**: Google Cloud Vision, AWS Rekognition, etc.

### Supported Breeds

**Cattle Breeds:**
- Gir
- Sahiwal
- Red Sindhi
- Tharparkar
- Kankrej

**Buffalo Breeds:**
- Murrah
- Nili-Ravi
- Jaffarabadi

## Error Handling

The API uses standard HTTP status codes:
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

Error Response Format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Security Features

- JWT-based authentication
- Input validation and sanitization
- File upload restrictions
- Rate limiting (production)
- CORS configuration
- Environment variable protection

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Production Checklist
- [ ] Set strong JWT secret
- [ ] Configure MongoDB connection
- [ ] Set up SSL/TLS
- [ ] Configure rate limiting
- [ ] Set up logging
- [ ] Configure monitoring
- [ ] Set up backup strategy

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://production-server/pashu_db
JWT_SECRET=strong_production_secret
CORS_ORIGIN=https://your-frontend-domain.com
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and queries:
- Email: support@pashu.gov.in
- Phone: +91-11-XXXXXXXX
- Documentation: https://docs.pashu.gov.in

## Acknowledgments

- Ministry of Fisheries, Animal Husbandry & Dairying
- National Dairy Development Board (NDDB)
- Smart India Hackathon Organization
- Digital India Initiative