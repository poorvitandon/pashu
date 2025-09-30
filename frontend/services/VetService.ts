// Veterinary Services

export interface VeterinaryOfficer {
  id: string;
  name: string;
  qualification: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  state: string;
  specialization: string[];
  availability: string;
  rating: number;
  experience: string;
  languages: string[];
}

const MOCK_VETS: VeterinaryOfficer[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    qualification: 'BVSc & AH, MVSc',
    phone: '+91-9876543210',
    email: 'dr.rajesh@vet.gov.in',
    address: 'Government Veterinary Hospital, Civil Lines',
    district: 'Delhi',
    state: 'Delhi',
    specialization: ['Cattle Medicine', 'Reproduction', 'Surgery'],
    availability: 'Mon-Sat: 9 AM - 5 PM',
    rating: 4.8,
    experience: '15 years',
    languages: ['English', 'Hindi', 'Punjabi']
  },
  {
    id: '2',
    name: 'Dr. Priya Sharma',
    qualification: 'BVSc & AH, PhD',
    phone: '+91-9876543211',
    email: 'dr.priya@vet.gov.in',
    address: 'District Veterinary Center, Sector 14',
    district: 'Gurgaon',
    state: 'Haryana',
    specialization: ['Buffalo Medicine', 'Nutrition', 'Disease Control'],
    availability: 'Mon-Fri: 8 AM - 6 PM',
    rating: 4.9,
    experience: '12 years',
    languages: ['English', 'Hindi']
  },
  {
    id: '3',
    name: 'Dr. Anil Patel',
    qualification: 'BVSc & AH, MVSc',
    phone: '+91-9876543212',
    email: 'dr.anil@vet.gov.in',
    address: 'Animal Husbandry Department, Gandhinagar',
    district: 'Gandhinagar',
    state: 'Gujarat',
    specialization: ['Indigenous Breeds', 'Genetics', 'AI Services'],
    availability: 'Mon-Sat: 9 AM - 4 PM',
    rating: 4.7,
    experience: '20 years',
    languages: ['English', 'Hindi', 'Gujarati']
  },
  {
    id: '4',
    name: 'Dr. Sunita Singh',
    qualification: 'BVSc & AH, MVSc',
    phone: '+91-9876543213',
    email: 'dr.sunita@vet.gov.in',
    address: 'State Animal Husbandry Office, Lucknow',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    specialization: ['Dairy Management', 'Preventive Medicine', 'Surgery'],
    availability: 'Mon-Sat: 10 AM - 5 PM',
    rating: 4.6,
    experience: '18 years',
    languages: ['English', 'Hindi']
  }
];

export interface Emergency {
  id: string;
  title: string;
  description: string;
  phone: string;
  available24x7: boolean;
}

const EMERGENCY_CONTACTS: Emergency[] = [
  {
    id: '1',
    title: 'Animal Emergency Helpline',
    description: 'For livestock emergencies and urgent medical assistance',
    phone: '1962',
    available24x7: true
  },
  {
    id: '2',
    title: 'Cattle Disease Control',
    description: 'Report disease outbreaks and get immediate assistance',
    phone: '+91-11-23070594',
    available24x7: true
  }
];

export class VetService {
  static getVetsByLocation(state: string, district: string): VeterinaryOfficer[] {
    return MOCK_VETS.filter(vet => 
      vet.state.toLowerCase() === state.toLowerCase() && 
      vet.district.toLowerCase() === district.toLowerCase()
    );
  }

  static getAllVets(): VeterinaryOfficer[] {
    return MOCK_VETS;
  }

  static getVetById(id: string): VeterinaryOfficer | undefined {
    return MOCK_VETS.find(vet => vet.id === id);
  }

  static getEmergencyContacts(): Emergency[] {
    return EMERGENCY_CONTACTS;
  }

  static async bookAppointment(vetId: string, farmerPhone: string, preferredDate: string): Promise<{success: boolean, appointmentId?: string, message: string}> {
    // Mock appointment booking
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      appointmentId: `APT${Date.now()}`,
      message: 'Appointment booked successfully. You will receive a confirmation SMS shortly.'
    };
  }
}