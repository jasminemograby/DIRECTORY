import express from 'express';
import { MockDataService } from '../../../infrastructure/mock/MockDataService.js';

const router = express.Router();
const mockDataService = new MockDataService();

// Mock data endpoints for testing and development
router.get('/companies', async (req, res) => {
  try {
    const companies = await mockDataService.getCompanies();
    res.json({
      success: true,
      data: companies,
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

router.get('/employees', async (req, res) => {
  try {
    const employees = await mockDataService.getEmployees();
    res.json({
      success: true,
      data: employees,
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

router.get('/trainers', async (req, res) => {
  try {
    const trainers = await mockDataService.getTrainers();
    res.json({
      success: true,
      data: trainers,
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

router.get('/training-requests', async (req, res) => {
  try {
    const trainingRequests = await mockDataService.getTrainingRequests();
    res.json({
      success: true,
      data: trainingRequests,
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
router.get('/enrichment/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const enrichment = await mockDataService.getEmployeeEnrichment(employeeId);
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
router.get('/skills/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const skills = await mockDataService.getEmployeeSkills(employeeId);
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

// Mock skill gap analysis
router.get('/skill-gap/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const skillGap = await mockDataService.getEmployeeSkillGap(employeeId);
    res.json({
      success: true,
      data: skillGap,
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mock skill gap data',
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  }
});

// Mock relevance score
router.get('/relevance/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const relevance = await mockDataService.getEmployeeRelevance(employeeId);
    res.json({
      success: true,
      data: relevance,
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mock relevance data',
      source: 'mock',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
