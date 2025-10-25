// Deployment Monitor Script
import fetch from 'node-fetch';

const DEPLOYMENT_URLS = {
  frontend: 'https://directory-microservice-frontend.vercel.app',
  backend: 'https://directory-microservice-backend.railway.app',
  database: 'https://directory-microservice.supabase.co'
};

async function checkDeploymentStatus() {
  console.log('🚀 Monitoring Deployment Status...\n');
  
  const results = {
    frontend: { status: 'pending', url: DEPLOYMENT_URLS.frontend },
    backend: { status: 'pending', url: DEPLOYMENT_URLS.backend },
    database: { status: 'pending', url: DEPLOYMENT_URLS.database }
  };

  // Check Frontend (Vercel)
  try {
    console.log('🔍 Checking Frontend (Vercel)...');
    const frontendResponse = await fetch(DEPLOYMENT_URLS.frontend, { 
      method: 'HEAD',
      timeout: 10000 
    });
    results.frontend.status = frontendResponse.ok ? 'deployed' : 'error';
    console.log(`✅ Frontend: ${results.frontend.status.toUpperCase()}`);
  } catch (error) {
    results.frontend.status = 'pending';
    console.log(`⏳ Frontend: ${error.message}`);
  }

  // Check Backend (Railway)
  try {
    console.log('🔍 Checking Backend (Railway)...');
    const backendResponse = await fetch(`${DEPLOYMENT_URLS.backend}/health`, { 
      method: 'GET',
      timeout: 10000 
    });
    results.backend.status = backendResponse.ok ? 'deployed' : 'error';
    console.log(`✅ Backend: ${results.backend.status.toUpperCase()}`);
  } catch (error) {
    results.backend.status = 'pending';
    console.log(`⏳ Backend: ${error.message}`);
  }

  // Check Database (Supabase)
  try {
    console.log('🔍 Checking Database (Supabase)...');
    const dbResponse = await fetch(`${DEPLOYMENT_URLS.database}/rest/v1/`, { 
      method: 'HEAD',
      timeout: 10000 
    });
    results.database.status = dbResponse.ok ? 'deployed' : 'error';
    console.log(`✅ Database: ${results.database.status.toUpperCase()}`);
  } catch (error) {
    results.database.status = 'pending';
    console.log(`⏳ Database: ${error.message}`);
  }

  return results;
}

async function runIntegrationTests() {
  console.log('\n🧪 Running Integration Tests...\n');
  
  const tests = [
    {
      name: 'Backend Health Check',
      url: `${DEPLOYMENT_URLS.backend}/health`,
      expected: { status: 'ok' }
    },
    {
      name: 'Mock Companies API',
      url: `${DEPLOYMENT_URLS.backend}/api/mock/companies`,
      expected: { success: true, source: 'mock' }
    },
    {
      name: 'Mock Employees API',
      url: `${DEPLOYMENT_URLS.backend}/api/mock/employees`,
      expected: { success: true, source: 'mock' }
    },
    {
      name: 'Frontend Homepage',
      url: DEPLOYMENT_URLS.frontend,
      expected: { status: 200 }
    }
  ];

  const testResults = [];

  for (const test of tests) {
    try {
      console.log(`🔍 Testing: ${test.name}`);
      const response = await fetch(test.url, { timeout: 15000 });
      
      if (test.url.includes('/api/')) {
        const data = await response.json();
        const passed = data.success === test.expected.success && data.source === test.expected.source;
        testResults.push({ name: test.name, status: passed ? 'PASS' : 'FAIL', details: data });
        console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASS' : 'FAIL'}`);
      } else {
        const passed = response.ok;
        testResults.push({ name: test.name, status: passed ? 'PASS' : 'FAIL', details: { status: response.status } });
        console.log(`${passed ? '✅' : '❌'} ${test.name}: ${passed ? 'PASS' : 'FAIL'}`);
      }
    } catch (error) {
      testResults.push({ name: test.name, status: 'ERROR', details: { error: error.message } });
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
    }
  }

  return testResults;
}

async function generateDeploymentReport() {
  console.log('\n📊 Generating Deployment Report...\n');
  
  const deploymentStatus = await checkDeploymentStatus();
  const testResults = await runIntegrationTests();
  
  const report = {
    timestamp: new Date().toISOString(),
    deployment: deploymentStatus,
    tests: testResults,
    summary: {
      totalTests: testResults.length,
      passedTests: testResults.filter(t => t.status === 'PASS').length,
      failedTests: testResults.filter(t => t.status === 'FAIL').length,
      errorTests: testResults.filter(t => t.status === 'ERROR').length
    }
  };

  console.log('\n📋 DEPLOYMENT REPORT');
  console.log('==================');
  console.log(`Timestamp: ${report.timestamp}`);
  console.log('\n🚀 Deployment Status:');
  Object.entries(report.deployment).forEach(([service, status]) => {
    console.log(`  ${service}: ${status.status.toUpperCase()} - ${status.url}`);
  });
  
  console.log('\n🧪 Test Results:');
  report.tests.forEach(test => {
    console.log(`  ${test.name}: ${test.status}`);
  });
  
  console.log('\n📊 Summary:');
  console.log(`  Total Tests: ${report.summary.totalTests}`);
  console.log(`  Passed: ${report.summary.passedTests}`);
  console.log(`  Failed: ${report.summary.failedTests}`);
  console.log(`  Errors: ${report.summary.errorTests}`);
  
  const success = report.summary.passedTests === report.summary.totalTests && 
                  Object.values(report.deployment).every(s => s.status === 'deployed');
  
  console.log(`\n🎯 Overall Status: ${success ? '✅ SUCCESS' : '❌ ISSUES DETECTED'}`);
  
  return report;
}

// Run the deployment monitor
generateDeploymentReport().catch(console.error);
