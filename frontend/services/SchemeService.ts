// Government Schemes Service

export interface GovernmentScheme {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  eligibility: string[];
  eligibilityHi: string[];
  benefits: string;
  benefitsHi: string;
  applicableBreeds: string[];
  ministry: string;
  applicationUrl: string;
  deadline?: string;
  subsidy?: string;
}

const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: '1',
    name: 'Rashtriya Gokul Mission',
    nameHi: 'राष्ट्रीय गोकुल मिशन',
    description: 'Development and conservation of indigenous bovine breeds',
    descriptionHi: 'देशी गोवंशीय नस्लों का विकास और संरक्षण',
    eligibility: [
      'Farmers with indigenous cattle breeds',
      'Cooperative societies',
      'Self Help Groups'
    ],
    eligibilityHi: [
      'देशी गोवंशीय नस्लों वाले किसान',
      'सहकारी समितियां',
      'स्वयं सहायता समूह'
    ],
    benefits: 'Financial assistance for breeding, feed, and infrastructure',
    benefitsHi: 'प्रजनन, आहार और बुनियादी ढांचे के लिए वित्तीय सहायता',
    applicableBreeds: ['Gir', 'Sahiwal', 'Tharparkar', 'Red Sindhi', 'Kankrej'],
    ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    applicationUrl: 'https://dahd.nic.in',
    subsidy: 'Up to ₹5 lakhs'
  },
  {
    id: '2',
    name: 'National Programme for Dairy Development',
    nameHi: 'राष्ट्रीय डेयरी विकास कार्यक्रम',
    description: 'Support for dairy infrastructure and milk production',
    descriptionHi: 'डेयरी बुनियादी ढांचे और दूध उत्पादन के लिए सहायता',
    eligibility: [
      'Dairy farmers',
      'Dairy cooperative societies',
      'Producer organizations'
    ],
    eligibilityHi: [
      'डेयरी किसान',
      'डेयरी सहकारी समितियां',
      'उत्पादक संगठन'
    ],
    benefits: 'Subsidy for milking machines, bulk milk coolers, and dairy equipment',
    benefitsHi: 'दुग्धन मशीन, बल्क मिल्क कूलर और डेयरी उपकरणों पर सब्सिडी',
    applicableBreeds: ['Murrah', 'Sahiwal', 'Gir', 'Nili-Ravi'],
    ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    applicationUrl: 'https://www.nddb.coop',
    subsidy: '25-33% subsidy'
  },
  {
    id: '3',
    name: 'Livestock Insurance Scheme',
    nameHi: 'पशुधन बीमा योजना',
    description: 'Insurance coverage for cattle and buffalo',
    descriptionHi: 'गाय और भैंस के लिए बीमा कवरेज',
    eligibility: [
      'All farmers owning cattle/buffalo',
      'Animals aged 2-8 years',
      'Healthy animals only'
    ],
    eligibilityHi: [
      'गाय/भैंस रखने वाले सभी किसान',
      '2-8 साल की उम्र के जानवर',
      'केवल स्वस्थ जानवर'
    ],
    benefits: 'Insurance coverage against death due to disease/accident',
    benefitsHi: 'बीमारी/दुर्घटना से मृत्यु के विरुद्ध बीमा कवरेज',
    applicableBreeds: ['All breeds'],
    ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    applicationUrl: 'https://dahd.nic.in/schemes/livestock-insurance',
    subsidy: 'Premium subsidy available'
  },
  {
    id: '4',
    name: 'Artificial Insemination Programme',
    nameHi: 'कृत्रिम गर्भाधान कार्यक्रम',
    description: 'Genetic improvement through artificial insemination',
    descriptionHi: 'कृत्रिम गर्भाधान के माध्यम से आनुवंशिक सुधार',
    eligibility: [
      'Farmers with breeding females',
      'Registered with local veterinary department'
    ],
    eligibilityHi: [
      'प्रजनन मादाओं वाले किसान',
      'स्थानीय पशु चिकित्सा विभाग में पंजीकृत'
    ],
    benefits: 'Free AI services and high genetic merit semen',
    benefitsHi: 'निःशुल्क AI सेवाएं और उच्च आनुवंशिक योग्यता वाला वीर्य',
    applicableBreeds: ['Gir', 'Sahiwal', 'Murrah', 'Tharparkar'],
    ministry: 'Ministry of Fisheries, Animal Husbandry & Dairying',
    applicationUrl: 'https://dahd.nic.in/related-links/state-animal-husbandry-departments',
    subsidy: 'Free service'
  }
];

export class SchemeService {
  static getAllSchemes(): GovernmentScheme[] {
    return GOVERNMENT_SCHEMES;
  }

  static getSchemesByBreed(breed: string): GovernmentScheme[] {
    return GOVERNMENT_SCHEMES.filter(scheme => 
      scheme.applicableBreeds.includes(breed) || 
      scheme.applicableBreeds.includes('All breeds')
    );
  }

  static getSchemeById(id: string): GovernmentScheme | undefined {
    return GOVERNMENT_SCHEMES.find(scheme => scheme.id === id);
  }
}