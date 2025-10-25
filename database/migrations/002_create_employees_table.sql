-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(100),
    department VARCHAR(100),
    team VARCHAR(100),
    manager_id UUID REFERENCES employees(id),
    location VARCHAR(255),
    start_date DATE,
    employment_type VARCHAR(50) DEFAULT 'full-time',
    status VARCHAR(50) DEFAULT 'active',
    avatar_url VARCHAR(500),
    profile JSONB DEFAULT '{}',
    training_history JSONB DEFAULT '[]',
    current_trainings JSONB DEFAULT '[]',
    skill_gaps JSONB DEFAULT '[]',
    relevance_score INTEGER DEFAULT 0,
    performance JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Ensure unique employee_id per company
    UNIQUE(company_id, employee_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_employees_company_id ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_manager_id ON employees(manager_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_is_active ON employees(is_active);
CREATE INDEX IF NOT EXISTS idx_employees_created_at ON employees(created_at);

-- Create updated_at trigger
CREATE TRIGGER update_employees_updated_at 
    BEFORE UPDATE ON employees 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO employees (id, company_id, employee_id, first_name, last_name, email, phone, position, department, team, manager_id, location, start_date, profile, training_history, current_trainings, skill_gaps, relevance_score, performance) VALUES
(
    'emp_001'::uuid,
    'comp_001'::uuid,
    'EMP001',
    'Sarah',
    'Johnson',
    'sarah.johnson@techcorp.com',
    '+1 (555) 123-4567',
    'Senior Software Engineer',
    'Engineering',
    'Frontend Team',
    'emp_002'::uuid,
    'San Francisco, CA',
    '2022-03-15',
    '{"overview": {"bio": "Passionate frontend developer with 5+ years of experience in React and modern web technologies.", "linkedin": "https://linkedin.com/in/sarahjohnson", "github": "https://github.com/sarahjohnson", "timezone": "PST", "preferredLanguage": "en"}, "competences": {"technical": [{"category": "Frontend Development", "skills": [{"name": "React", "level": "Expert", "yearsOfExperience": 5, "lastUsed": "2024-01-15", "certifications": ["React Professional Certificate"], "projects": ["E-commerce Platform", "Dashboard Application"]}]}]}}',
    '[{"id": "training_001", "title": "Advanced React Patterns", "trainer": "Dr. Mike Chen", "completedDate": "2023-11-15", "score": 95, "certificate": "cert_001", "skills": ["React", "Advanced Patterns", "Performance Optimization"]}]',
    '[{"id": "training_003", "title": "Microservices Architecture", "trainer": "Prof. Michael Brown", "startDate": "2024-01-15", "endDate": "2024-02-15", "progress": 65, "status": "in-progress"}]',
    '[{"skill": "Docker", "requiredLevel": "Intermediate", "currentLevel": "Beginner", "priority": "high", "recommendedCourses": ["Docker Fundamentals", "Container Orchestration"]}]',
    87,
    '{"overall": 4.2, "technical": 4.5, "communication": 4.0, "leadership": 3.8, "lastReview": "2023-12-15"}'
),
(
    'emp_002'::uuid,
    'comp_001'::uuid,
    'EMP002',
    'Mike',
    'Chen',
    'mike.chen@techcorp.com',
    '+1 (555) 234-5678',
    'Engineering Manager',
    'Engineering',
    'Frontend Team',
    NULL,
    'San Francisco, CA',
    '2020-01-10',
    '{"overview": {"bio": "Engineering manager with 8+ years of experience in software development and team leadership.", "linkedin": "https://linkedin.com/in/mikechen", "github": "https://github.com/mikechen", "timezone": "PST", "preferredLanguage": "en"}, "competences": {"technical": [{"category": "Full Stack Development", "skills": [{"name": "React", "level": "Expert", "yearsOfExperience": 6, "lastUsed": "2024-01-15", "certifications": [], "projects": ["Multiple Enterprise Applications"]}]}]}}',
    '[{"id": "training_004", "title": "Leadership Excellence", "trainer": "Lisa Anderson", "completedDate": "2023-10-30", "score": 92, "certificate": "cert_003", "skills": ["Leadership", "Team Management", "Strategic Planning"]}]',
    '[]',
    '[{"skill": "Business Strategy", "requiredLevel": "Intermediate", "currentLevel": "Beginner", "priority": "medium", "recommendedCourses": ["Business Strategy Fundamentals", "Strategic Planning"]}]',
    94,
    '{"overall": 4.6, "technical": 4.7, "communication": 4.5, "leadership": 4.8, "lastReview": "2023-12-20"}'
);
