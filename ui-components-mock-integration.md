# UI Components Mock Integration

## Mock Endpoint Connections

### Employee Profile Components with Mock Data

```jsx
// Employee Profile Card with Mock Enrichment
const EmployeeProfileCard = ({ employee }) => {
  const [enrichmentData, setEnrichmentData] = useState(null);
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock enrichment endpoint connection
  const fetchEnrichmentData = async (employeeId) => {
    setLoading(true);
    try {
      const response = await fetch(`/mock/enrichment/employees/${employeeId}/enrich`);
      const data = await response.json();
      setEnrichmentData(data);
    } catch (error) {
      console.error('Enrichment fetch failed:', error);
      // Fallback to local mock data
      setEnrichmentData(require('/database/mocks/external-apis/gemini/mock-gemini-bio-generation.json'));
    }
    setLoading(false);
  };

  // Mock skills endpoint connection
  const fetchSkillsData = async (employeeId) => {
    try {
      const response = await fetch(`/mock/skills/employees/${employeeId}/competences`);
      const data = await response.json();
      setSkillsData(data);
    } catch (error) {
      console.error('Skills fetch failed:', error);
      // Fallback to local mock data
      setSkillsData(require('/database/mocks/employees/mock-employees.json'));
    }
  };

  useEffect(() => {
    fetchEnrichmentData(employee.id);
    fetchSkillsData(employee.id);
  }, [employee.id]);

  return (
    <div className="employee-card">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar-section">
          <Avatar size="xl" src={employee.avatar} />
          <div className="status-indicator">
            <div className={`status-dot ${employee.status}`}></div>
          </div>
        </div>
        
        <div className="profile-info">
          <h3 className="employee-name">{employee.name}</h3>
          <p className="employee-title">{employee.title}</p>
          <div className="employee-meta">
            <span className="department">{employee.department}</span>
            <span className="team">{employee.team}</span>
            <span className="experience">{employee.experienceYears} years</span>
          </div>
        </div>
        
        <div className="profile-actions">
          <button 
            className="btn-primary"
            onClick={() => fetchEnrichmentData(employee.id)}
            disabled={loading}
          >
            {loading ? 'Enriching...' : 'Enrich Profile'}
          </button>
          <button className="btn-secondary">Edit</button>
        </div>
      </div>

      {/* Enrichment Status */}
      {enrichmentData && (
        <div className="enrichment-status">
          <div className="enrichment-indicators">
            {enrichmentData.sources?.map(source => (
              <div key={source} className={`enrichment-badge ${source}`}>
                <span className="source-name">{source}</span>
                <CheckIcon className="w-4 h-4" />
              </div>
            ))}
          </div>
          <p className="enrichment-text">{enrichmentData.valueProposition}</p>
        </div>
      )}

      {/* Relevance Score Circle */}
      <div className="relevance-section">
        <div className="relevance-circle">
          <CircularProgress 
            value={employee.relevanceScore} 
            size={80}
            strokeWidth={6}
            color="var(--primary-cyan)"
          />
          <div className="relevance-text">
            <span className="relevance-score">{employee.relevanceScore}</span>
            <span className="relevance-label">Relevance</span>
          </div>
        </div>
        
        <div className="career-goal">
          <h4>Career Goal</h4>
          <p>{employee.careerGoal}</p>
        </div>
      </div>

      {/* Skills Section with Mock Data */}
      <div className="skills-section">
        <h4>Key Skills</h4>
        {skillsData ? (
          <div className="skills-grid">
            {skillsData.competences?.map(competence => (
              <div key={competence.name} className="competence-group">
                <h5 className="competence-name">{competence.name}</h5>
                <div className="skills-list">
                  {competence.subCompetences?.map(subComp => (
                    <div key={subComp.name} className="sub-competence">
                      <h6 className="sub-competence-name">{subComp.name}</h6>
                      <div className="skills-grid">
                        {subComp.skills?.map(skill => (
                          <div key={skill.name} className="skill-badge">
                            <span className="skill-name">{skill.name}</span>
                            {skill.verified && <CheckIcon className="w-4 h-4 text-green-500" />}
                            <span className="skill-level">{skill.level}</span>
                            <span className="skill-source">{skill.source}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="loading-skeleton">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        )}
      </div>

      {/* Value Proposition from Mock Enrichment */}
      {enrichmentData?.valueProposition && (
        <div className="value-proposition">
          <h4>AI-Generated Value Proposition</h4>
          <p className="value-text">{enrichmentData.valueProposition}</p>
        </div>
      )}
    </div>
  );
};
```

### Skills Management Component with Mock Endpoints

```jsx
// Skills Management Component
const SkillsManagement = ({ employeeId }) => {
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch skills from mock endpoint
  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/mock/skills/employees/${employeeId}/competences`);
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }
      const data = await response.json();
      setCompetences(data.competences || []);
    } catch (err) {
      setError(err.message);
      // Fallback to local mock data
      const mockData = require('/database/mocks/employees/mock-employees.json');
      setCompetences(mockData.employees[0].competences || []);
    }
    setLoading(false);
  };

  // Update skills via mock endpoint
  const updateSkills = async (competence, subCompetence, newSkills) => {
    try {
      const response = await fetch(`/mock/skills/employees/${employeeId}/skills`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          competence,
          subCompetence,
          skills: newSkills
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update skills');
      }
      
      const data = await response.json();
      // Update local state
      setCompetences(prev => 
        prev.map(comp => 
          comp.name === competence 
            ? {
                ...comp,
                subCompetences: comp.subCompetences.map(sub => 
                  sub.name === subCompetence 
                    ? { ...sub, skills: [...sub.skills, ...newSkills] }
                    : sub
                )
              }
            : comp
        )
      );
    } catch (err) {
      console.error('Skills update failed:', err);
      // Still update local state for UI feedback
      setCompetences(prev => 
        prev.map(comp => 
          comp.name === competence 
            ? {
                ...comp,
                subCompetences: comp.subCompetences.map(sub => 
                  sub.name === subCompetence 
                    ? { ...sub, skills: [...sub.skills, ...newSkills] }
                    : sub
                )
              }
            : comp
        )
      );
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [employeeId]);

  if (loading) {
    return (
      <div className="skills-loading">
        <div className="loading-skeleton">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="skills-error">
        <div className="error-message">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
          <p>Failed to load skills: {error}</p>
          <button className="btn-primary" onClick={fetchSkills}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="skills-management">
      <div className="skills-header">
        <h3>Skills & Competences</h3>
        <button className="btn-primary" onClick={fetchSkills}>
          Refresh Skills
        </button>
      </div>

      <div className="competences-grid">
        {competences.map(competence => (
          <CompetenceCard 
            key={competence.name} 
            competence={competence}
            onUpdateSkills={(subCompetence, skills) => 
              updateSkills(competence.name, subCompetence, skills)
            }
          />
        ))}
      </div>
    </div>
  );
};
```

### Enrichment Status Component

```jsx
// Enrichment Status Component
const EnrichmentStatus = ({ employeeId }) => {
  const [enrichmentStatus, setEnrichmentStatus] = useState(null);
  const [isEnriching, setIsEnriching] = useState(false);

  // Trigger enrichment via mock endpoint
  const triggerEnrichment = async () => {
    setIsEnriching(true);
    try {
      const response = await fetch(`/mock/enrichment/employees/${employeeId}/enrich`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sources: ['linkedin', 'github', 'credly', 'orcid', 'gemini'],
          force_refresh: false
        })
      });

      if (!response.ok) {
        throw new Error('Enrichment failed');
      }

      const data = await response.json();
      setEnrichmentStatus(data);
    } catch (error) {
      console.error('Enrichment error:', error);
      // Fallback to mock data
      setEnrichmentStatus({
        id: employeeId,
        enrichmentStatus: 'completed',
        valueProposition: 'Mock value proposition from Gemini API',
        normalizedSkills: [],
        relevanceScore: 85,
        enrichmentData: {
          linkedin: { status: 'completed', lastUpdated: new Date().toISOString() },
          github: { status: 'completed', lastUpdated: new Date().toISOString() },
          credly: { status: 'completed', lastUpdated: new Date().toISOString() },
          gemini: { status: 'completed', lastUpdated: new Date().toISOString() }
        }
      });
    }
    setIsEnriching(false);
  };

  return (
    <div className="enrichment-status-card">
      <div className="enrichment-header">
        <h4>Profile Enrichment</h4>
        <button 
          className="btn-primary"
          onClick={triggerEnrichment}
          disabled={isEnriching}
        >
          {isEnriching ? 'Enriching...' : 'Enrich Profile'}
        </button>
      </div>

      {enrichmentStatus && (
        <div className="enrichment-details">
          <div className="enrichment-sources">
            {Object.entries(enrichmentStatus.enrichmentData || {}).map(([source, data]) => (
              <div key={source} className={`source-status ${data.status}`}>
                <div className="source-icon">
                  {data.status === 'completed' ? (
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <ClockIcon className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <div className="source-info">
                  <span className="source-name">{source}</span>
                  <span className="source-date">
                    {new Date(data.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="enrichment-results">
            <div className="relevance-score">
              <CircularProgress 
                value={enrichmentStatus.relevanceScore} 
                size={60}
                strokeWidth={4}
              />
              <span className="score-label">Relevance Score</span>
            </div>
            
            <div className="value-proposition">
              <h5>AI-Generated Value Proposition</h5>
              <p>{enrichmentStatus.valueProposition}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

### Mock Endpoint Configuration

```javascript
// Mock API Configuration
const MOCK_API_CONFIG = {
  baseUrl: '/mock',
  endpoints: {
    enrichment: {
      base: '/mock/enrichment',
      enrich: (employeeId) => `/mock/enrichment/employees/${employeeId}/enrich`,
      status: (employeeId) => `/mock/enrichment/employees/${employeeId}/status`
    },
    skills: {
      base: '/mock/skills',
      competences: (employeeId) => `/mock/skills/employees/${employeeId}/competences`,
      update: (employeeId) => `/mock/skills/employees/${employeeId}/skills`,
      gap: (employeeId) => `/mock/skills/employees/${employeeId}/skill-gap`,
      relevance: (employeeId) => `/mock/skills/employees/${employeeId}/relevance`
    }
  },
  fallbackData: {
    enrichment: '/database/mocks/external-apis/gemini/mock-gemini-bio-generation.json',
    skills: '/database/mocks/employees/mock-employees.json',
    competences: '/database/mocks/skills/mock-competences.json'
  }
};

// Mock API Service
class MockAPIService {
  static async fetch(endpoint, options = {}) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`Mock API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  static async getEnrichmentData(employeeId) {
    try {
      return await this.fetch(MOCK_API_CONFIG.endpoints.enrichment.enrich(employeeId));
    } catch (error) {
      // Fallback to local mock data
      return require(MOCK_API_CONFIG.fallbackData.enrichment);
    }
  }

  static async getSkillsData(employeeId) {
    try {
      return await this.fetch(MOCK_API_CONFIG.endpoints.skills.competences(employeeId));
    } catch (error) {
      // Fallback to local mock data
      return require(MOCK_API_CONFIG.fallbackData.skills);
    }
  }

  static async updateSkills(employeeId, skillsData) {
    try {
      return await this.fetch(MOCK_API_CONFIG.endpoints.skills.update(employeeId), {
        method: 'PATCH',
        body: JSON.stringify(skillsData)
      });
    } catch (error) {
      console.error('Skills update failed:', error);
      throw error;
    }
  }
}
```

## CSS for Mock Integration Components

```css
/* Enrichment Status Styles */
.enrichment-status-card {
  background: var(--gradient-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.enrichment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.enrichment-sources {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.source-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.source-status.completed {
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.05);
}

.source-name {
  font-weight: 600;
  text-transform: capitalize;
  color: var(--text-primary);
}

.source-date {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.enrichment-results {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.relevance-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.score-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.value-proposition {
  flex: 1;
}

.value-proposition h5 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
}

.value-proposition p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Skills Management Styles */
.skills-management {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.skills-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.competences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.competence-group {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.competence-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.sub-competence {
  margin-bottom: 1rem;
}

.sub-competence-name {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.5rem;
}

.skill-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.875rem;
}

.skill-name {
  font-weight: 500;
  color: var(--text-primary);
}

.skill-level {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: capitalize;
}

.skill-source {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: capitalize;
}

/* Loading States */
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-line {
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-card {
  height: 4rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Error States */
.skills-error {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  color: var(--text-secondary);
}

.error-message p {
  margin: 0;
}
```

This integration ensures that all UI components properly connect to the mock endpoints under `/mock/enrichment` and `/mock/skills`, with proper fallback mechanisms to local mock data files when the endpoints are unavailable.
