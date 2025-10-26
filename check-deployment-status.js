// Check Deployment Status and Live URLs
import fetch from 'node-fetch';

const DEPLOYMENT_URLS = {
  frontend: 'https://directory-microservice-frontend.vercel.app',
  backend: 'https://directory-microservice-backend.railway.app',
  database: 'https://directory-microservice.supabase.co'
};

const API_ENDPOINTS = {
  health: '/health',
  mockCompanies: '/api/mock/companies',
  mockEmployees: '/api/mock/employees',
  mockTrainers: '/api/mock/trainers',
  mockTrainingRequests: '/api/mock/training-requests'
};

async function checkServiceHealth(serviceName, baseUrl) {
  try {
    console.log(`🔍 Checking ${serviceName}...`);
    
    // Check if the service is accessible
    const response = await fetch(baseUrl, { 
      method: 'HEAD',
      timeout: 10000,
      headers: {
        'User-Agent': 'Directory-Microservice-Deployment-Checker'
      }
    });
    
    if (response.ok) {
      console.log(`✅ ${serviceName}: ONLINE (${response.status})`);
      return { status: 'online', url: baseUrl, response: response.status };
    } else {
      console.log(`⚠️ ${serviceName}: RESPONDING (${response.status})`);
      return { status: 'responding', url: baseUrl, response: response.status };
    }
  } catch (error) {
    console.log(`❌ ${serviceName}: OFFLINE (${error.message})`);
    return { status: 'offline', url: baseUrl, error: error.message };
  }
}

async function checkBackendAPIs() {
  console.log('\n🧪 Testing Backend API Endpoints...');
  
  const results = {};
  
  // Test health endpoint
  try {
    const healthResponse = await fetch(`${DEPLOYMENT_URLS.backend}${API_ENDPOINTS.health}`, {
      timeout: 10000
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      results.health = { status: 'ok', data: healthData };
      console.log(`✅ Health Check: ${healthData.status || 'OK'}`);
    } else {
      results.health = { status: 'error', code: healthResponse.status };
      console.log(`❌ Health Check: HTTP ${healthResponse.status}`);
    }
  } catch (error) {
    results.health = { status: 'error', message: error.message };
    console.log(`❌ Health Check: ${error.message}`);
  }
  
  // Test mock data endpoints
  for (const [endpointName, endpointPath] of Object.entries(API_ENDPOINTS)) {
    if (endpointName === 'health') continue;
    
    try {
      const response = await fetch(`${DEPLOYMENT_URLS.backend}${endpointPath}`, {
        timeout: 10000
      });
      
      if (response.ok) {
        const data = await response.json();
        const hasData = data.success && data.data && data.data.length > 0;
        results[endpointName] = { 
          status: 'ok', 
          hasData,
          source: data.source,
          count: data.data ? data.data.length : 0
        };
        console.log(`✅ ${endpointName}: ${hasData ? 'DATA AVAILABLE' : 'NO DATA'} (${data.source || 'unknown'})`);
      } else {
        results[endpointName] = { status: 'error', code: response.status };
        console.log(`❌ ${endpointName}: HTTP ${response.status}`);
      }
    } catch (error) {
      results[endpointName] = { status: 'error', message: error.message };
      console.log(`❌ ${endpointName}: ${error.message}`);
    }
  }
  
  return results;
}

async function checkFrontendApplication() {
  console.log('\n🌐 Testing Frontend Application...');
  
  try {
    const response = await fetch(DEPLOYMENT_URLS.frontend, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Directory-Microservice-Deployment-Checker'
      }
    });
    
    if (response.ok) {
      const html = await response.text();
      const hasReact = html.includes('react') || html.includes('React');
      const hasTailwind = html.includes('tailwind') || html.includes('bg-emerald');
      const hasApp = html.includes('Directory') || html.includes('directory');
      
      console.log(`✅ Frontend: LOADING (${response.status})`);
      console.log(`   React: ${hasReact ? '✅' : '❌'}`);
      console.log(`   Tailwind: ${hasTailwind ? '✅' : '❌'}`);
      console.log(`   App Content: ${hasApp ? '✅' : '❌'}`);
      
      return {
        status: 'online',
        react: hasReact,
        tailwind: hasTailwind,
        appContent: hasApp,
        response: response.status
      };
    } else {
      console.log(`⚠️ Frontend: RESPONDING (${response.status})`);
      return { status: 'responding', response: response.status };
    }
  } catch (error) {
    console.log(`❌ Frontend: OFFLINE (${error.message})`);
    return { status: 'offline', error: error.message };
  }
}

async function checkDatabaseConnection() {
  console.log('\n🗄️ Testing Database Connection...');
  
  try {
    // Test Supabase REST API
    const response = await fetch(`${DEPLOYMENT_URLS.database}/rest/v1/`, {
      method: 'HEAD',
      timeout: 10000,
      headers: {
        'apikey': 'test', // This will likely fail but we can check if the service is up
        'Authorization': 'Bearer test'
      }
    });
    
    if (response.status === 200 || response.status === 401) {
      console.log(`✅ Database: ACCESSIBLE (${response.status})`);
      return { status: 'accessible', response: response.status };
    } else {
      console.log(`⚠️ Database: RESPONDING (${response.status})`);
      return { status: 'responding', response: response.status };
    }
  } catch (error) {
    console.log(`❌ Database: OFFLINE (${error.message})`);
    return { status: 'offline', error: error.message };
  }
}

async function generateDeploymentReport() {
  console.log('🚀 DIRECTORY MICROSERVICE - DEPLOYMENT STATUS CHECK');
  console.log('==================================================\n');
  
  console.log('📋 Checking Live Deployment Status...\n');
  
  // Check all services
  const serviceStatus = {};
  for (const [serviceName, url] of Object.entries(DEPLOYMENT_URLS)) {
    serviceStatus[serviceName] = await checkServiceHealth(serviceName, url);
  }
  
  // Check backend APIs
  const apiStatus = await checkBackendAPIs();
  
  // Check frontend application
  const frontendStatus = await checkFrontendApplication();
  
  // Check database
  const databaseStatus = await checkDatabaseConnection();
  
  // Generate summary
  console.log('\n📊 DEPLOYMENT STATUS SUMMARY');
  console.log('============================');
  
  const allServicesOnline = Object.values(serviceStatus).every(s => s.status === 'online' || s.status === 'responding');
  const backendAPIsWorking = Object.values(apiStatus).every(a => a.status === 'ok');
  const frontendWorking = frontendStatus.status === 'online';
  const databaseWorking = databaseStatus.status === 'accessible' || databaseStatus.status === 'responding';
  
  console.log(`🌐 Services: ${allServicesOnline ? '✅ ALL ONLINE' : '⚠️ SOME ISSUES'}`);
  console.log(`🔌 Backend APIs: ${backendAPIsWorking ? '✅ ALL WORKING' : '⚠️ SOME ISSUES'}`);
  console.log(`🎨 Frontend: ${frontendWorking ? '✅ WORKING' : '⚠️ ISSUES'}`);
  console.log(`🗄️ Database: ${databaseWorking ? '✅ ACCESSIBLE' : '⚠️ ISSUES'}`);
  
  const overallStatus = allServicesOnline && backendAPIsWorking && frontendWorking && databaseWorking;
  
  console.log(`\n🎯 OVERALL STATUS: ${overallStatus ? '✅ DEPLOYMENT SUCCESSFUL' : '⚠️ DEPLOYMENT IN PROGRESS'}`);
  
  if (overallStatus) {
    console.log('\n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!');
    console.log('\n🌐 LIVE URLS:');
    console.log(`   Frontend: ${DEPLOYMENT_URLS.frontend}`);
    console.log(`   Backend:  ${DEPLOYMENT_URLS.backend}`);
    console.log(`   Database: ${DEPLOYMENT_URLS.database}`);
    
    console.log('\n🧪 API ENDPOINTS:');
    Object.entries(API_ENDPOINTS).forEach(([name, path]) => {
      console.log(`   ${name}: ${DEPLOYMENT_URLS.backend}${path}`);
    });
  } else {
    console.log('\n⏳ Deployment still in progress...');
    console.log('🔄 Check back in a few minutes');
    console.log(`🔗 Monitor: https://github.com/jasminemograby/DIRECTORY/actions`);
  }
  
  return {
    timestamp: new Date().toISOString(),
    services: serviceStatus,
    apis: apiStatus,
    frontend: frontendStatus,
    database: databaseStatus,
    overall: overallStatus
  };
}

// Run the deployment status check
generateDeploymentReport().catch(console.error);

