-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    industry VARCHAR(100),
    size VARCHAR(50),
    location VARCHAR(255),
    founded DATE,
    description TEXT,
    website VARCHAR(255),
    logo_url VARCHAR(500),
    settings JSONB DEFAULT '{}',
    subscription JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(domain);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);
CREATE INDEX IF NOT EXISTS idx_companies_is_active ON companies(is_active);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at 
    BEFORE UPDATE ON companies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO companies (id, name, domain, industry, size, location, founded, description, website, settings, subscription) VALUES
(
    'comp_001'::uuid,
    'TechCorp Solutions',
    'techcorp.com',
    'Technology',
    '500-1000',
    'San Francisco, CA',
    '2015-03-15',
    'Leading technology solutions provider specializing in enterprise software development and digital transformation.',
    'https://www.techcorp.com',
    '{"timezone": "PST", "currency": "USD", "language": "en", "features": {"analytics": true, "reporting": true, "integrations": true, "customBranding": false}}',
    '{"plan": "enterprise", "status": "active", "startDate": "2023-01-01", "endDate": "2024-12-31", "maxEmployees": 1000, "maxTrainers": 50}'
),
(
    'comp_002'::uuid,
    'Global Finance Inc',
    'globalfinance.com',
    'Financial Services',
    '1000-5000',
    'New York, NY',
    '2010-08-22',
    'International financial services company providing investment banking, asset management, and wealth management services.',
    'https://www.globalfinance.com',
    '{"timezone": "EST", "currency": "USD", "language": "en", "features": {"analytics": true, "reporting": true, "integrations": true, "customBranding": true}}',
    '{"plan": "premium", "status": "active", "startDate": "2023-06-01", "endDate": "2024-05-31", "maxEmployees": 5000, "maxTrainers": 100}'
);
