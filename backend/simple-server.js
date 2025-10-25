import express from 'express';
import cors from 'cors';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    useMock: process.env.USE_MOCK || 'true'
  });
});

// Mock data endpoints
app.get('/api/mock/companies', async (req, res) => {
  try {
    const data = await readFile(path.join(__dirname, '../database/mocks/mock-companies.json'), 'utf8');
    const companies = JSON.parse(data);
    res.json({
      success: true,
      data: companies.companies,
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mock companies',
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/mock/employees', async (req, res) => {
  try {
    const data = await readFile(path.join(__dirname, '../database/mocks/mock-employees.json'), 'utf8');
    const employees = JSON.parse(data);
    res.json({
      success: true,
      data: employees.employees,
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mock employees',
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/mock/trainers', async (req, res) => {
  try {
    const data = await readFile(path.join(__dirname, '../database/mocks/mock-trainers.json'), 'utf8');
    const trainers = JSON.parse(data);
    res.json({
      success: true,
      data: trainers.trainers,
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mock trainers',
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/mock/training-requests', async (req, res) => {
  try {
    const data = await readFile(path.join(__dirname, '../database/mocks/mock-training-requests.json'), 'utf8');
    const requests = JSON.parse(data);
    res.json({
      success: true,
      data: requests.requests,
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mock training requests',
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  }
});

// Mock enrichment endpoints
app.get('/api/mock/enrichment/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const enrichment = {
      employeeId,
      enrichmentData: {
        skills: [
          { name: 'JavaScript', level: 'advanced', source: 'github', verified: true },
          { name: 'React', level: 'intermediate', source: 'github', verified: true },
          { name: 'Leadership', level: 'intermediate', source: 'linkedin', verified: true },
          { name: 'AWS Certified', level: 'expert', source: 'credly', verified: true }
        ],
        valueProposition: 'Experienced professional with strong technical and leadership skills',
        sources: ['linkedin', 'github', 'credly', 'gemini']
      },
      normalizedSkills: [
        { name: 'JavaScript', level: 'advanced', source: 'github', verified: true, normalized: true, category: 'Programming' },
        { name: 'React', level: 'intermediate', source: 'github', verified: true, normalized: true, category: 'Frontend' },
        { name: 'Leadership', level: 'intermediate', source: 'linkedin', verified: true, normalized: true, category: 'Soft Skills' },
        { name: 'AWS Certified', level: 'expert', source: 'credly', verified: true, normalized: true, category: 'Cloud' }
      ],
      lastEnriched: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: enrichment,
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mock enrichment data',
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  }
});

// Mock skills endpoints
app.get('/api/mock/skills/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const skills = {
      employeeId,
      skills: [
        { name: 'JavaScript', level: 'advanced', category: 'Programming', verified: true },
        { name: 'React', level: 'intermediate', category: 'Frontend', verified: true },
        { name: 'Leadership', level: 'intermediate', category: 'Soft Skills', verified: true },
        { name: 'AWS Certified', level: 'expert', category: 'Cloud', verified: true }
      ],
      competences: [
        {
          name: 'Frontend Development',
          skills: ['JavaScript', 'React'],
          level: 'intermediate',
          description: 'Frontend web development skills'
        },
        {
          name: 'Cloud Computing',
          skills: ['AWS Certified'],
          level: 'expert',
          description: 'Cloud infrastructure and services'
        }
      ],
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: skills,
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mock skills data',
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Mock endpoints: http://localhost:${PORT}/api/mock/*`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎭 Mock mode: ${process.env.USE_MOCK || 'true'}`);
});
