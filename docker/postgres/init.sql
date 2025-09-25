-- FarmGuard Database Initialization Script
-- Creates the necessary tables and initial data for the hybrid AI stack

-- Create database extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "ltree";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    language VARCHAR(10) DEFAULT 'hi',
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    village VARCHAR(255),
    district VARCHAR(255),
    state VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create farms table
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    area_acres DECIMAL(8, 2),
    soil_type VARCHAR(100),
    irrigation_type VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crops table
CREATE TABLE IF NOT EXISTS crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    crop_type VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    planting_date DATE,
    expected_harvest_date DATE,
    area_acres DECIMAL(8, 2),
    status VARCHAR(50) DEFAULT 'planted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pest_disease_reports table
CREATE TABLE IF NOT EXISTS pest_disease_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_id UUID REFERENCES crops(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT,
    description TEXT,
    severity VARCHAR(20) DEFAULT 'medium',
    ai_prediction JSONB,
    human_verification JSONB,
    confidence_score DECIMAL(3, 2),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create advisories table
CREATE TABLE IF NOT EXISTS advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- pest, disease, weather, market, general
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    urgency VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    language VARCHAR(10) DEFAULT 'hi',
    ai_generated BOOLEAN DEFAULT false,
    human_reviewed BOOLEAN DEFAULT false,
    reviewed_by UUID REFERENCES users(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    message_count INTEGER DEFAULT 0,
    language VARCHAR(10) DEFAULT 'hi',
    metadata JSONB
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- user, assistant, system
    content TEXT NOT NULL,
    model_used VARCHAR(100),
    source VARCHAR(50), -- local_ai, openai, fallback
    tokens_used INTEGER,
    response_time DECIMAL(6, 3),
    confidence_score DECIMAL(3, 2),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create weather_data table
CREATE TABLE IF NOT EXISTS weather_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_latitude DECIMAL(10, 8) NOT NULL,
    location_longitude DECIMAL(11, 8) NOT NULL,
    date DATE NOT NULL,
    temperature_max DECIMAL(4, 1),
    temperature_min DECIMAL(4, 1),
    humidity DECIMAL(5, 2),
    rainfall DECIMAL(6, 2),
    wind_speed DECIMAL(5, 2),
    weather_condition VARCHAR(100),
    farming_recommendations JSONB,
    source VARCHAR(50) DEFAULT 'openweathermap',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(location_latitude, location_longitude, date, source)
);

-- Create market_prices table
CREATE TABLE IF NOT EXISTS market_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crop_type VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    market_location VARCHAR(255) NOT NULL,
    state VARCHAR(100),
    price_min DECIMAL(8, 2),
    price_max DECIMAL(8, 2),
    price_modal DECIMAL(8, 2),
    unit VARCHAR(20) DEFAULT 'per quintal',
    date DATE NOT NULL,
    source VARCHAR(100) DEFAULT 'agmarknet',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(crop_type, variety, market_location, date, source)
);

-- Create human_review_queue table
CREATE TABLE IF NOT EXISTS human_review_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_type VARCHAR(50) NOT NULL, -- pest_report, advisory, chat_escalation
    item_id UUID NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    assigned_to UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, rejected
    notes TEXT,
    confidence_threshold DECIMAL(3, 2),
    ai_prediction JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_log table
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create model_performance table
CREATE TABLE IF NOT EXISTS model_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50),
    task_type VARCHAR(50), -- chat, image_classification, pest_detection
    accuracy DECIMAL(5, 4),
    precision_score DECIMAL(5, 4),
    recall DECIMAL(5, 4),
    f1_score DECIMAL(5, 4),
    inference_time_ms DECIMAL(8, 2),
    total_requests INTEGER DEFAULT 0,
    successful_requests INTEGER DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(model_name, model_version, task_type, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location_latitude, location_longitude);
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_crops_farm_id ON crops(farm_id);
CREATE INDEX IF NOT EXISTS idx_crops_status ON crops(status);
CREATE INDEX IF NOT EXISTS idx_pest_reports_crop_id ON pest_disease_reports(crop_id);
CREATE INDEX IF NOT EXISTS idx_pest_reports_status ON pest_disease_reports(status);
CREATE INDEX IF NOT EXISTS idx_pest_reports_created_at ON pest_disease_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_advisories_user_id ON advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_type ON advisories(type);
CREATE INDEX IF NOT EXISTS idx_advisories_urgency ON advisories(urgency);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_weather_data_location_date ON weather_data(location_latitude, location_longitude, date);
CREATE INDEX IF NOT EXISTS idx_market_prices_crop_date ON market_prices(crop_type, date);
CREATE INDEX IF NOT EXISTS idx_review_queue_status ON human_review_queue(status);
CREATE INDEX IF NOT EXISTS idx_review_queue_priority ON human_review_queue(priority);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- Insert sample extension officer user
INSERT INTO users (phone_number, name, language, village, district, state) 
VALUES ('+91-9876543210', 'Extension Officer', 'hi', 'Sample Village', 'Sample District', 'Punjab')
ON CONFLICT (phone_number) DO NOTHING;

-- Create function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crops_updated_at BEFORE UPDATE ON crops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pest_reports_updated_at BEFORE UPDATE ON pest_disease_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_advisories_updated_at BEFORE UPDATE ON advisories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_review_queue_updated_at BEFORE UPDATE ON human_review_queue FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO farmguard;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO farmguard;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO farmguard;

-- Log completion
INSERT INTO audit_log (action, resource_type, new_values)
VALUES ('database_initialization', 'system', '{"status": "completed", "timestamp": "' || NOW() || '"}');