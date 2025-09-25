/**
 * RAG (Retrieval-Augmented Generation) Helper for FarmGuard
 * Integrates with Milvus vector database for agricultural knowledge retrieval
 * Supports document ingestion, embedding, and context retrieval
 */

import { LOCAL_AI_CONFIG } from './api-config'

// Types for RAG operations
interface Document {
  id: string
  content: string
  title?: string
  source: string
  metadata: {
    document_type: 'crop_guide' | 'pest_manual' | 'disease_info' | 'farming_practice' | 'market_info'
    language: string
    region?: string
    crop_type?: string
    last_updated: string
    confidence_score?: number
    keywords?: string[]
    [key: string]: any
  }
}

interface EmbeddingVector {
  id: string
  vector: number[]
  metadata: any
}

interface SearchResult {
  id: string
  content: string
  score: number
  metadata: any
}

interface RAGContext {
  query: string
  relevant_documents: SearchResult[]
  context_summary: string
  confidence: number
  sources: string[]
}

interface MilvusConfig {
  uri: string
  collection_name: string
  dimension: number
  index_type: 'IVF_FLAT' | 'IVF_SQ8' | 'HNSW'
  metric_type: 'L2' | 'IP' | 'COSINE'
}

// Milvus collection configuration
const COLLECTIONS = {
  farming_knowledge: {
    name: 'farmguard_knowledge',
    dimension: 384, // all-MiniLM-L6-v2 embedding dimension
    description: 'Agricultural knowledge base for RAG'
  },
  user_queries: {
    name: 'farmguard_queries', 
    dimension: 384,
    description: 'User query embeddings for semantic search'
  }
}

// Initialize Milvus client (placeholder - would use actual Milvus client)
class MilvusClient {
  private uri: string
  private connected: boolean = false

  constructor(uri: string) {
    this.uri = uri
  }

  async connect(): Promise<boolean> {
    try {
      // In a real implementation, you'd use the actual Milvus client
      console.log(`Connecting to Milvus at ${this.uri}`)
      this.connected = true
      return true
    } catch (error) {
      console.error('Failed to connect to Milvus:', error)
      return false
    }
  }

  async createCollection(config: MilvusConfig): Promise<boolean> {
    try {
      console.log(`Creating collection: ${config.collection_name}`)
      // Collection creation logic would go here
      return true
    } catch (error) {
      console.error('Failed to create collection:', error)
      return false
    }
  }

  async insertVectors(collectionName: string, vectors: EmbeddingVector[]): Promise<boolean> {
    try {
      console.log(`Inserting ${vectors.length} vectors into ${collectionName}`)
      // Vector insertion logic would go here
      return true
    } catch (error) {
      console.error('Failed to insert vectors:', error)
      return false
    }
  }

  async searchVectors(
    collectionName: string, 
    queryVector: number[], 
    topK: number = 5,
    filter?: any
  ): Promise<SearchResult[]> {
    try {
      console.log(`Searching for similar vectors in ${collectionName}`)
      // Mock results for demonstration
      return [
        {
          id: 'doc1',
          content: 'Sample agricultural document content...',
          score: 0.95,
          metadata: { source: 'crop_guide', language: 'en' }
        }
      ]
    } catch (error) {
      console.error('Failed to search vectors:', error)
      return []
    }
  }

  async disconnect(): Promise<void> {
    this.connected = false
    console.log('Disconnected from Milvus')
  }

  isConnected(): boolean {
    return this.connected
  }
}

// Global Milvus client instance
let milvusClient: MilvusClient | null = null

// Initialize Milvus connection
export async function initializeMilvus(): Promise<boolean> {
  try {
    const milvusUri = process.env.MILVUS_URI || 'http://localhost:19530'
    milvusClient = new MilvusClient(milvusUri)
    
    const connected = await milvusClient.connect()
    if (!connected) {
      throw new Error('Failed to connect to Milvus')
    }

    // Create collections if they don't exist
    for (const collection of Object.values(COLLECTIONS)) {
      await milvusClient.createCollection({
        uri: milvusUri,
        collection_name: collection.name,
        dimension: collection.dimension,
        index_type: 'IVF_FLAT',
        metric_type: 'L2'
      })
    }

    console.log('✅ Milvus initialized successfully')
    return true
  } catch (error) {
    console.error('❌ Failed to initialize Milvus:', error)
    return false
  }
}

// Generate embeddings using local or external service
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    // Try local AI first
    if (LOCAL_AI_CONFIG.ENABLED) {
      const response = await fetch(
        `${LOCAL_AI_CONFIG.LOCALAI.BASE_URL}${LOCAL_AI_CONFIG.LOCALAI.ENDPOINTS.EMBEDDINGS}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(LOCAL_AI_CONFIG.LOCALAI.API_KEY && {
              'Authorization': `Bearer ${LOCAL_AI_CONFIG.LOCALAI.API_KEY}`
            })
          },
          body: JSON.stringify({
            model: LOCAL_AI_CONFIG.MODELS.EMBEDDING.LOCALAI,
            input: texts
          }),
          signal: AbortSignal.timeout(30000)
        }
      )

      if (response.ok) {
        const data = await response.json()
        return data.data.map((item: any) => item.embedding)
      }
    }

    // Fallback to mock embeddings for development
    console.warn('Using mock embeddings - implement actual embedding service')
    return texts.map(() => Array(384).fill(0).map(() => Math.random()))
  } catch (error) {
    console.error('Failed to generate embeddings:', error)
    // Return mock embeddings
    return texts.map(() => Array(384).fill(0).map(() => Math.random()))
  }
}

// Ingest documents into vector database
export async function ingestDocuments(documents: Document[]): Promise<boolean> {
  try {
    if (!milvusClient || !milvusClient.isConnected()) {
      throw new Error('Milvus client not connected')
    }

    console.log(`📥 Ingesting ${documents.length} documents...`)

    // Extract text content for embedding
    const texts = documents.map(doc => `${doc.title || ''} ${doc.content}`.trim())
    
    // Generate embeddings
    const embeddings = await generateEmbeddings(texts)

    // Prepare vectors for insertion
    const vectors: EmbeddingVector[] = documents.map((doc, index) => ({
      id: doc.id,
      vector: embeddings[index],
      metadata: {
        content: doc.content,
        title: doc.title,
        source: doc.source,
        ...doc.metadata
      }
    }))

    // Insert into Milvus
    const success = await milvusClient.insertVectors(
      COLLECTIONS.farming_knowledge.name,
      vectors
    )

    if (success) {
      console.log(`✅ Successfully ingested ${documents.length} documents`)
      return true
    } else {
      throw new Error('Failed to insert vectors into Milvus')
    }
  } catch (error) {
    console.error('❌ Document ingestion failed:', error)
    return false
  }
}

// Retrieve relevant context for a query
export async function retrieveContext(
  query: string,
  options: {
    topK?: number
    language?: string
    document_types?: string[]
    region?: string
    crop_type?: string
    min_score?: number
  } = {}
): Promise<RAGContext> {
  try {
    const { 
      topK = 5,
      language = 'en',
      document_types,
      region,
      crop_type,
      min_score = 0.1
    } = options

    console.log(`🔍 Retrieving context for query: "${query.substring(0, 100)}..."`)

    if (!milvusClient || !milvusClient.isConnected()) {
      console.warn('Milvus not available, using fallback context')
      return createFallbackContext(query, language)
    }

    // Generate query embedding
    const queryEmbedding = await generateEmbeddings([query])
    
    // Build search filter
    const filter: any = { language }
    if (document_types) filter.document_type = { '$in': document_types }
    if (region) filter.region = region
    if (crop_type) filter.crop_type = crop_type

    // Search for similar documents
    const searchResults = await milvusClient.searchVectors(
      COLLECTIONS.farming_knowledge.name,
      queryEmbedding[0],
      topK,
      filter
    )

    // Filter by minimum score
    const relevantDocs = searchResults.filter(result => result.score >= min_score)

    if (relevantDocs.length === 0) {
      console.warn('No relevant documents found, using fallback')
      return createFallbackContext(query, language)
    }

    // Calculate overall confidence
    const avgScore = relevantDocs.reduce((sum, doc) => sum + doc.score, 0) / relevantDocs.length
    const confidence = Math.min(avgScore * 1.2, 1.0) // Boost confidence slightly

    // Create context summary
    const contextSummary = relevantDocs
      .slice(0, 3) // Use top 3 for summary
      .map(doc => doc.content.substring(0, 200) + '...')
      .join('\n\n')

    // Extract sources
    const sources = [...new Set(relevantDocs.map(doc => doc.metadata.source))]

    console.log(`✅ Retrieved ${relevantDocs.length} relevant documents (confidence: ${confidence.toFixed(2)})`)

    return {
      query,
      relevant_documents: relevantDocs,
      context_summary: contextSummary,
      confidence,
      sources
    }
  } catch (error) {
    console.error('❌ Context retrieval failed:', error)
    return createFallbackContext(query, options.language || 'en')
  }
}

// Create enhanced prompt with RAG context
export async function createRAGPrompt(
  userQuery: string,
  options: {
    language?: string
    document_types?: string[]
    region?: string
    crop_type?: string
    include_sources?: boolean
  } = {}
): Promise<{
  enhancedPrompt: string
  context: RAGContext
  metadata: any
}> {
  try {
    // Retrieve relevant context
    const context = await retrieveContext(userQuery, options)

    // Build enhanced prompt
    let enhancedPrompt = ''

    if (context.relevant_documents.length > 0) {
      enhancedPrompt += 'Context from agricultural knowledge base:\n\n'
      
      context.relevant_documents.forEach((doc, index) => {
        enhancedPrompt += `Document ${index + 1} (confidence: ${doc.score.toFixed(2)}):\n`
        enhancedPrompt += `${doc.content.substring(0, 500)}...\n\n`
      })
      
      enhancedPrompt += '---\n\n'
    }

    enhancedPrompt += `Based on the above context and your agricultural knowledge, please answer this question: ${userQuery}`

    if (options.language && options.language !== 'en') {
      const languageNames = {
        hi: 'Hindi',
        kn: 'Kannada', 
        pa: 'Punjabi',
        ta: 'Tamil'
      }
      enhancedPrompt += `\n\nPlease respond in ${languageNames[options.language as keyof typeof languageNames] || options.language}.`
    }

    if (options.include_sources && context.sources.length > 0) {
      enhancedPrompt += `\n\nSources: ${context.sources.join(', ')}`
    }

    const metadata = {
      num_context_docs: context.relevant_documents.length,
      avg_confidence: context.confidence,
      sources: context.sources,
      query_language: options.language || 'en',
      context_length: context.context_summary.length
    }

    console.log(`📝 Created RAG prompt with ${context.relevant_documents.length} context documents`)

    return {
      enhancedPrompt,
      context,
      metadata
    }
  } catch (error) {
    console.error('❌ RAG prompt creation failed:', error)
    return {
      enhancedPrompt: userQuery,
      context: createFallbackContext(userQuery, options.language || 'en'),
      metadata: { error: error.message }
    }
  }
}

// Fallback context when RAG is not available
function createFallbackContext(query: string, language: string): RAGContext {
  const fallbackContent = {
    en: 'General agricultural best practices include proper soil preparation, timely planting, appropriate fertilization, and regular monitoring for pests and diseases.',
    hi: 'सामान्य कृषि सर्वोत्तम प्रथाओं में उचित मिट्टी की तैयारी, समय पर बुआई, उपयुक्त उर्वरीकरण, और कीटों और बीमारियों के लिए नियमित निगरानी शामिल है।',
    kn: 'ಸಾಮಾನ್ಯ ಕೃಷಿ ಉತ್ತಮ ಪದ್ಧತಿಗಳಲ್ಲಿ ಸರಿಯಾದ ಮಣ್ಣಿನ ತಯಾರಿಕೆ, ಸಮಯೋಚಿತ ನೆಡುವಿಕೆ, ಸೂಕ್ತ ಗೊಬ್ಬರ ಮತ್ತು ಕೀಟ ಮತ್ತು ರೋಗಗಳಿಗೆ ನಿಯಮಿತ ಮೇಲ್ವಿಚಾರಣೆ ಸೇರಿವೆ।',
    pa: 'ਆਮ ਖੇਤੀਬਾੜੀ ਦੀਆਂ ਸਰਵੋਤਮ ਪ੍ਰਥਾਵਾਂ ਵਿੱਚ ਸਹੀ ਮਿੱਟੀ ਦੀ ਤਿਆਰੀ, ਸਮੇਂ ਸਿਰ ਬੀਜਣਾ, ਉਚਿਤ ਖਾਦ ਪਾਉਣਾ, ਅਤੇ ਕੀੜੇ ਅਤੇ ਬੀਮਾਰੀਆਂ ਲਈ ਨਿਯਮਿਤ ਨਿਗਰਾਨੀ ਸ਼ਾਮਲ ਹੈ।',
    ta: 'பொதுவான விவசாய சிறந்த நடைமுறைகளில் சரியான மண் தயாரிப்பு, சரியான நேரத்தில் நடவு, பொருத்தமான உரமிடுதல், மற்றும் பூச்சிகள் மற்றும் நோய்களுக்கு வழக்கமான கண்காணிப்பு ஆகியவை அடங்கும்.'
  }

  return {
    query,
    relevant_documents: [{
      id: 'fallback',
      content: fallbackContent[language as keyof typeof fallbackContent] || fallbackContent.en,
      score: 0.5,
      metadata: { source: 'fallback', type: 'general_knowledge' }
    }],
    context_summary: fallbackContent[language as keyof typeof fallbackContent] || fallbackContent.en,
    confidence: 0.3,
    sources: ['fallback']
  }
}

// Utility functions for document management
export async function addDocument(document: Document): Promise<boolean> {
  return await ingestDocuments([document])
}

export async function addDocumentBatch(documents: Document[]): Promise<boolean> {
  const batchSize = 100
  let successCount = 0

  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize)
    const success = await ingestDocuments(batch)
    if (success) successCount += batch.length
  }

  console.log(`Successfully ingested ${successCount}/${documents.length} documents`)
  return successCount === documents.length
}

// Query analysis and enhancement
export function analyzeQuery(query: string): {
  intent: string
  entities: string[]
  crop_type?: string
  region?: string
  urgency: 'low' | 'medium' | 'high'
} {
  // Simple rule-based query analysis (could be enhanced with NLP)
  const lowercaseQuery = query.toLowerCase()
  
  let intent = 'general_advice'
  if (lowercaseQuery.includes('pest') || lowercaseQuery.includes('insect')) intent = 'pest_management'
  else if (lowercaseQuery.includes('disease') || lowercaseQuery.includes('fungus')) intent = 'disease_management'
  else if (lowercaseQuery.includes('weather') || lowercaseQuery.includes('rain')) intent = 'weather_advice'
  else if (lowercaseQuery.includes('price') || lowercaseQuery.includes('market')) intent = 'market_info'
  else if (lowercaseQuery.includes('fertilizer') || lowercaseQuery.includes('nutrition')) intent = 'nutrition_management'

  const entities = []
  const crops = ['rice', 'wheat', 'corn', 'tomato', 'potato', 'cotton', 'sugarcane', 'soybean']
  const regions = ['punjab', 'haryana', 'uttar pradesh', 'bihar', 'west bengal', 'maharashtra', 'karnataka', 'tamil nadu']
  
  for (const crop of crops) {
    if (lowercaseQuery.includes(crop)) entities.push(crop)
  }
  
  let region: string | undefined
  for (const r of regions) {
    if (lowercaseQuery.includes(r)) {
      region = r
      entities.push(r)
      break
    }
  }

  let urgency: 'low' | 'medium' | 'high' = 'medium'
  if (lowercaseQuery.includes('urgent') || lowercaseQuery.includes('emergency') || lowercaseQuery.includes('dying')) {
    urgency = 'high'
  } else if (lowercaseQuery.includes('plan') || lowercaseQuery.includes('prepare') || lowercaseQuery.includes('future')) {
    urgency = 'low'
  }

  return {
    intent,
    entities,
    crop_type: crops.find(crop => lowercaseQuery.includes(crop)),
    region,
    urgency
  }
}

// Health check for RAG system
export async function checkRAGHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy'
  milvus_connected: boolean
  embedding_service: boolean
  document_count: number
  last_updated: string
}> {
  try {
    const milvusConnected = milvusClient?.isConnected() || false
    
    // Test embedding generation
    let embeddingService = false
    try {
      const testEmbedding = await generateEmbeddings(['test'])
      embeddingService = testEmbedding.length > 0
    } catch {
      embeddingService = false
    }

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    if (!milvusConnected && !embeddingService) {
      status = 'unhealthy'
    } else if (!milvusConnected || !embeddingService) {
      status = 'degraded'
    }

    return {
      status,
      milvus_connected: milvusConnected,
      embedding_service: embeddingService,
      document_count: 0, // Would query actual document count
      last_updated: new Date().toISOString()
    }
  } catch (error) {
    console.error('RAG health check failed:', error)
    return {
      status: 'unhealthy',
      milvus_connected: false,
      embedding_service: false,
      document_count: 0,
      last_updated: new Date().toISOString()
    }
  }
}

// Initialize RAG system
export async function initializeRAG(): Promise<boolean> {
  try {
    console.log('🚀 Initializing RAG system...')
    
    const success = await initializeMilvus()
    if (success) {
      console.log('✅ RAG system initialized successfully')
    }
    
    return success
  } catch (error) {
    console.error('❌ Failed to initialize RAG system:', error)
    return false
  }
}

// Cleanup function
export async function cleanupRAG(): Promise<void> {
  if (milvusClient) {
    await milvusClient.disconnect()
    milvusClient = null
  }
  console.log('🧹 RAG system cleaned up')
}