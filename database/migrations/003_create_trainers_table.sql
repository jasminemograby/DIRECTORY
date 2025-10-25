-- Create trainers table
CREATE TABLE IF NOT EXISTS trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    bio TEXT,
    avatar_url VARCHAR(500),
    trainer_type VARCHAR(50) DEFAULT 'internal', -- internal, external, freelance
    teaching_mode VARCHAR(50) DEFAULT 'online', -- online, offline, hybrid
    specializations TEXT[],
    certifications JSONB DEFAULT '[]',
    languages TEXT[],
    availability JSONB DEFAULT '{}',
    pricing JSONB DEFAULT '{}',
    ai_editing JSONB DEFAULT '{}',
    publish_permission JSONB DEFAULT '{}',
    rating JSONB DEFAULT '{}',
    courses JSONB DEFAULT '[]',
    recent_reviews JSONB DEFAULT '[]',
    teaching_experience VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_trainers_email ON trainers(email);
CREATE INDEX IF NOT EXISTS idx_trainers_trainer_type ON trainers(trainer_type);
CREATE INDEX IF NOT EXISTS idx_trainers_teaching_mode ON trainers(teaching_mode);
CREATE INDEX IF NOT EXISTS idx_trainers_is_active ON trainers(is_active);
CREATE INDEX IF NOT EXISTS idx_trainers_created_at ON trainers(created_at);
CREATE INDEX IF NOT EXISTS idx_trainers_specializations ON trainers USING GIN(specializations);

-- Create updated_at trigger
CREATE TRIGGER update_trainers_updated_at 
    BEFORE UPDATE ON trainers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO trainers (id, name, title, email, phone, bio, trainer_type, teaching_mode, specializations, certifications, languages, availability, pricing, ai_editing, publish_permission, rating, courses, recent_reviews, teaching_experience) VALUES
(
    'trainer_001'::uuid,
    'Dr. Sarah Wilson',
    'Senior Data Science Instructor',
    'sarah.wilson@company.com',
    '+1 (555) 987-6543',
    'Experienced data scientist with 10+ years in machine learning and AI. PhD in Computer Science from Stanford University.',
    'internal',
    'online',
    ARRAY['Machine Learning', 'Deep Learning', 'Data Analysis', 'Python Programming', 'Statistics'],
    '[{"name": "AWS Machine Learning Specialty", "issuer": "Amazon", "date": "2023-08-15", "credentialId": "AWS-ML-001"}, {"name": "Google Cloud ML Engineer", "issuer": "Google", "date": "2023-05-20", "credentialId": "GCP-ML-001"}]',
    ARRAY['English', 'Spanish'],
    '{"timezone": "PST", "schedule": [{"day": "Monday", "hours": "9:00 AM - 5:00 PM"}, {"day": "Tuesday", "hours": "9:00 AM - 5:00 PM"}]}',
    '{"hourlyRate": 150, "courseRate": 299, "currency": "USD"}',
    '{"enabled": true, "lastEdited": "2024-01-10T14:30:00Z", "version": "2.1"}',
    '{"canPublish": true, "approvedBy": "admin_001", "approvedDate": "2023-12-01T00:00:00Z"}',
    '{"average": 4.8, "count": 127, "breakdown": {"5": 98, "4": 25, "3": 3, "2": 1, "1": 0}}',
    '[{"id": "course_001", "title": "Machine Learning Fundamentals", "description": "Introduction to ML algorithms and techniques", "duration": "40 hours", "level": "Beginner", "students": 245, "rating": 4.7, "price": 299, "status": "active"}]',
    '[{"id": "review_001", "student": "Alex Thompson", "rating": 5, "comment": "Excellent instructor! Very knowledgeable and patient.", "date": "2024-01-10", "course": "Machine Learning Fundamentals"}]',
    '8 years'
),
(
    'trainer_002'::uuid,
    'Prof. Michael Brown',
    'Cloud Architecture Expert',
    'michael.brown@company.com',
    '+1 (555) 876-5432',
    'Cloud architecture specialist with 12+ years of experience in AWS, Azure, and Google Cloud. Former solutions architect at major tech companies.',
    'external',
    'hybrid',
    ARRAY['AWS', 'Azure', 'Google Cloud', 'DevOps', 'Microservices', 'Container Orchestration'],
    '[{"name": "AWS Solutions Architect Professional", "issuer": "Amazon", "date": "2023-06-15", "credentialId": "AWS-SA-001"}, {"name": "Azure Solutions Architect Expert", "issuer": "Microsoft", "date": "2023-04-20", "credentialId": "AZURE-SA-001"}]',
    ARRAY['English'],
    '{"timezone": "EST", "schedule": [{"day": "Monday", "hours": "10:00 AM - 6:00 PM"}, {"day": "Tuesday", "hours": "10:00 AM - 6:00 PM"}]}',
    '{"hourlyRate": 200, "courseRate": 599, "currency": "USD"}',
    '{"enabled": false, "lastEdited": null, "version": "1.0"}',
    '{"canPublish": true, "approvedBy": "admin_001", "approvedDate": "2023-11-15T00:00:00Z"}',
    '{"average": 4.6, "count": 89, "breakdown": {"5": 65, "4": 20, "3": 3, "2": 1, "1": 0}}',
    '[{"id": "course_003", "title": "AWS Cloud Architecture", "description": "Complete AWS cloud architecture and best practices", "duration": "50 hours", "level": "Intermediate", "students": 156, "rating": 4.6, "price": 599, "status": "active"}]',
    '[{"id": "review_003", "student": "David Lee", "rating": 5, "comment": "Outstanding course! Very practical and well-structured.", "date": "2024-01-05", "course": "AWS Cloud Architecture"}]',
    '6 years'
);
