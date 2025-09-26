// Punjab Agricultural Schemes and MSP Service
// Based on Punjab Agriculture Department and Government schemes

export interface MSPRate {
  crop: string
  variety?: string
  season: 'kharif' | 'rabi'
  year: string
  mspRate: number
  unit: string
  increaseFromLastYear: number
  marketingAgencies: string[]
  qualityParameters: {
    moisture: number
    foreignMatter: number
    damagedGrains: number
  }
}

export interface GovernmentScheme {
  id: string
  name: string
  nameHindi: string
  namePunjabi: string
  department: string
  category: 'subsidy' | 'insurance' | 'loan' | 'equipment' | 'training' | 'marketing'
  targetBeneficiaries: string[]
  eligibilityCriteria: string[]
  benefits: string[]
  applicationProcess: string[]
  requiredDocuments: string[]
  subsidyAmount?: number
  subsidyPercentage?: number
  maxBenefitAmount?: number
  applicationDeadline?: string
  contactDetails: {
    office: string
    phone: string
    email?: string
    website?: string
  }
  status: 'active' | 'upcoming' | 'closed'
  launchDate: string
  lastUpdated: string
}

export interface CropInsurance {
  id: string
  schemeName: string
  cropsCovered: string[]
  premiumRates: {
    kharif: number
    rabi: number
    horticulture: number
  }
  coveragePercentage: number
  maxCompensation: number
  perHectareSum: number
  farmerContribution: number
  governmentSubsidy: number
  risksCovered: string[]
  claimProcess: string[]
  timeline: string
}

// Current MSP Rates (2024-25)
export const CURRENT_MSP_RATES: MSPRate[] = [
  {
    crop: 'Rice',
    variety: 'Common',
    season: 'kharif',
    year: '2024-25',
    mspRate: 2300,
    unit: '₹/quintal',
    increaseFromLastYear: 117,
    marketingAgencies: ['FCI', 'CCI', 'NAFED', 'State Agencies'],
    qualityParameters: {
      moisture: 17,
      foreignMatter: 2.5,
      damagedGrains: 3
    }
  },
  {
    crop: 'Rice',
    variety: 'Grade A',
    season: 'kharif',
    year: '2024-25',
    mspRate: 2320,
    unit: '₹/quintal',
    increaseFromLastYear: 117,
    marketingAgencies: ['FCI', 'CCI', 'NAFED', 'State Agencies'],
    qualityParameters: {
      moisture: 17,
      foreignMatter: 1.5,
      damagedGrains: 2
    }
  },
  {
    crop: 'Wheat',
    season: 'rabi',
    year: '2024-25',
    mspRate: 2425,
    unit: '₹/quintal',
    increaseFromLastYear: 150,
    marketingAgencies: ['FCI', 'CCI', 'State Agencies'],
    qualityParameters: {
      moisture: 12,
      foreignMatter: 1.5,
      damagedGrains: 6
    }
  },
  {
    crop: 'Cotton',
    variety: 'Medium Staple',
    season: 'kharif',
    year: '2024-25',
    mspRate: 7121,
    unit: '₹/quintal',
    increaseFromLastYear: 292,
    marketingAgencies: ['CCI', 'State Agencies'],
    qualityParameters: {
      moisture: 8,
      foreignMatter: 5,
      damagedGrains: 0
    }
  },
  {
    crop: 'Maize',
    season: 'kharif',
    year: '2024-25',
    mspRate: 2090,
    unit: '₹/quintal',
    increaseFromLastYear: 115,
    marketingAgencies: ['FCI', 'State Agencies'],
    qualityParameters: {
      moisture: 14,
      foreignMatter: 3,
      damagedGrains: 5
    }
  },
  {
    crop: 'Mustard',
    season: 'rabi',
    year: '2024-25',
    mspRate: 5650,
    unit: '₹/quintal',
    increaseFromLastYear: 300,
    marketingAgencies: ['NAFED', 'NCCF', 'State Agencies'],
    qualityParameters: {
      moisture: 7,
      foreignMatter: 2,
      damagedGrains: 6
    }
  }
]

// Government Schemes Database
export const PUNJAB_GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'crop-diversification-scheme',
    name: 'Crop Diversification Programme',
    nameHindi: 'फसल विविधीकरण कार्यक्रम',
    namePunjabi: 'ਫਸਲ ਵਿਭਿੰਨਤਾ ਪ੍ਰੋਗਰਾਮ',
    department: 'Agriculture Department, Punjab',
    category: 'subsidy',
    targetBeneficiaries: ['Small farmers', 'Marginal farmers', 'Progressive farmers'],
    eligibilityCriteria: [
      'Farmers in designated blocks',
      'Land holding certificate required',
      'Previous crop history verification',
      'Water availability assessment'
    ],
    benefits: [
      '₹17,500/hectare for fruits and vegetables',
      '₹12,000/hectare for pulses and oilseeds',
      '₹7,500/hectare for fodder crops',
      'Technical support and training'
    ],
    applicationProcess: [
      'Visit nearest Agriculture Extension Office',
      'Submit application with required documents',
      'Field verification by officials',
      'Approval and subsidy disbursement'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Land records (Khasra/Khatauni)',
      'Bank account details',
      'Previous year crop details',
      'Passport size photographs'
    ],
    subsidyPercentage: 50,
    maxBenefitAmount: 175000,
    contactDetails: {
      office: 'Directorate of Agriculture, Punjab',
      phone: '0172-2970605',
      email: 'agri.punjab@gov.in',
      website: 'https://agri.punjab.gov.in'
    },
    status: 'active',
    launchDate: '2023-04-01',
    lastUpdated: '2024-09-15'
  },
  {
    id: 'pm-kisan-samman-nidhi',
    name: 'PM-KISAN Samman Nidhi',
    nameHindi: 'पीएम-किसान सम्मान निधि',
    namePunjabi: 'ਪੀਐਮ-ਕਿਸਾਨ ਸਮਾਨ ਨਿਧੀ',
    department: 'Agriculture Department, Punjab',
    category: 'subsidy',
    targetBeneficiaries: ['Small and marginal farmers', 'Landholding farmers'],
    eligibilityCriteria: [
      'Landholding up to 2 hectares',
      'Cultivable land ownership',
      'Valid Aadhaar linking',
      'Active bank account'
    ],
    benefits: [
      '₹6,000 per year in 3 installments',
      'Direct benefit transfer to bank account',
      'No intermediary required'
    ],
    applicationProcess: [
      'Online registration at pmkisan.gov.in',
      'Visit Common Service Center',
      'Submit at Agriculture office',
      'Aadhaar authentication'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'Bank account details',
      'Land ownership documents',
      'Mobile number'
    ],
    subsidyAmount: 6000,
    contactDetails: {
      office: 'PM-KISAN Helpdesk',
      phone: '155261',
      email: 'pmkisan-ict@gov.in',
      website: 'https://pmkisan.gov.in'
    },
    status: 'active',
    launchDate: '2019-02-24',
    lastUpdated: '2024-09-01'
  },
  {
    id: 'happy-seeder-subsidy',
    name: 'Happy Seeder Subsidy Scheme',
    nameHindi: 'हैप्पी सीडर सब्सिडी योजना',
    namePunjabi: 'ਹੈਪੀ ਸੀਡਰ ਸਬਸਿਡੀ ਯੋਜਨਾ',
    department: 'Agriculture Department, Punjab',
    category: 'equipment',
    targetBeneficiaries: ['Individual farmers', 'Farmer Producer Organizations', 'Custom Hiring Centers'],
    eligibilityCriteria: [
      'Punjab state resident',
      'Agricultural land ownership',
      'Previous subsidy not availed',
      'Technical training completion'
    ],
    benefits: [
      '50% subsidy on Happy Seeder',
      'Maximum ₹40,000 subsidy per unit',
      'Technical training provided',
      'Maintenance support'
    ],
    applicationProcess: [
      'Apply through PAU website',
      'Document verification',
      'Technical assessment',
      'Equipment delivery and training'
    ],
    requiredDocuments: [
      'Application form',
      'Aadhaar Card',
      'Land records',
      'Bank account details',
      'Quotation from dealer'
    ],
    subsidyPercentage: 50,
    maxBenefitAmount: 40000,
    contactDetails: {
      office: 'Punjab Agricultural University',
      phone: '0161-2401960',
      email: 'happyseeder@pau.edu',
      website: 'https://pau.edu'
    },
    status: 'active',
    launchDate: '2020-10-15',
    lastUpdated: '2024-08-20'
  },
  {
    id: 'fasal-bima-yojana',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    nameHindi: 'प्रधानमंत्री फसल बीमा योजना',
    namePunjabi: 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ',
    department: 'Agriculture Department, Punjab',
    category: 'insurance',
    targetBeneficiaries: ['All farmers', 'Tenant farmers', 'Sharecroppers'],
    eligibilityCriteria: [
      'Cultivating notified crops',
      'In notified areas',
      'Loanee and non-loanee farmers',
      'Valid land documents'
    ],
    benefits: [
      'Comprehensive crop insurance',
      'Premium subsidy up to 90%',
      'Quick settlement of claims',
      'Mobile-based claim reporting'
    ],
    applicationProcess: [
      'Visit nearest bank or insurance company',
      'Fill application form',
      'Submit required documents',
      'Pay farmer premium share'
    ],
    requiredDocuments: [
      'Application form',
      'Aadhaar Card',
      'Bank account details',
      'Land records',
      'Sowing certificate'
    ],
    subsidyPercentage: 90,
    contactDetails: {
      office: 'Agriculture Insurance Company',
      phone: '1800-180-1551',
      email: 'support@aicofindia.com',
      website: 'https://pmfby.gov.in'
    },
    status: 'active',
    launchDate: '2016-01-13',
    lastUpdated: '2024-07-01'
  }
]

// Crop Insurance Schemes
export const CROP_INSURANCE_SCHEMES: CropInsurance[] = [
  {
    id: 'pmfby-punjab',
    schemeName: 'Pradhan Mantri Fasal Bima Yojana - Punjab',
    cropsCovered: ['Rice', 'Wheat', 'Cotton', 'Maize', 'Mustard', 'Potato', 'Sugarcane'],
    premiumRates: {
      kharif: 2.0,
      rabi: 1.5,
      horticulture: 5.0
    },
    coveragePercentage: 100,
    maxCompensation: 200000,
    perHectareSum: 50000,
    farmerContribution: 2.0,
    governmentSubsidy: 90,
    risksCovered: [
      'Drought',
      'Flood',
      'Hailstorm',
      'Cyclone',
      'Pest and disease attack',
      'Fire',
      'Lightning',
      'Storm and tempest'
    ],
    claimProcess: [
      'Report crop loss within 72 hours',
      'Call crop insurance helpline',
      'Mobile app-based reporting',
      'Joint survey by officials',
      'Claim settlement within 60 days'
    ],
    timeline: '60 days from assessment'
  }
]

// Service Functions
export class PunjabSchemesService {
  
  // Get current MSP rates for specific crop
  static getCurrentMSP(cropName: string, season?: 'kharif' | 'rabi'): MSPRate[] {
    return CURRENT_MSP_RATES.filter(msp => 
      msp.crop.toLowerCase().includes(cropName.toLowerCase()) &&
      (season ? msp.season === season : true)
    )
  }

  // Get all active government schemes
  static getActiveSchemes(category?: GovernmentScheme['category']): GovernmentScheme[] {
    return PUNJAB_GOVERNMENT_SCHEMES.filter(scheme => 
      scheme.status === 'active' && 
      (category ? scheme.category === category : true)
    )
  }

  // Get schemes by beneficiary type
  static getSchemesByBeneficiary(beneficiaryType: string): GovernmentScheme[] {
    return PUNJAB_GOVERNMENT_SCHEMES.filter(scheme => 
      scheme.targetBeneficiaries.some(beneficiary => 
        beneficiary.toLowerCase().includes(beneficiaryType.toLowerCase())
      )
    )
  }

  // Check scheme eligibility (simplified logic)
  static checkEligibility(scheme: GovernmentScheme, farmerProfile: {
    landHolding: number
    location: string
    category: 'small' | 'marginal' | 'large'
    hasAadhaar: boolean
    hasBankAccount: boolean
  }): { eligible: boolean; reasons: string[] } {
    const reasons: string[] = []
    let eligible = true

    // Basic document checks
    if (!farmerProfile.hasAadhaar) {
      eligible = false
      reasons.push('Aadhaar card required')
    }

    if (!farmerProfile.hasBankAccount) {
      eligible = false
      reasons.push('Bank account required')
    }

    // Scheme-specific checks
    if (scheme.id === 'pm-kisan-samman-nidhi' && farmerProfile.landHolding > 2) {
      eligible = false
      reasons.push('Land holding exceeds 2 hectares limit')
    }

    if (eligible) {
      reasons.push('All eligibility criteria met')
    }

    return { eligible, reasons }
  }

  // Get subsidy calculator
  static calculateSubsidy(scheme: GovernmentScheme, parameters: {
    area?: number
    equipmentCost?: number
    cropValue?: number
  }): { subsidyAmount: number; farmerContribution: number; totalBenefit: number } {
    let subsidyAmount = 0
    let farmerContribution = 0

    if (scheme.subsidyPercentage && parameters.equipmentCost) {
      subsidyAmount = Math.min(
        (parameters.equipmentCost * scheme.subsidyPercentage) / 100,
        scheme.maxBenefitAmount || Infinity
      )
      farmerContribution = parameters.equipmentCost - subsidyAmount
    } else if (scheme.subsidyAmount) {
      subsidyAmount = scheme.subsidyAmount
    }

    return {
      subsidyAmount,
      farmerContribution,
      totalBenefit: subsidyAmount
    }
  }

  // Get MSP centers near location
  static getMSPCenters(district: string) {
    // This would integrate with actual MSP center data
    const mockCenters = [
      {
        name: `${district} Mandi`,
        address: `Grain Market, ${district}`,
        phone: '0172-XXXXXX',
        facilities: ['Weighing', 'Quality testing', 'Storage', 'Payment'],
        operatingHours: '9:00 AM - 6:00 PM',
        acceptedCrops: ['Rice', 'Wheat', 'Cotton', 'Maize']
      }
    ]
    
    return mockCenters
  }

  // Get seasonal scheme notifications
  static getSeasonalNotifications(currentDate: Date = new Date()) {
    const month = currentDate.getMonth() + 1
    const notifications: { title: string; message: string; urgency: 'high' | 'medium' | 'low' }[] = []

    // Kharif season reminders (April-June)
    if (month >= 4 && month <= 6) {
      notifications.push({
        title: 'Kharif Season Registration',
        message: 'Register for crop insurance and subsidy schemes for Kharif season 2024',
        urgency: 'high'
      })
    }

    // Rabi season reminders (October-December)
    if (month >= 10 && month <= 12) {
      notifications.push({
        title: 'Rabi Season Benefits',
        message: 'Apply for wheat cultivation subsidies and irrigation support',
        urgency: 'high'
      })
    }

    // MSP procurement reminders
    if (month === 10 || month === 11) {
      notifications.push({
        title: 'Rice MSP Procurement',
        message: 'Rice procurement at MSP rates started. Visit nearest procurement center',
        urgency: 'medium'
      })
    }

    if (month >= 3 && month <= 5) {
      notifications.push({
        title: 'Wheat MSP Procurement',
        message: 'Wheat procurement season active. Ensure quality parameters are met',
        urgency: 'medium'
      })
    }

    return notifications
  }

  // Get crop insurance recommendations
  static getCropInsuranceRecommendation(cropName: string, area: number, district: string) {
    const insurance = CROP_INSURANCE_SCHEMES[0] // PMFBY
    const premium = (area * insurance.perHectareSum * insurance.premiumRates.kharif) / 100
    const farmerShare = (premium * insurance.farmerContribution) / 100
    const maxCoverage = area * insurance.perHectareSum

    return {
      scheme: insurance,
      premium,
      farmerContribution: farmerShare,
      governmentSubsidy: premium - farmerShare,
      maxCoverage,
      recommendation: maxCoverage > 50000 ? 
        'Highly recommended due to high coverage value' : 
        'Recommended for risk protection'
    }
  }
}

export default PunjabSchemesService