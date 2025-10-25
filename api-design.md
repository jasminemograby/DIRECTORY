# Directory Microservice - API Design & Endpoints

## RESTful API Design

The Directory microservice exposes a comprehensive RESTful API following clean architecture principles with proper error handling, validation, and documentation.

## API Base Configuration

### Base URL and Versioning
```
Base URL: https://directory-api.yourdomain.com/api/v1
Content-Type: application/json
Authentication: Bearer Token (from Auth Service)
```

### Common Response Format
```javascript
// Success Response
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully",
  "timestamp": "2024-12-19T10:30:00Z",
  "requestId": "req_12345"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": { /* specific error details */ }
  },
  "timestamp": "2024-12-19T10:30:00Z",
  "requestId": "req_12345"
}
```

## JSON Schemas

### Employee Profile Schema
```json
{
  "EmployeeProfile": {
    "type": "object",
    "properties": {
      "id": { "type": "string", "format": "uuid" },
      "companyId": { "type": "string", "format": "uuid" },
      "profileOverview": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "format": "uuid" },
          "name": { "type": "string" },
          "title": { "type": "string" },
          "departmentId": { "type": "string", "format": "uuid" },
          "teamId": { "type": "string", "format": "uuid" },
          "managerId": { "type": "string", "format": "uuid" },
          "employmentStartDate": { "type": "string", "format": "date" },
          "careerGoal": { "type": "string" },
          "experienceYears": { "type": "number" },
          "relevanceScore": { "type": "number", "minimum": 0, "maximum": 100 },
          "valueProposition": { "type": "string" }
        },
        "required": ["id", "name", "title", "departmentId", "teamId", "employmentStartDate"]
      },
      "competences": {
        "type": "array",
        "items": { "$ref": "#/Competence" }
      },
      "externalProfiles": {
        "type": "object",
        "properties": {
          "linkedin": { "type": "string", "format": "uri" },
          "github": { "type": "string" },
          "credly": { "type": "string", "format": "uri" },
          "orcid": { "type": "string" },
          "youtube": { "type": "string", "format": "uri" }
        }
      },
      "enrichmentStatus": {
        "type": "object",
        "properties": {
          "status": { "type": "string", "enum": ["pending", "in_progress", "completed", "failed"] },
          "lastEnriched": { "type": "string", "format": "date-time" },
          "sources": { "type": "array", "items": { "type": "string" } }
        }
      }
    }
  }
}
```

### Competence Schema
```json
{
  "Competence": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "subCompetences": {
        "type": "array",
        "items": { "$ref": "#/SubCompetence" }
      }
    },
    "required": ["name"]
  }
}
```

### SubCompetence Schema
```json
{
  "SubCompetence": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "skills": {
        "type": "array",
        "items": { "$ref": "#/Skill" }
      }
    },
    "required": ["name", "skills"]
  }
}
```

### Skill Schema
```json
{
  "Skill": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "verified": { "type": "boolean" },
      "source": { "type": "string", "enum": ["manual", "linkedin", "credly", "github", "gemini"] },
      "lastUpdated": { "type": "string", "format": "date-time" },
      "level": { "type": "string", "enum": ["beginner", "intermediate", "advanced", "expert"] },
      "yearsExperience": { "type": "number" }
    },
    "required": ["name", "verified", "source"]
  }
}
```

### Trainer Profile Schema
```json
{
  "TrainerProfile": {
    "type": "object",
    "properties": {
      "id": { "type": "string", "format": "uuid" },
      "employeeId": { "type": "string", "format": "uuid" },
      "companyId": { "type": "string", "format": "uuid" },
      "trainerType": { "type": "string", "enum": ["internal", "external"] },
      "teachingMode": { "type": "array", "items": { "type": "string", "enum": ["online", "offline", "blended"] } },
      "certifications": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "issuer": { "type": "string" },
            "issuedDate": { "type": "string", "format": "date" },
            "expiryDate": { "type": "string", "format": "date" },
            "credentialId": { "type": "string" }
          }
        }
      },
      "languages": { "type": "array", "items": { "type": "string" } },
      "availability": {
        "type": "object",
        "properties": {
          "timezone": { "type": "string" },
          "schedule": { "type": "object" }
        }
      },
      "pricing": {
        "type": "object",
        "properties": {
          "hourlyRate": { "type": "number" },
          "currency": { "type": "string" },
          "minimumHours": { "type": "number" }
        }
      },
      "aiEditingEnabled": { "type": "boolean" },
      "publishPermission": { "type": "string", "enum": ["internal", "system_wide"] },
      "averageRating": { "type": "number", "minimum": 0, "maximum": 5 },
      "reviewCount": { "type": "number" },
      "courseHistory": {
        "type": "array",
        "items": { "$ref": "#/CourseHistory" }
      }
    }
  }
}
```

### Course History Schema
```json
{
  "CourseHistory": {
    "type": "object",
    "properties": {
      "courseId": { "type": "string" },
      "title": { "type": "string" },
      "taughtAt": { "type": "string", "format": "date" },
      "studentCount": { "type": "number" },
      "rating": { "type": "number", "minimum": 0, "maximum": 5 },
      "skillCategories": { "type": "array", "items": { "type": "string" } }
    }
  }
}
```

### Skill Gap Schema
```json
{
  "SkillGap": {
    "type": "object",
    "properties": {
      "skill": { "type": "string" },
      "requiredLevel": { "type": "string", "enum": ["beginner", "intermediate", "advanced", "expert"] },
      "currentLevel": { "type": "string", "enum": ["beginner", "intermediate", "advanced", "expert"] },
      "gap": { "type": "string", "enum": ["none", "small", "medium", "large"] },
      "recommendedCourses": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "title": { "type": "string" },
            "provider": { "type": "string" },
            "estimatedDuration": { "type": "number" },
            "skillLevel": { "type": "string" }
          }
        }
      }
    }
  }
}
```

## Company Management Endpoints

### 1. Company Registration
```http
POST /api/v1/companies
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "TechCorp Solutions",
  "industry": "Technology",
  "size": "medium",
  "location": "San Francisco, CA",
  "website": "https://techcorp.com",
  "description": "Leading provider of enterprise software solutions",
  "kpis": {
    "employee_count": 250,
    "revenue": 50000000,
    "growth_rate": 0.15
  },
  "settings": {
    "timezone": "America/Los_Angeles",
    "working_hours": "9-17",
    "currency": "USD"
  },
  "departments": [
    {
      "name": "Engineering",
      "description": "Software development and engineering",
      "teams": [
        {
          "name": "Frontend Team",
          "description": "React and UI development"
        },
        {
          "name": "Backend Team", 
          "description": "API and server development"
        }
      ]
    }
  ],
  "employees": [
    {
      "first_name": "John",
      "last_name": "Smith",
      "email": "john.smith@techcorp.com",
      "employee_id": "TC001",
      "role": "hr_admin",
      "job_title": "HR Director",
      "department": "Engineering",
      "team": "Frontend Team"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "company": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "TechCorp Solutions",
      "status": "pending_verification",
      "created_at": "2024-12-19T10:30:00Z"
    },
    "departments": [
      {
        "id": "dept_12345",
        "name": "Engineering",
        "teams": [
          {
            "id": "team_12345",
            "name": "Frontend Team"
          }
        ]
      }
    ],
    "employees": [
      {
        "id": "emp_12345",
        "email": "john.smith@techcorp.com",
        "status": "pending_registration"
      }
    ]
  },
  "message": "Company registration initiated successfully"
}
```

### 2. Get Company Details
```http
GET /api/v1/companies/{companyId}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "company": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "TechCorp Solutions",
      "industry": "Technology",
      "size": "medium",
      "location": "San Francisco, CA",
      "website": "https://techcorp.com",
      "status": "active",
      "kpis": {
        "employee_count": 250,
        "revenue": 50000000,
        "growth_rate": 0.15
      },
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-12-19T10:30:00Z"
    },
    "hierarchy": {
      "departments": [
        {
          "id": "dept_12345",
          "name": "Engineering",
          "manager": {
            "id": "emp_12345",
            "name": "Jane Doe"
          },
          "teams": [
            {
              "id": "team_12345",
              "name": "Frontend Team",
              "team_lead": {
                "id": "emp_12346",
                "name": "Bob Johnson"
              },
              "employee_count": 8
            }
          ]
        }
      ]
    }
  }
}
```

### 3. Update Company
```http
PUT /api/v1/companies/{companyId}
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "TechCorp Solutions Inc",
  "description": "Updated description",
  "kpis": {
    "employee_count": 275,
    "revenue": 55000000,
    "growth_rate": 0.18
  }
}
```

## Employee Profile API Endpoints

### 1. Create Employee
```http
POST /api/v1/companies/{companyId}/employees
Content-Type: application/json
Authorization: Bearer <token>

{
  "first_name": "Alice",
  "last_name": "Johnson",
  "email": "alice.johnson@techcorp.com",
  "phone": "+1-555-0124",
  "employee_id": "TC002",
  "role": "employee",
  "job_title": "Software Engineer",
  "level": "mid",
  "career_path": "Engineering",
  "department_id": "dept_12345",
  "team_id": "team_12345",
  "hire_date": "2024-01-15",
  "location": "San Francisco, CA",
  "career_goal": "Become a Team Leader within one year",
  "skills": [
    {
      "name": "JavaScript",
      "level": "intermediate",
      "years_experience": 2,
      "source": "manual"
    }
  ],
  "external_profiles": {
    "linkedin_url": "https://linkedin.com/in/alicejohnson",
    "github_username": "alicejohnson"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "employee": {
      "id": "emp_12347",
      "first_name": "Alice",
      "last_name": "Johnson",
      "email": "alice.johnson@techcorp.com",
      "employee_id": "TC002",
      "role": "employee",
      "status": "active",
      "created_at": "2024-12-19T10:30:00Z"
    },
    "enrichment_status": {
      "linkedin": "pending",
      "github": "pending",
      "skills_engine": "pending"
    }
  },
  "message": "Employee created successfully"
}
```

### 2. Get Employee Profile (Full Structure)
```http
GET /api/v1/employees/{employeeId}/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "employee": {
      "id": "emp_12347",
      "companyId": "company_12345",
      "profileOverview": {
        "id": "emp_12347",
        "name": "Alice Johnson",
        "title": "Software Engineer",
        "departmentId": "dept_12345",
        "teamId": "team_12345",
        "managerId": "emp_12345",
        "employmentStartDate": "2024-01-15",
        "careerGoal": "Become a Team Leader within one year",
        "experienceYears": 2,
        "relevanceScore": 75,
        "valueProposition": "Alice works as a Software Engineer with 2 years experience in TechCorp Solutions. Career goal: Become a Team Leader within one year. Skill gap: https://skills-engine.com/gap/emp_12347"
      },
      "competences": [
        {
          "name": "Full Stack Development",
          "subCompetences": [
            {
              "name": "Frontend",
              "skills": [
                {
                  "name": "React",
                  "verified": true,
                  "source": "github",
                  "lastUpdated": "2024-12-19T10:00:00Z",
                  "level": "intermediate",
                  "yearsExperience": 2
                },
                {
                  "name": "Next.js",
                  "verified": false,
                  "source": "manual",
                  "lastUpdated": "2024-12-19T10:00:00Z",
                  "level": "beginner",
                  "yearsExperience": 1
                }
              ]
            },
            {
              "name": "Backend",
              "skills": [
                {
                  "name": "Node.js",
                  "verified": true,
                  "source": "github",
                  "lastUpdated": "2024-12-19T10:00:00Z",
                  "level": "intermediate",
                  "yearsExperience": 2
                },
                {
                  "name": "Express",
                  "verified": true,
                  "source": "github",
                  "lastUpdated": "2024-12-19T10:00:00Z",
                  "level": "intermediate",
                  "yearsExperience": 2
                }
              ]
            },
            {
              "name": "Database",
              "skills": [
                {
                  "name": "PostgreSQL",
                  "verified": false,
                  "source": "manual",
                  "lastUpdated": "2024-12-19T10:00:00Z",
                  "level": "beginner",
                  "yearsExperience": 1
                }
              ]
            }
          ]
        },
        {
          "name": "Java",
          "subCompetences": [
            {
              "name": "OOP",
              "skills": [
                {
                  "name": "Components",
                  "verified": true,
                  "source": "credly",
                  "lastUpdated": "2024-12-19T10:00:00Z",
                  "level": "intermediate",
                  "yearsExperience": 1
                },
                {
                  "name": "Spring Boot",
                  "verified": false,
                  "source": "manual",
                  "lastUpdated": "2024-12-19T10:00:00Z",
                  "level": "beginner",
                  "yearsExperience": 0
                }
              ]
            }
          ]
        }
      ],
      "externalProfiles": {
        "linkedin": "https://linkedin.com/in/alicejohnson",
        "github": "alicejohnson",
        "credly": "https://credly.com/users/alicejohnson",
        "orcid": "0000-0000-0000-0000",
        "youtube": "https://youtube.com/@alicejohnson"
      },
      "enrichmentStatus": {
        "status": "completed",
        "lastEnriched": "2024-12-19T10:00:00Z",
        "sources": ["linkedin", "github", "credly", "gemini"]
      }
    }
  }
}
```

### 3. Update Employee Skills
```http
PATCH /api/v1/employees/{employeeId}/skills
Content-Type: application/json
Authorization: Bearer <token>

{
  "competence": "Full Stack Development",
  "subCompetence": "Frontend",
  "skills": [
    {
      "name": "Vue.js",
      "verified": false,
      "source": "manual",
      "level": "beginner",
      "yearsExperience": 0
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updatedSkills": [
      {
        "name": "Vue.js",
        "verified": false,
        "source": "manual",
        "lastUpdated": "2024-12-19T10:30:00Z",
        "level": "beginner",
        "yearsExperience": 0
      }
    ]
  },
  "message": "Skills updated successfully"
}
```

### 4. Get Skills by Competence
```http
GET /api/v1/employees/{employeeId}/skills/competences
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "competences": [
      {
        "name": "Full Stack Development",
        "subCompetences": [
          {
            "name": "Frontend",
            "skills": [
              {
                "name": "React",
                "verified": true,
                "source": "github",
                "lastUpdated": "2024-12-19T10:00:00Z",
                "level": "intermediate",
                "yearsExperience": 2
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### 5. Profile Enrichment API
```http
POST /api/v1/employees/{employeeId}/enrich
Content-Type: application/json
Authorization: Bearer <token>

{
  "sources": ["linkedin", "github", "credly", "orcid", "gemini"],
  "force_refresh": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "emp_12347",
    "enrichmentStatus": "completed",
    "valueProposition": "Alice works as a Software Engineer with 2 years experience in TechCorp Solutions. Career goal: Become a Team Leader within one year. Skill gap: https://skills-engine.com/gap/emp_12347",
    "normalizedSkills": [
      {
        "original": "React.js",
        "normalized": "React",
        "category": "Frontend Frameworks",
        "level": "intermediate",
        "verified": true,
        "source": "github"
      },
      {
        "original": "NodeJS",
        "normalized": "Node.js",
        "category": "Backend Technologies",
        "level": "intermediate",
        "verified": true,
        "source": "github"
      }
    ],
    "relevanceScore": 87,
    "enrichmentData": {
      "linkedin": {
        "status": "completed",
        "lastUpdated": "2024-12-19T10:00:00Z",
        "dataPoints": ["headline", "summary", "experience", "skills"]
      },
      "github": {
        "status": "completed",
        "lastUpdated": "2024-12-19T10:00:00Z",
        "dataPoints": ["repositories", "languages", "contributions"]
      },
      "credly": {
        "status": "completed",
        "lastUpdated": "2024-12-19T10:00:00Z",
        "dataPoints": ["badges", "certifications"]
      },
      "gemini": {
        "status": "completed",
        "lastUpdated": "2024-12-19T10:00:00Z",
        "dataPoints": ["bio", "valueProposition"]
      }
    }
  },
  "message": "Employee enrichment completed successfully"
}
```

### 6. Skills Gap API
```http
GET /api/v1/employees/{employeeId}/skill-gap?careerGoal=Team Leader
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "employeeId": "emp_12347",
    "careerGoal": "Team Leader",
    "skillGaps": [
      {
        "skill": "Team Leadership",
        "requiredLevel": "intermediate",
        "currentLevel": "beginner",
        "gap": "medium",
        "recommendedCourses": [
          {
            "id": "course_12345",
            "title": "Leadership Fundamentals",
            "provider": "Internal Training",
            "estimatedDuration": 20,
            "skillLevel": "intermediate"
          },
          {
            "id": "course_12346",
            "title": "Team Management Best Practices",
            "provider": "External Provider",
            "estimatedDuration": 15,
            "skillLevel": "intermediate"
          }
        ]
      },
      {
        "skill": "Project Management",
        "requiredLevel": "intermediate",
        "currentLevel": "beginner",
        "gap": "medium",
        "recommendedCourses": [
          {
            "id": "course_12347",
            "title": "Agile Project Management",
            "provider": "Internal Training",
            "estimatedDuration": 25,
            "skillLevel": "intermediate"
          }
        ]
      }
    ],
    "overallGapScore": 65,
    "prioritySkills": ["Team Leadership", "Project Management", "Communication"]
  }
}
```

### 7. Relevance Score API
```http
GET /api/v1/employees/{employeeId}/relevance
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "employeeId": "emp_12347",
    "relevanceScore": 87,
    "scoreBreakdown": {
      "skillsMatch": 90,
      "experienceAlignment": 85,
      "enrichmentCompleteness": 85,
      "careerPathAlignment": 88
    },
    "factors": {
      "verifiedSkills": 8,
      "totalSkills": 10,
      "experienceYears": 2,
      "targetExperience": 3,
      "enrichedSources": 4,
      "totalSources": 5
    },
    "lastCalculated": "2024-12-19T10:30:00Z"
  }
}
```

## Trainer Profile API Endpoints

### 1. Create Trainer Profile
```http
POST /api/v1/companies/{companyId}/trainers
Content-Type: application/json
Authorization: Bearer <token>

{
  "employee_id": "emp_12347",
  "trainer_type": "internal",
  "teaching_mode": ["online", "offline", "blended"],
  "certifications": [
    {
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "issued_date": "2023-06-15",
      "expiry_date": "2026-06-15",
      "credential_id": "AWS-CSA-12345"
    },
    {
      "name": "Certified Scrum Master",
      "issuer": "Scrum Alliance",
      "issued_date": "2023-03-10",
      "expiry_date": "2025-03-10",
      "credential_id": "CSM-67890"
    }
  ],
  "languages": ["English", "Spanish"],
  "availability": {
    "timezone": "America/Los_Angeles",
    "schedule": {
      "monday": ["09:00-17:00"],
      "tuesday": ["09:00-17:00"],
      "wednesday": ["09:00-17:00"],
      "thursday": ["09:00-17:00"],
      "friday": ["09:00-17:00"]
    }
  },
  "pricing": {
    "hourly_rate": 150,
    "currency": "USD",
    "minimum_hours": 2
  },
  "ai_editing_enabled": true,
  "publish_permission": "internal",
  "specializations": [
    {
      "skill": "JavaScript",
      "level": "expert",
      "years_experience": 5
    },
    {
      "skill": "React",
      "level": "advanced",
      "years_experience": 4
    }
  ],
  "teaching_experience": 3,
  "preferred_teaching_methods": ["instructor_led", "workshop"],
  "max_courses_per_period": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trainer": {
      "id": "trainer_12345",
      "employee_id": "emp_12347",
      "trainer_type": "internal",
      "teaching_mode": ["online", "offline", "blended"],
      "ai_editing_enabled": true,
      "publish_permission": "internal",
      "status": "active",
      "is_available_for_teaching": true,
      "created_at": "2024-12-19T10:30:00Z"
    }
  },
  "message": "Trainer profile created successfully"
}
```

### 2. Get Trainer Profile (Enhanced)
```http
GET /api/v1/companies/{companyId}/trainers/{trainerId}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trainer": {
      "id": "trainer_12345",
      "employeeId": "emp_12347",
      "companyId": "company_12345",
      "employee": {
        "id": "emp_12347",
        "first_name": "Alice",
        "last_name": "Johnson",
        "email": "alice.johnson@techcorp.com",
        "title": "Senior Software Engineer"
      },
      "trainerType": "internal",
      "teachingMode": ["online", "offline", "blended"],
      "certifications": [
        {
          "name": "AWS Certified Solutions Architect",
          "issuer": "Amazon Web Services",
          "issuedDate": "2023-06-15",
          "expiryDate": "2026-06-15",
          "credentialId": "AWS-CSA-12345"
        },
        {
          "name": "Certified Scrum Master",
          "issuer": "Scrum Alliance",
          "issuedDate": "2023-03-10",
          "expiryDate": "2025-03-10",
          "credentialId": "CSM-67890"
        }
      ],
      "languages": ["English", "Spanish"],
      "availability": {
        "timezone": "America/Los_Angeles",
        "schedule": {
          "monday": ["09:00-17:00"],
          "tuesday": ["09:00-17:00"],
          "wednesday": ["09:00-17:00"],
          "thursday": ["09:00-17:00"],
          "friday": ["09:00-17:00"]
        }
      },
      "pricing": {
        "hourlyRate": 150,
        "currency": "USD",
        "minimumHours": 2
      },
      "aiEditingEnabled": true,
      "publishPermission": "internal",
      "averageRating": 4.8,
      "reviewCount": 24,
      "courseHistory": [
        {
          "courseId": "course_12345",
          "title": "JavaScript Fundamentals",
          "taughtAt": "2024-11-15",
          "studentCount": 15,
          "rating": 4.8,
          "skillCategories": ["JavaScript", "Programming Fundamentals"]
        },
        {
          "courseId": "course_12346",
          "title": "Advanced React Patterns",
          "taughtAt": "2024-10-20",
          "studentCount": 12,
          "rating": 4.9,
          "skillCategories": ["React", "Frontend Development"]
        }
      ],
      "teachingRequests": [
        {
          "id": "req_12345",
          "title": "Node.js Best Practices",
          "status": "approved",
          "requestedDate": "2024-12-20",
          "skillCategories": ["Node.js", "Backend Development"]
        }
      ],
      "verifiedTeachingSkills": ["JavaScript", "React", "Node.js"],
      "totalStudentsTaught": 45,
      "status": "active",
      "isAvailableForTeaching": true,
      "created_at": "2024-12-19T10:30:00Z",
      "updated_at": "2024-12-19T10:30:00Z"
    }
  }
}
```

### 3. Update Trainer Profile
```http
PUT /api/v1/companies/{companyId}/trainers/{trainerId}
Content-Type: application/json
Authorization: Bearer <token>

{
  "teaching_mode": ["online", "blended"],
  "pricing": {
    "hourly_rate": 175,
    "currency": "USD",
    "minimum_hours": 3
  },
  "availability": {
    "timezone": "America/Los_Angeles",
    "schedule": {
      "monday": ["10:00-18:00"],
      "tuesday": ["10:00-18:00"],
      "wednesday": ["10:00-18:00"],
      "thursday": ["10:00-18:00"],
      "friday": ["10:00-18:00"]
    }
  },
  "certifications": [
    {
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "issued_date": "2023-06-15",
      "expiry_date": "2026-06-15",
      "credential_id": "AWS-CSA-12345"
    },
    {
      "name": "Google Cloud Professional Developer",
      "issuer": "Google Cloud",
      "issued_date": "2024-01-20",
      "expiry_date": "2027-01-20",
      "credential_id": "GCP-PD-54321"
    }
  ]
}
```

### 4. Get Trainer Availability
```http
GET /api/v1/companies/{companyId}/trainers/{trainerId}/availability?startDate=2024-12-20&endDate=2024-12-27
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trainerId": "trainer_12345",
    "availability": {
      "timezone": "America/Los_Angeles",
      "schedule": {
        "2024-12-20": ["10:00-12:00", "14:00-16:00"],
        "2024-12-21": ["10:00-12:00", "14:00-16:00"],
        "2024-12-22": ["10:00-12:00"],
        "2024-12-23": ["10:00-12:00", "14:00-16:00"],
        "2024-12-24": [],
        "2024-12-25": [],
        "2024-12-26": ["10:00-12:00", "14:00-16:00"]
      }
    },
    "bookedSlots": [
      {
        "date": "2024-12-20",
        "time": "10:00-12:00",
        "courseId": "course_12345",
        "title": "JavaScript Fundamentals"
      }
    ]
  }
}
```

### 5. Search Trainers by Skills
```http
GET /api/v1/companies/{companyId}/trainers/search?skills=JavaScript,React&availability=2024-12-20&trainerType=internal&maxPrice=200
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trainers": [
      {
        "id": "trainer_12345",
        "employee": {
          "name": "Alice Johnson",
          "title": "Senior Software Engineer"
        },
        "trainerType": "internal",
        "teachingMode": ["online", "offline", "blended"],
        "skills": ["JavaScript", "React", "Node.js"],
        "averageRating": 4.8,
        "reviewCount": 24,
        "pricing": {
          "hourlyRate": 150,
          "currency": "USD"
        },
        "availability": {
          "nextAvailable": "2024-12-20T10:00:00Z"
        },
        "certifications": ["AWS Certified Solutions Architect", "Certified Scrum Master"]
      }
    ],
    "totalCount": 1,
    "filters": {
      "skills": ["JavaScript", "React"],
      "availability": "2024-12-20",
      "trainerType": "internal",
      "maxPrice": 200
    }
  }
}
```

## Training Request Endpoints

### 1. Create Training Request
```http
POST /api/v1/companies/{companyId}/training-requests
Content-Type: application/json
Authorization: Bearer <token>

{
  "employee_id": "emp_12347",
  "request_type": "skill_driven",
  "title": "Advanced TypeScript Development",
  "description": "Learn advanced TypeScript patterns and best practices",
  "priority": "high",
  "training_category": "Programming Languages",
  "required_skills": ["TypeScript", "JavaScript"],
  "target_skills": [
    {
      "skill": "TypeScript",
      "target_level": "advanced"
    }
  ],
  "estimated_duration": 40,
  "preferred_format": "instructor_led",
  "preferred_start_date": "2024-12-25",
  "justification": "Need to improve TypeScript skills for upcoming project"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "training_request": {
      "id": "req_12345",
      "employee_id": "emp_12347",
      "request_type": "skill_driven",
      "title": "Advanced TypeScript Development",
      "status": "pending",
      "priority": "high",
      "created_at": "2024-12-19T10:30:00Z"
    },
    "approval_workflow": {
      "next_approver": {
        "id": "emp_12345",
        "name": "Jane Doe",
        "role": "manager"
      },
      "estimated_approval_time": "2-3 business days"
    }
  },
  "message": "Training request created successfully"
}
```

### 2. Get Training Requests
```http
GET /api/v1/companies/{companyId}/training-requests?status=pending&employee_id=emp_12347
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "training_requests": [
      {
        "id": "req_12345",
        "employee": {
          "id": "emp_12347",
          "name": "Alice Johnson",
          "department": "Engineering",
          "team": "Frontend Team"
        },
        "request_type": "skill_driven",
        "title": "Advanced TypeScript Development",
        "status": "pending",
        "priority": "high",
        "created_at": "2024-12-19T10:30:00Z",
        "approval_workflow": {
          "current_step": "manager_approval",
          "next_approver": "Jane Doe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "total_pages": 1
    }
  }
}
```

### 3. Approve/Reject Training Request
```http
PUT /api/v1/companies/{companyId}/training-requests/{requestId}/approve
Content-Type: application/json
Authorization: Bearer <token>

{
  "action": "approve",
  "notes": "Approved for Q1 2024 training budget",
  "assigned_trainer_id": "trainer_12345",
  "start_date": "2024-12-25",
  "end_date": "2024-12-29"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "training_request": {
      "id": "req_12345",
      "status": "approved",
      "approved_by": "emp_12345",
      "approved_at": "2024-12-19T10:30:00Z",
      "assigned_trainer": {
        "id": "trainer_12345",
        "name": "Alice Johnson"
      },
      "scheduled_dates": {
        "start_date": "2024-12-25",
        "end_date": "2024-12-29"
      }
    }
  },
  "message": "Training request approved successfully"
}
```

## Search and Filtering Endpoints

### 1. Search Employees
```http
GET /api/v1/companies/{companyId}/employees/search?q=javascript&skills=React&department=Engineering&role=employee
Authorization: Bearer <token>
```

### 2. Search Trainers
```http
GET /api/v1/companies/{companyId}/trainers/search?skills=JavaScript&availability=2024-12-25&trainer_type=internal
Authorization: Bearer <token>
```

### 3. Get Company Hierarchy
```http
GET /api/v1/companies/{companyId}/hierarchy?include_employees=true&include_stats=true
Authorization: Bearer <token>
```

## Integration Endpoints

### 1. Trigger Employee Enrichment
```http
POST /api/v1/companies/{companyId}/employees/{employeeId}/enrich
Content-Type: application/json
Authorization: Bearer <token>

{
  "sources": ["linkedin", "github", "credly"],
  "force_refresh": true
}
```

### 2. Get Integration Status
```http
GET /api/v1/companies/{companyId}/integrations/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "external_apis": {
      "linkedin": {
        "status": "healthy",
        "last_sync": "2024-12-19T10:00:00Z",
        "use_mock": false
      },
      "github": {
        "status": "healthy",
        "last_sync": "2024-12-19T10:00:00Z",
        "use_mock": false
      }
    },
    "internal_services": {
      "auth": {
        "status": "healthy",
        "use_mock": false
      },
      "skills_engine": {
        "status": "healthy",
        "use_mock": false
      }
    }
  }
}
```

## Error Handling

### Common Error Codes
- `VALIDATION_ERROR` (400) - Invalid input data
- `UNAUTHORIZED` (401) - Authentication required
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Resource already exists
- `RATE_LIMITED` (429) - Too many requests
- `INTERNAL_ERROR` (500) - Server error
- `SERVICE_UNAVAILABLE` (503) - External service unavailable

### Error Response Example
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Email format is invalid"],
      "employee_id": ["Employee ID already exists"]
    }
  },
  "timestamp": "2024-12-19T10:30:00Z",
  "requestId": "req_12345"
}
```

## Authentication and Authorization

### JWT Token Structure
```json
{
  "sub": "user_12345",
  "company_id": "company_12345",
  "role": "hr_admin",
  "permissions": ["read:employees", "write:employees", "approve:training"],
  "iat": 1703001000,
  "exp": 1703087400
}
```

### Role-Based Access Control
- **HR Admin**: Full access to all company data
- **Manager**: Access to department/team data
- **Team Lead**: Access to team data
- **Employee**: Access to own profile and training requests
- **Trainer**: Additional access to training-related data

## Complete Endpoint Reference Tables

### Employee Profile Endpoints

| Method | Path | Description | Request Body | Response | Errors |
|--------|------|-------------|--------------|----------|--------|
| GET | `/api/v1/employees/{employeeId}/profile` | Get full employee profile with competences | - | EmployeeProfile | 404, 403 |
| PATCH | `/api/v1/employees/{employeeId}/skills` | Update or append skills/verification | SkillsUpdate | UpdatedSkills | 400, 404, 403 |
| GET | `/api/v1/employees/{employeeId}/skills/competences` | Get grouped skills by competence | - | Competences | 404, 403 |
| POST | `/api/v1/employees/{employeeId}/enrich` | Enrich profile from external APIs | EnrichmentRequest | EnrichmentResult | 400, 404, 503 |
| GET | `/api/v1/employees/{employeeId}/skill-gap` | Get skill gaps for career goal | - | SkillGaps | 404, 403 |
| GET | `/api/v1/employees/{employeeId}/relevance` | Get relevance score (0-100) | - | RelevanceScore | 404, 403 |

### Trainer Profile Endpoints

| Method | Path | Description | Request Body | Response | Errors |
|--------|------|-------------|--------------|----------|--------|
| POST | `/api/v1/companies/{companyId}/trainers` | Create trainer profile | TrainerProfile | Trainer | 400, 403 |
| GET | `/api/v1/companies/{companyId}/trainers/{trainerId}` | Get enhanced trainer profile | - | TrainerProfile | 404, 403 |
| PUT | `/api/v1/companies/{companyId}/trainers/{trainerId}` | Update trainer profile | TrainerUpdate | TrainerProfile | 400, 404, 403 |
| GET | `/api/v1/companies/{companyId}/trainers/{trainerId}/availability` | Get trainer availability | - | Availability | 404, 403 |
| GET | `/api/v1/companies/{companyId}/trainers/search` | Search trainers by criteria | - | TrainerSearchResults | 400, 403 |

### Company Management Endpoints

| Method | Path | Description | Request Body | Response | Errors |
|--------|------|-------------|--------------|----------|--------|
| POST | `/api/v1/companies` | Register new company | CompanyRegistration | Company | 400, 409 |
| GET | `/api/v1/companies/{companyId}` | Get company details | - | Company | 404, 403 |
| PUT | `/api/v1/companies/{companyId}` | Update company | CompanyUpdate | Company | 400, 404, 403 |
| GET | `/api/v1/companies/{companyId}/hierarchy` | Get company hierarchy | - | Hierarchy | 404, 403 |

### Training Request Endpoints

| Method | Path | Description | Request Body | Response | Errors |
|--------|------|-------------|--------------|----------|--------|
| POST | `/api/v1/companies/{companyId}/training-requests` | Create training request | TrainingRequest | TrainingRequest | 400, 403 |
| GET | `/api/v1/companies/{companyId}/training-requests` | Get training requests | - | TrainingRequests | 403 |
| PUT | `/api/v1/companies/{companyId}/training-requests/{requestId}/approve` | Approve/reject request | ApprovalAction | TrainingRequest | 400, 404, 403 |

### Integration Endpoints

| Method | Path | Description | Request Body | Response | Errors |
|--------|------|-------------|--------------|----------|--------|
| GET | `/api/v1/companies/{companyId}/integrations/status` | Get integration status | - | IntegrationStatus | 403 |
| POST | `/api/v1/companies/{companyId}/employees/{employeeId}/enrich` | Trigger enrichment | EnrichmentRequest | EnrichmentJob | 400, 404, 503 |

## Mock Data Sources

### Employee Mock Data
- **File**: `/database/mocks/employees/mock-employees.json`
- **Contains**: Complete employee profiles with competences, skills, and external profiles
- **Structure**: Matches EmployeeProfile schema with realistic data

### Trainer Mock Data
- **File**: `/database/mocks/trainers/mock-trainers.json`
- **Contains**: Enhanced trainer profiles with certifications, pricing, and course history
- **Structure**: Matches TrainerProfile schema with realistic teaching data

### External API Mock Data
- **LinkedIn**: `/database/mocks/external-apis/linkedin/mock-linkedin-profile.json`
- **GitHub**: `/database/mocks/external-apis/github/mock-github-profile.json`
- **Credly**: `/database/mocks/external-apis/credly/mock-credly-badges.json`
- **Gemini**: `/database/mocks/external-apis/gemini/mock-gemini-bio-generation.json`
- **ORCID**: `/database/mocks/external-apis/orcid/mock-orcid-profile.json`
- **Crossref**: `/database/mocks/external-apis/crossref/mock-crossref-research.json`
- **YouTube**: `/database/mocks/external-apis/youtube/mock-youtube-channel.json`

### Internal Service Mock Data
- **Auth Service**: `/database/mocks/internal-services/auth/mock-auth-verification.json`
- **Skills Engine**: `/database/mocks/internal-services/skills-engine/mock-skills-normalization.json`
- **Marketplace**: `/database/mocks/internal-services/marketplace/mock-trainer-matching.json`
- **Content Studio**: `/database/mocks/internal-services/content-studio/mock-content-creation.json`
- **Course Builder**: `/database/mocks/internal-services/course-builder/mock-learning-feedback.json`
- **DevLab**: `/database/mocks/internal-services/devlab/mock-exercise-provisioning.json`
- **Analytics**: `/database/mocks/internal-services/analytics/mock-learning-analytics.json`
- **CCA**: `/database/mocks/internal-services/cca/mock-rag-data-provision.json`
- **Assessment**: `/database/mocks/internal-services/assessment/mock-assessment-configuration.json`
- **SendPulse**: `/database/mocks/internal-services/sendpulse/mock-in-app-notifications.json`
- **SendGrid**: `/database/mocks/internal-services/sendgrid/mock-email-templates.json`

## OpenAPI/Swagger Tags

### API Tags for Documentation
- `#/tags/0` - **Employee Profiles** - Employee profile management and enrichment
- `#/tags/1` - **Trainer Profiles** - Trainer profile management and search
- `#/tags/2` - **Company Management** - Company registration and hierarchy
- `#/tags/3` - **Training Requests** - Training request workflows
- `#/tags/4` - **Skills & Competences** - Skills management and gap analysis
- `#/tags/5` - **Profile Enrichment** - External API integration and enrichment
- `#/tags/6` - **Integrations** - Internal and external service integrations
- `#/tags/7` - **Search & Filtering** - Search and filtering capabilities
- `#/tags/8` - **Analytics & Reporting** - Analytics and reporting endpoints

### Operation Tags
- `employee-profiles` - All employee profile operations
- `trainer-profiles` - All trainer profile operations
- `company-management` - All company management operations
- `training-requests` - All training request operations
- `skills-management` - All skills and competences operations
- `profile-enrichment` - All enrichment operations
- `integrations` - All integration operations
- `search` - All search and filtering operations

## Error Response Examples

### Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Email format is invalid"],
      "employee_id": ["Employee ID already exists"],
      "skills": ["At least one skill is required"]
    }
  },
  "timestamp": "2024-12-19T10:30:00Z",
  "requestId": "req_12345"
}
```

### Service Unavailable Error
```json
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "External service temporarily unavailable",
    "details": {
      "service": "linkedin",
      "fallback": "mock_data_used",
      "retry_after": 300
    }
  },
  "timestamp": "2024-12-19T10:30:00Z",
  "requestId": "req_12345"
}
```

### Permission Denied Error
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions",
    "details": {
      "required_permission": "write:employees",
      "user_role": "employee",
      "resource": "employee_profile"
    }
  },
  "timestamp": "2024-12-19T10:30:00Z",
  "requestId": "req_12345"
}
```

This comprehensive API design provides all necessary endpoints for the Directory microservice with proper error handling, validation, role-based access control, and complete mock data integration.
