-- Create training_requests table
CREATE TABLE IF NOT EXISTS training_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    course JSONB NOT NULL,
    trainer JSONB,
    request_details JSONB DEFAULT '{}',
    schedule JSONB DEFAULT '{}',
    cost JSONB DEFAULT '{}',
    approval JSONB DEFAULT '{}',
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    department VARCHAR(100),
    tags TEXT[],
    attachments JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, cancelled, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_training_requests_employee_id ON training_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_training_requests_status ON training_requests(status);
CREATE INDEX IF NOT EXISTS idx_training_requests_priority ON training_requests(priority);
CREATE INDEX IF NOT EXISTS idx_training_requests_department ON training_requests(department);
CREATE INDEX IF NOT EXISTS idx_training_requests_created_at ON training_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_training_requests_tags ON training_requests USING GIN(tags);

-- Create updated_at trigger
CREATE TRIGGER update_training_requests_updated_at 
    BEFORE UPDATE ON training_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO training_requests (id, employee_id, course, trainer, request_details, schedule, cost, approval, priority, department, tags, status) VALUES
(
    'req_001'::uuid,
    'emp_001'::uuid,
    '{"id": "course_005", "title": "Advanced React Development", "description": "Advanced React patterns, performance optimization, and modern development practices", "duration": "40 hours", "level": "Advanced"}',
    '{"id": "trainer_003", "name": "Dr. Mike Chen", "email": "mike.chen@company.com"}',
    '{"justification": "Need to upgrade skills for upcoming project requirements. The team is moving to React 18 and implementing advanced patterns for better performance.", "businessImpact": "Will improve development velocity and code quality for the new e-commerce platform project.", "expectedOutcome": "Master advanced React patterns and performance optimization techniques.", "timeline": "Need to complete training before project kickoff in March 2024."}',
    '{"preferredStartDate": "2024-02-01", "preferredEndDate": "2024-02-15", "preferredTimeSlots": ["9:00 AM - 12:00 PM", "2:00 PM - 5:00 PM"], "timezone": "PST", "flexibility": "moderate"}',
    '{"courseFee": 1200, "materials": 50, "total": 1250, "currency": "USD", "budgetCode": "ENG-TRAINING-2024"}',
    '{"status": "pending", "requestedDate": "2024-01-10T09:30:00Z", "approverId": null, "approverName": null, "approvedDate": null, "rejectionReason": null, "comments": []}',
    'high',
    'Engineering',
    ARRAY['react', 'frontend', 'performance', 'advanced'],
    'pending'
),
(
    'req_002'::uuid,
    'emp_002'::uuid,
    '{"id": "course_006", "title": "Project Management Fundamentals", "description": "Essential project management skills, methodologies, and tools for successful project delivery", "duration": "30 hours", "level": "Intermediate"}',
    '{"id": "trainer_004", "name": "Lisa Anderson", "email": "lisa.anderson@company.com"}',
    '{"justification": "Required for new role as team lead. Need to formalize project management skills to effectively manage the product development team.", "businessImpact": "Will improve project delivery timelines and team coordination for product initiatives.", "expectedOutcome": "Gain certification in project management and improve team leadership skills.", "timeline": "Complete training before taking on team lead responsibilities in February 2024."}',
    '{"preferredStartDate": "2024-01-20", "preferredEndDate": "2024-01-25", "preferredTimeSlots": ["10:00 AM - 4:00 PM"], "timezone": "PST", "flexibility": "low"}',
    '{"courseFee": 800, "materials": 25, "total": 825, "currency": "USD", "budgetCode": "PROD-TRAINING-2024"}',
    '{"status": "approved", "requestedDate": "2024-01-08T14:20:00Z", "approverId": "mgr_001", "approverName": "John Smith", "approvedDate": "2024-01-09T10:15:00Z", "rejectionReason": null, "comments": [{"author": "John Smith", "comment": "Approved. This training aligns with the team lead promotion and will benefit the entire product team.", "date": "2024-01-09T10:15:00Z"}]}',
    'medium',
    'Product',
    ARRAY['project-management', 'leadership', 'certification'],
    'approved'
);
