# FarmGuard Hybrid AI Stack - Deployment Guide

## 🏗️ Architecture Overview

The FarmGuard hybrid AI stack has been successfully implemented with the following components:

### **Core Infrastructure**
- **Next.js Frontend** - PWA with multilingual support
- **PostgreSQL** - Primary database with comprehensive schema
- **Redis** - Caching, sessions, and job queues
- **MinIO** - S3-compatible object storage
- **Milvus** - Vector database for RAG pipeline

### **AI Services**
- **LocalAI** - Local LLM inference (OpenAI-compatible API)
- **Ollama** - Alternative local LLM server
- **Image Inference Service** - YOLOv8-based pest detection
- **FastAPI AI Backend** - Orchestration layer

### **Advanced Features**
- **RAG Pipeline** - Retrieval-Augmented Generation with agricultural knowledge
- **Circuit Breaker Pattern** - Fault tolerance and graceful degradation
- **Multi-provider Fallback** - LocalAI → Ollama → AI Backend → OpenAI → Mock
- **Health Monitoring** - Comprehensive health checks and metrics
- **Human Review Queue** - Low-confidence predictions escalation

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- 8GB+ RAM (16GB recommended)
- GPU support (optional but recommended)
- Node.js 18+ for development

### 1. Environment Setup

Create `.env.local` file:

```bash
# AI Configuration
USE_LOCAL_AI=true
AI_PROVIDER=localai
LOCALAI_URL=http://localhost:8080
OLLAMA_URL=http://localhost:11434
AI_BACKEND_URL=http://localhost:8000
IMAGE_INFERENCE_URL=http://localhost:8001

# Database Configuration
DATABASE_URL=postgresql://farmguard:farmguard_password@localhost:5432/farmguard
REDIS_URL=redis://localhost:6379
MILVUS_URI=http://localhost:19530

# Storage Configuration
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=farmguard
MINIO_SECRET_KEY=farmguard123

# External API Keys (optional fallbacks)
OPENAI_API_KEY=your_openai_key_here
COHERE_API_KEY=your_cohere_key_here
WEATHER_API_KEY=your_weather_key_here

# Feature Toggles
ENABLE_RAG=true
ENABLE_IMAGE_ANALYSIS=true
ENABLE_HUMAN_REVIEW=true
ENABLE_SPEECH_TO_TEXT=true
ENABLE_TEXT_TO_SPEECH=true

# Performance Tuning
HUMAN_REVIEW_THRESHOLD=0.6
MAX_FILE_SIZE_MB=20
MAX_BATCH_SIZE=10
```

### 2. Infrastructure Deployment

```bash
# Start core infrastructure
docker-compose up -d postgres redis minio etcd minio-milvus milvus-standalone

# Wait for services to be ready
docker-compose logs -f milvus-standalone

# Start AI services
docker-compose up -d localai ai-backend image-inference

# Start the main application
docker-compose up -d app
```

### 3. Model Setup

#### Download Models (LocalAI)

```bash
# Create models directory
mkdir -p models

# Download Mistral 7B (4-bit quantized)
wget -O models/mistral-7b-instruct-v0.1.Q4_K_M.gguf \
  https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf

# Download embedding model
wget -O models/all-MiniLM-L6-v2.tar.gz \
  https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2/archive/main.tar.gz

# Extract embedding model
cd models && tar -xzf all-MiniLM-L6-v2.tar.gz
```

#### Alternative: Ollama Models

```bash
# If using Ollama instead of LocalAI
docker exec -it farmguard-ollama ollama pull mistral:7b-instruct
docker exec -it farmguard-ollama ollama pull nomic-embed-text
```

### 4. Initialize Knowledge Base

```bash
# Run document ingestion script
npm run ingest-documents

# Or using Docker
docker-compose exec app npm run ingest-documents
```

### 5. Verify Deployment

Check all services:
```bash
# Health checks
curl http://localhost:3000/api/health          # Main app
curl http://localhost:8080/readyz              # LocalAI
curl http://localhost:8000/health              # AI Backend
curl http://localhost:8001/health              # Image inference
curl http://localhost:19530                    # Milvus
```

## 📊 Service Architecture

### **Request Flow**

1. **User Request** → Next.js Frontend
2. **AI Processing** → Circuit Breaker → Local LLM Client
3. **Provider Selection** → LocalAI/Ollama/AI Backend
4. **RAG Enhancement** → Milvus → Context Retrieval
5. **Response Generation** → Enhanced Prompt → LLM
6. **Quality Check** → Confidence Score → Human Review Queue (if low)

### **Fallback Strategy**

```
LocalAI (Primary) 
    ↓ (on failure)
Ollama (Secondary)
    ↓ (on failure)  
AI Backend (Tertiary)
    ↓ (on failure)
OpenAI (External)
    ↓ (on failure)
Mock Response (Emergency)
```

## 🛠️ Configuration Options

### **AI Provider Configuration**

```typescript
// lib/api-config.ts
export const LOCAL_AI_CONFIG = {
  PROVIDER: {
    PRIMARY: 'localai',           // localai, ollama, ai_backend
    FALLBACK_ORDER: ['localai', 'ollama', 'ai_backend', 'openai', 'mock'],
    SWITCH_THRESHOLD: 3,          // Failures before switching
  },
  
  CIRCUIT_BREAKER: {
    FAILURE_THRESHOLD: 5,         // Failures to open circuit
    SUCCESS_THRESHOLD: 3,         // Successes to close circuit
    TIMEOUT: 60000,               // Circuit open timeout (ms)
  }
}
```

### **Docker Compose Profiles**

```bash
# Development mode
docker-compose --profile dev up

# Production mode
docker-compose --profile production up

# With monitoring
docker-compose --profile monitoring up

# With GPU support
docker-compose --profile gpu up
```

## 📈 Monitoring & Observability

### **Built-in Health Endpoints**

- **Main App**: `GET /api/health`
- **AI Backend**: `GET /health`
- **Image Inference**: `GET /health`
- **LocalAI**: `GET /readyz`
- **Milvus**: `GET :19530` (gRPC)

### **Metrics Collection**

```bash
# Prometheus metrics
curl http://localhost:9090/metrics

# Grafana dashboards
http://localhost:3003 (admin/admin)
```

### **Log Monitoring**

```bash
# View logs
docker-compose logs -f app
docker-compose logs -f localai
docker-compose logs -f image-inference
```

## 🔧 Troubleshooting

### **Common Issues**

#### LocalAI not responding
```bash
# Check model loading
docker-compose logs localai

# Restart LocalAI
docker-compose restart localai

# Check disk space (models are large)
df -h
```

#### Milvus connection issues
```bash
# Check Milvus logs
docker-compose logs milvus-standalone

# Restart Milvus stack
docker-compose restart etcd minio-milvus milvus-standalone
```

#### Out of memory errors
```bash
# Monitor resource usage
docker stats

# Reduce model size or use quantized models
# Edit docker-compose.yml to add memory limits
```

### **Performance Tuning**

#### GPU Acceleration
```bash
# Enable GPU support
docker-compose --profile gpu up localai image-inference

# Verify GPU usage
nvidia-smi
```

#### Model Optimization
```bash
# Use smaller models for development
OLLAMA_MODEL=phi3:mini

# Adjust LocalAI configuration
# Edit docker/localai/config.yaml
```

## 🔒 Security Considerations

### **Production Security**

1. **Change Default Passwords**
   ```bash
   # PostgreSQL
   POSTGRES_PASSWORD=your_secure_password
   
   # MinIO
   MINIO_ROOT_PASSWORD=your_secure_password
   
   # Grafana
   GF_SECURITY_ADMIN_PASSWORD=your_secure_password
   ```

2. **Enable TLS**
   ```bash
   # Add SSL certificates
   # Update nginx configuration
   ```

3. **Network Security**
   ```bash
   # Use internal networks
   # Restrict external access
   # Enable firewall rules
   ```

4. **API Security**
   ```bash
   # Add authentication
   # Implement rate limiting
   # Input sanitization (already implemented)
   ```

## 📚 Data Management

### **RAG Knowledge Base**

```bash
# Add new documents
npm run add-documents -- --path ./new-docs/

# Re-index existing documents
npm run reindex-documents

# View document statistics
curl http://localhost:8000/rag/stats
```

### **Model Management**

```bash
# Update models
./scripts/update-models.sh

# Model versioning
docker tag farmguard-app:latest farmguard-app:v1.0.0
```

### **Database Migrations**

```bash
# Run migrations
npx prisma db push

# Backup database
docker exec farmguard-postgres pg_dump -U farmguard farmguard > backup.sql
```

## 🚢 Production Deployment

### **Kubernetes Deployment**

```bash
# Deploy to Kubernetes
kubectl apply -f k8s/

# Monitor deployment
kubectl get pods -n farmguard
```

### **Scaling Options**

1. **Horizontal Scaling**
   - Multiple app instances behind load balancer
   - GPU worker nodes for inference
   - Redis cluster for high availability

2. **Vertical Scaling**
   - Larger GPU instances
   - More RAM for model caching
   - Faster storage for embeddings

### **Monitoring Stack**

```bash
# Full monitoring stack
docker-compose --profile monitoring up -d

# Access dashboards
echo "Grafana: http://localhost:3003"
echo "Prometheus: http://localhost:9090"
```

## 🎯 Performance Benchmarks

### **Expected Performance**

| Component | Response Time | Throughput |
|-----------|---------------|------------|
| LocalAI | 1-3s | 10-30 req/min |
| Ollama | 2-5s | 5-20 req/min |
| Image Inference | 0.5-2s | 60+ req/min |
| RAG Retrieval | 100-300ms | 200+ req/min |
| Database | 10-50ms | 1000+ req/min |

### **Resource Requirements**

| Environment | CPU | RAM | Storage | GPU |
|-------------|-----|-----|---------|-----|
| Development | 4 cores | 8GB | 50GB | Optional |
| Staging | 8 cores | 16GB | 100GB | 1x GTX 1660+ |
| Production | 16+ cores | 32GB+ | 500GB+ | 1x RTX 3080+ |

## 🤝 Contributing

### **Development Workflow**

```bash
# Setup development environment
npm install
docker-compose --profile dev up

# Run tests
npm test

# Code quality
npm run lint
npm run type-check
```

### **Adding New Features**

1. **New AI Models**: Update `lib/local-llm-client.ts`
2. **New RAG Sources**: Add documents to `scripts/ingest-documents.ts`
3. **New Languages**: Update `lib/i18n.ts`
4. **New Monitoring**: Add metrics to services

---

## 🎉 Success!

Your FarmGuard hybrid AI stack is now ready for production use with:

✅ **Local AI Inference** - No per-token costs
✅ **Vector RAG Pipeline** - Grounded responses  
✅ **Circuit Breaker Pattern** - High availability
✅ **Multi-language Support** - Reach more farmers
✅ **Image Analysis** - Pest detection capabilities
✅ **Human Review System** - Quality assurance
✅ **Comprehensive Monitoring** - Production-ready observability

The system is designed to scale from pilot deployments to national-level agricultural AI services while maintaining cost efficiency and reliability.