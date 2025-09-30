// Mock AI Service for Breed Recognition
// In production, this would integrate with TensorFlow Lite or PyTorch Mobile

export interface BreedPrediction {
  breed: string;
  confidence: number;
  characteristics: string[];
  avgWeight: string;
  avgMilkYield: string;
  origin: string;
}

// Mock cattle breeds data
const CATTLE_BREEDS: BreedPrediction[] = [
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
    breed: 'Red Sindhi',
    confidence: 89.5,
    characteristics: ['Heat resistant', 'Good mothering ability', 'Hardy breed'],
    avgWeight: '350-400 kg',
    avgMilkYield: '5-8 L/day',
    origin: 'Sindh'
  },
  {
    breed: 'Tharparkar',
    confidence: 91.3,
    characteristics: ['Drought tolerant', 'Dual purpose', 'Long lactation'],
    avgWeight: '400-450 kg',
    avgMilkYield: '7-10 L/day',
    origin: 'Rajasthan'
  },
  {
    breed: 'Kankrej',
    confidence: 88.7,
    characteristics: ['Strong and sturdy', 'Good draught animal', 'Heat tolerant'],
    avgWeight: '500-600 kg',
    avgMilkYield: '4-6 L/day',
    origin: 'Gujarat'
  }
];

const BUFFALO_BREEDS: BreedPrediction[] = [
  {
    breed: 'Murrah',
    confidence: 94.6,
    characteristics: ['High milk yield', 'Long lactation period', 'Black coat'],
    avgWeight: '500-800 kg',
    avgMilkYield: '12-18 L/day',
    origin: 'Haryana'
  },
  {
    breed: 'Nili-Ravi',
    confidence: 91.2,
    characteristics: ['Wall eyes', 'High fat content milk', 'Large body'],
    avgWeight: '450-650 kg',
    avgMilkYield: '10-15 L/day',
    origin: 'Punjab'
  },
  {
    breed: 'Jaffarabadi',
    confidence: 87.9,
    characteristics: ['Large size', 'Curved horns', 'High milk yield'],
    avgWeight: '600-800 kg',
    avgMilkYield: '8-12 L/day',
    origin: 'Gujarat'
  }
];

export class AIService {
  static async recognizeBreed(imageUri: string): Promise<BreedPrediction> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock prediction logic - randomly select a breed with some variation in confidence
    const allBreeds = [...CATTLE_BREEDS, ...BUFFALO_BREEDS];
    const selectedBreed = allBreeds[Math.floor(Math.random() * allBreeds.length)];
    
    // Add some randomness to confidence
    const confidenceVariation = (Math.random() - 0.5) * 10;
    const adjustedConfidence = Math.max(75, Math.min(99, selectedBreed.confidence + confidenceVariation));
    
    return {
      ...selectedBreed,
      confidence: Math.round(adjustedConfidence * 10) / 10
    };
  }

  static getBreedsByState(state: string): BreedPrediction[] {
    // Return breeds commonly found in specific states
    const stateBreedMap: { [key: string]: string[] } = {
      'Gujarat': ['Gir', 'Kankrej', 'Jaffarabadi'],
      'Punjab': ['Sahiwal', 'Nili-Ravi'],
      'Haryana': ['Murrah', 'Sahiwal'],
      'Rajasthan': ['Tharparkar', 'Gir'],
      'Maharashtra': ['Gir', 'Red Sindhi'],
      'Uttar Pradesh': ['Murrah', 'Sahiwal']
    };

    const stateBreeds = stateBreedMap[state] || ['Gir', 'Sahiwal'];
    return [...CATTLE_BREEDS, ...BUFFALO_BREEDS].filter(breed => 
      stateBreeds.includes(breed.breed)
    );
  }
}