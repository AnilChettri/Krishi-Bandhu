/**
 * Document Ingestion Script for FarmGuard RAG System
 * Ingests agricultural knowledge documents into Milvus vector database
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
// Use crypto.randomUUID() instead of uuid package
const uuidv4 = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
import { ingestDocuments, addDocumentBatch, initializeRAG } from '../lib/rag-helper'

// Sample agricultural documents to seed the knowledge base
const SAMPLE_DOCUMENTS = [
  // Rice cultivation guides
  {
    id: uuidv4(),
    title: 'Rice Cultivation Best Practices',
    content: `Rice is one of India's most important crops. Best practices include:
    
    SOIL PREPARATION:
    - Maintain water level of 2-5 cm during land preparation
    - Use 2-3 ploughings followed by puddling
    - Apply farmyard manure at 10-12 tons per hectare
    
    SEED TREATMENT:
    - Use certified seeds of high-yielding varieties
    - Treat seeds with fungicides before sowing
    - Maintain seed rate of 20-25 kg per hectare for transplanting
    
    NUTRIENT MANAGEMENT:
    - Apply NPK fertilizers in ratio 4:2:1
    - Use nitrogen in 3 splits: 50% basal, 25% at tillering, 25% at panicle initiation
    - Apply phosphorus and potash as basal dose
    
    PEST MANAGEMENT:
    - Monitor for stem borers, leaf folders, and brown plant hoppers
    - Use IPM approach combining cultural, biological, and chemical methods
    - Maintain 5 cm water level to control weeds naturally
    
    HARVESTING:
    - Harvest when 80% of grains turn golden yellow
    - Maintain moisture content at 20-25% during harvest
    - Dry grains to 14% moisture for safe storage`,
    source: 'ICAR Agricultural Extension',
    metadata: {
      document_type: 'crop_guide' as const,
      language: 'en',
      region: 'pan_india',
      crop_type: 'rice',
      last_updated: '2024-01-15',
      keywords: ['rice', 'paddy', 'cultivation', 'NPK', 'harvesting', 'pest management']
    }
  },
  
  // Wheat cultivation
  {
    id: uuidv4(),
    title: 'Wheat Production Guidelines',
    content: `Wheat cultivation practices for optimal yield:
    
    VARIETY SELECTION:
    - Choose varieties suitable for your agro-climatic zone
    - HD-2967, HD-3086, DBW-187 for timely sowing
    - HD-2985, HD-3171 for late sowing conditions
    
    SOWING:
    - Optimal sowing time: November 15 to December 15
    - Seed rate: 100 kg per hectare for timely sowing
    - Row spacing: 22.5 cm for irrigated conditions
    
    FERTILIZER APPLICATION:
    - Nitrogen: 150 kg/ha in 3 splits
    - Phosphorus: 60 kg/ha at sowing
    - Potash: 40 kg/ha at sowing
    - Zinc: 25 kg/ha if deficient
    
    IRRIGATION:
    - First irrigation at Crown Root Initiation (21 days)
    - Second at Late Tillering (40-45 days)
    - Third at Late Jointing (60-65 days)
    - Fourth at Flowering (85-90 days)
    - Fifth at Milk stage (100-105 days)
    
    DISEASE MANAGEMENT:
    - Yellow rust: Use resistant varieties, fungicide spray
    - Loose smut: Seed treatment with systemic fungicides
    - Karnal bunt: Avoid excessive irrigation during flowering`,
    source: 'IARI New Delhi',
    metadata: {
      document_type: 'crop_guide' as const,
      language: 'en',
      region: 'north_india',
      crop_type: 'wheat',
      last_updated: '2024-01-10',
      keywords: ['wheat', 'sowing', 'irrigation', 'fertilizer', 'varieties', 'disease']
    }
  },

  // Tomato cultivation
  {
    id: uuidv4(),
    title: 'Tomato Cultivation and Management',
    content: `Commercial tomato production guidelines:
    
    NURSERY MANAGEMENT:
    - Sow seeds in raised beds with good drainage
    - Use seed rate of 300-400 grams per hectare
    - Maintain temperature of 25-30°C for germination
    - Transplant seedlings after 4-5 weeks
    
    FIELD PREPARATION:
    - Apply farmyard manure at 25 tons per hectare
    - Maintain soil pH between 6.0-7.0
    - Prepare raised beds for better drainage
    - Plant spacing: 60 cm x 45 cm
    
    NUTRIENT REQUIREMENTS:
    - Nitrogen: 200-250 kg/ha
    - Phosphorus: 100-125 kg/ha  
    - Potash: 150-200 kg/ha
    - Apply calcium and boron to prevent disorders
    
    WATER MANAGEMENT:
    - Maintain consistent soil moisture
    - Avoid water stress during fruit development
    - Use drip irrigation for efficient water use
    - Mulching helps retain soil moisture
    
    COMMON DISEASES:
    - Early blight: Copper-based fungicides
    - Late blight: Metalaxyl + Mancozeb spray
    - Bacterial wilt: Use resistant varieties, crop rotation
    - Virus diseases: Control aphid vectors`,
    source: 'Horticultural Research Institute',
    metadata: {
      document_type: 'crop_guide' as const,
      language: 'en',
      region: 'pan_india',
      crop_type: 'tomato',
      last_updated: '2024-01-12',
      keywords: ['tomato', 'nursery', 'transplanting', 'diseases', 'irrigation', 'nutrition']
    }
  },

  // Pest management guide
  {
    id: uuidv4(),
    title: 'Integrated Pest Management in Rice',
    content: `IPM strategies for major rice pests:
    
    STEM BORER MANAGEMENT:
    - Cultural control: Remove stubbles, avoid excessive nitrogen
    - Biological control: Release Trichogramma japonicum
    - Chemical control: Chlorpyriphos 20 EC at 625 ml/ha
    - Pheromone traps: Install 8-10 traps per hectare
    
    BROWN PLANTHOPPER:
    - Resistant varieties: Ratna, Jaya, Padmini
    - Natural enemies: Spiders, mirid bugs, dragonflies
    - Neem oil application: 1500 ppm at 15-day intervals
    - Chemical spray: Imidacloprid 17.8 SL at 125 ml/ha
    
    LEAF FOLDER:
    - Maintain proper plant spacing for air circulation
    - Remove affected leaves and destroy
    - Spray Bacillus thuringiensis at 1 kg/ha
    - Use light traps to monitor adult moths
    
    RICE HISPA:
    - Flooding fields to drown adults and larvae
    - Use yellow sticky traps
    - Spray chlorpyriphos + cypermethrin combination
    
    PREVENTION STRATEGIES:
    - Crop rotation with non-host crops
    - Maintain field hygiene
    - Balanced fertilization
    - Conserve natural enemies
    - Regular field monitoring`,
    source: 'IRRI Rice Knowledge Bank',
    metadata: {
      document_type: 'pest_manual' as const,
      language: 'en',
      crop_type: 'rice',
      last_updated: '2024-01-08',
      keywords: ['pest', 'IPM', 'stem borer', 'planthopper', 'biological control', 'rice hispa']
    }
  },

  // Disease management
  {
    id: uuidv4(),
    title: 'Common Crop Diseases and Management',
    content: `Disease identification and management:
    
    FUNGAL DISEASES:
    
    Powdery Mildew:
    - Symptoms: White powdery growth on leaves and stems
    - Conditions: High humidity, moderate temperature (20-25°C)
    - Management: Sulfur dusting, systemic fungicides, resistant varieties
    
    Downy Mildew:
    - Symptoms: Yellow patches on upper leaf surface, grayish growth below
    - Conditions: High humidity, cool temperatures
    - Management: Copper oxychloride spray, proper drainage, air circulation
    
    Bacterial Blight:
    - Symptoms: Water-soaked lesions, yellow halos
    - Spread: Through water droplets, contaminated tools
    - Management: Copper-based bactericides, crop rotation, seed treatment
    
    VIRAL DISEASES:
    
    Leaf Curl Virus:
    - Symptoms: Upward curling of leaves, stunted growth
    - Vectors: Whiteflies, aphids
    - Management: Vector control, resistant varieties, removal of affected plants
    
    PREVENTION MEASURES:
    - Use certified disease-free seeds
    - Maintain proper plant spacing
    - Avoid overhead irrigation
    - Remove and destroy infected plant debris
    - Apply balanced fertilizers to boost plant immunity
    - Regular field sanitization`,
    source: 'Plant Pathology Department',
    metadata: {
      document_type: 'disease_info' as const,
      language: 'en',
      last_updated: '2024-01-05',
      keywords: ['disease', 'fungal', 'bacterial', 'viral', 'symptoms', 'management', 'prevention']
    }
  },

  // Soil management
  {
    id: uuidv4(),
    title: 'Soil Health and Fertility Management',
    content: `Maintaining soil health for sustainable agriculture:
    
    SOIL TESTING:
    - Test soil every 2-3 years for pH, organic matter, NPK
    - Collect samples from 0-15 cm depth
    - Take 15-20 samples per field for composite analysis
    
    ORGANIC MATTER MANAGEMENT:
    - Maintain 2.5-3% organic matter in soil
    - Apply farmyard manure at 5-10 tons per hectare
    - Use green manuring with leguminous crops
    - Compost preparation from crop residues
    
    pH MANAGEMENT:
    - Optimal pH range: 6.0-7.5 for most crops
    - For acidic soils: Apply lime at 2-5 tons per hectare
    - For alkaline soils: Apply gypsum, organic matter
    - Use sulfur for gradual pH reduction
    
    NUTRIENT CYCLING:
    - Practice crop rotation to maintain soil fertility
    - Include nitrogen-fixing crops in rotation
    - Return crop residues to soil after harvest
    - Use cover crops during fallow periods
    
    SOIL CONSERVATION:
    - Contour farming on slopes
    - Terracing for erosion control
    - Maintain vegetative cover
    - Avoid excessive tillage
    
    MICRONUTRIENT MANAGEMENT:
    - Apply zinc sulfate if deficient (25 kg/ha)
    - Boron application for oil seeds and vegetables
    - Iron sulfate for iron-deficient soils
    - Foliar application for quick correction`,
    source: 'Soil Science Society',
    metadata: {
      document_type: 'farming_practice' as const,
      language: 'en',
      last_updated: '2024-01-20',
      keywords: ['soil', 'fertility', 'organic matter', 'pH', 'nutrients', 'conservation', 'micronutrients']
    }
  },

  // Market information
  {
    id: uuidv4(),
    title: 'Agricultural Marketing and Price Trends',
    content: `Understanding agricultural markets:
    
    MARKET CHANNELS:
    - Farm gate sales to local traders
    - Agricultural Produce Market Committees (APMCs)
    - Direct sales to processors
    - Farmers Producer Organizations (FPOs)
    - Online marketing platforms
    
    PRICE FACTORS:
    - Seasonal demand and supply variations
    - Quality parameters and grading
    - Transportation and storage costs
    - Government procurement policies
    - Export-import regulations
    
    VALUE ADDITION:
    - Primary processing at farm level
    - Proper cleaning, grading, and packaging
    - Brand development for premium products
    - Organic certification for higher prices
    - Direct marketing to reduce intermediaries
    
    STORAGE AND HANDLING:
    - Scientific storage to reduce post-harvest losses
    - Proper moisture management
    - Pest control in storage structures
    - Cold storage for perishable crops
    - Warehouse receipt system
    
    GOVERNMENT SCHEMES:
    - Minimum Support Price (MSP) for key crops
    - Price Support Scheme (PSS) for oilseeds and pulses
    - Market Intervention Scheme (MIS) for perishables
    - PM-KISAN income support scheme
    - Crop insurance schemes`,
    source: 'Agricultural Marketing Division',
    metadata: {
      document_type: 'market_info' as const,
      language: 'en',
      last_updated: '2024-01-18',
      keywords: ['marketing', 'prices', 'APMC', 'storage', 'government schemes', 'value addition']
    }
  }
]

// Hindi translations of key documents
const HINDI_DOCUMENTS = [
  {
    id: uuidv4(),
    title: 'चावल की खेती के सर्वोत्तम तरीके',
    content: `चावल भारत की सबसे महत्वपूर्ण फसलों में से एक है। सर्वोत्तम प्रथाओं में शामिल हैं:
    
    भूमि की तैयारी:
    - भूमि तैयारी के दौरान 2-5 सेमी जल स्तर बनाए रखें
    - 2-3 जुताई के बाद पडलिंग करें
    - 10-12 टन प्रति हेक्टेयर गोबर की खाद डालें
    
    बीज उपचार:
    - उच्च उत्पादन वाली किस्मों के प्रमाणित बीज का उपयोग करें
    - बोने से पहले बीजों को फफूंदनाशी से उपचारित करें
    - रोपाई के लिए 20-25 किग्रा प्रति हेक्टेयर बीज दर बनाए रखें
    
    पोषक तत्व प्रबंधन:
    - NPK उर्वरकों को 4:2:1 के अनुपात में डालें
    - नाइट्रोजन को 3 भागों में दें: 50% आधारीय, 25% कल्ले निकलते समय, 25% बाली निकलते समय
    - फास्फोरस और पोटाश आधारीय खुराक के रूप में दें
    
    कीट प्रबंधन:
    - तना छेदक, पत्ती लपेटक और भूरे रस चूसक कीड़ों की निगरानी करें
    - सांस्कृतिक, जैविक और रासायनिक विधियों को मिलाकर IPM दृष्टिकोण का उपयोग करें
    - खरपतवार को प्राकृतिक रूप से नियंत्रित करने के लिए 5 सेमी जल स्तर बनाए रखें`,
    source: 'ICAR कृषि विस्तार',
    metadata: {
      document_type: 'crop_guide' as const,
      language: 'hi',
      region: 'pan_india',
      crop_type: 'rice',
      last_updated: '2024-01-15',
      keywords: ['चावल', 'धान', 'खेती', 'NPK', 'कटाई', 'कीट प्रबंधन']
    }
  }
]

// Function to load documents from a directory
async function loadDocumentsFromDirectory(dirPath: string): Promise<any[]> {
  const documents = []
  
  try {
    const files = readdirSync(dirPath)
    
    for (const file of files) {
      const filePath = join(dirPath, file)
      const stat = statSync(filePath)
      
      if (stat.isFile() && (file.endsWith('.txt') || file.endsWith('.md'))) {
        const content = readFileSync(filePath, 'utf-8')
        
        documents.push({
          id: uuidv4(),
          title: file.replace(/\.(txt|md)$/, ''),
          content: content.trim(),
          source: `file:${file}`,
          metadata: {
            document_type: determineDocumentType(file),
            language: determineLanguage(file),
            last_updated: new Date().toISOString().split('T')[0],
            file_path: filePath,
            keywords: extractKeywords(content)
          }
        })
      }
    }
    
    console.log(`Loaded ${documents.length} documents from ${dirPath}`)
  } catch (error) {
    console.warn(`Could not load documents from ${dirPath}:`, error instanceof Error ? error.message : String(error))
  }
  
  return documents
}

// Helper function to determine document type from filename
function determineDocumentType(filename: string): 'crop_guide' | 'pest_manual' | 'disease_info' | 'farming_practice' | 'market_info' {
  const lower = filename.toLowerCase()
  
  if (lower.includes('pest') || lower.includes('insect')) return 'pest_manual'
  if (lower.includes('disease') || lower.includes('fungal') || lower.includes('bacterial')) return 'disease_info'
  if (lower.includes('market') || lower.includes('price') || lower.includes('trade')) return 'market_info'
  if (lower.includes('soil') || lower.includes('fertilizer') || lower.includes('practice')) return 'farming_practice'
  
  return 'crop_guide'
}

// Helper function to determine language from filename
function determineLanguage(filename: string): string {
  const lower = filename.toLowerCase()
  
  if (lower.includes('hindi') || lower.includes('_hi') || lower.includes('-hi')) return 'hi'
  if (lower.includes('kannada') || lower.includes('_kn') || lower.includes('-kn')) return 'kn'
  if (lower.includes('punjabi') || lower.includes('_pa') || lower.includes('-pa')) return 'pa'
  if (lower.includes('tamil') || lower.includes('_ta') || lower.includes('-ta')) return 'ta'
  
  return 'en'
}

// Simple keyword extraction
function extractKeywords(content: string): string[] {
  const keywords = new Set<string>()
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'])
  
  // Extract words from content
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
  
  // Count word frequency
  const wordCount = new Map<string, number>()
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1)
  })
  
  // Get top keywords
  const sortedWords = Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)
  
  return sortedWords
}

// Main ingestion function
async function main() {
  try {
    console.log('🚀 Starting document ingestion process...')
    
    // Initialize RAG system
    const ragInitialized = await initializeRAG()
    if (!ragInitialized) {
      console.error('❌ Failed to initialize RAG system')
      process.exit(1)
    }
    
    // Collect all documents
    let allDocuments = [...SAMPLE_DOCUMENTS, ...HINDI_DOCUMENTS]
    
    // Load documents from directory if exists
    const documentsDir = join(process.cwd(), 'documents')
    const dirDocuments = await loadDocumentsFromDirectory(documentsDir)
    allDocuments = [...allDocuments, ...dirDocuments]
    
    console.log(`📚 Total documents to ingest: ${allDocuments.length}`)
    
    // Ingest documents in batches
    const batchSize = 50
    let totalIngested = 0
    
    for (let i = 0; i < allDocuments.length; i += batchSize) {
      const batch = allDocuments.slice(i, i + batchSize)
      console.log(`📥 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allDocuments.length / batchSize)}...`)
      
      const success = await addDocumentBatch(batch)
      if (success) {
        totalIngested += batch.length
        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1} ingested successfully`)
      } else {
        console.error(`❌ Failed to ingest batch ${Math.floor(i / batchSize) + 1}`)
      }
      
      // Add delay between batches to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log(`🎉 Document ingestion completed!`)
    console.log(`📊 Successfully ingested: ${totalIngested}/${allDocuments.length} documents`)
    
    // Print summary by document type
    const summary = allDocuments.reduce((acc, doc) => {
      const type = doc.metadata.document_type
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('\n📋 Ingestion Summary:')
    Object.entries(summary).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} documents`)
    })
    
  } catch (error) {
    console.error('❌ Document ingestion failed:', error)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error)
}

export { SAMPLE_DOCUMENTS, HINDI_DOCUMENTS, loadDocumentsFromDirectory }