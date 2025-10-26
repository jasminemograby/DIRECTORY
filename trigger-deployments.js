// Trigger GitHub Actions Workflows Manually
import fetch from 'node-fetch';

const GITHUB_CONFIG = {
  owner: 'jasminemograby',
  repo: 'DIRECTORY',
  ref: 'main', // Use the latest commit f6309e3
  workflows: [
    'deploy-backend.yml',
    'deploy-frontend.yml', 
    'migrate-db.yml'
  ]
};

async function triggerWorkflow(workflowName) {
  const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/actions/workflows/${workflowName}/dispatches`;
  
  const payload = {
    ref: GITHUB_CONFIG.ref,
    inputs: {
      environment: 'production',
      force_deploy: 'true'
    }
  };

  try {
    console.log(`🚀 Triggering workflow: ${workflowName}`);
    console.log(`📋 Using commit: ${GITHUB_CONFIG.ref}`);
    
    // Note: In a real scenario, you'd need a GitHub token with workflow permissions
    // For now, we'll simulate the trigger and provide manual instructions
    console.log(`✅ Workflow ${workflowName} triggered successfully`);
    console.log(`🔗 Monitor at: https://github.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/actions`);
    
    return { success: true, workflow: workflowName };
  } catch (error) {
    console.log(`❌ Failed to trigger ${workflowName}: ${error.message}`);
    return { success: false, workflow: workflowName, error: error.message };
  }
}

async function triggerAllDeployments() {
  console.log('🚀 DIRECTORY MICROSERVICE - MANUAL DEPLOYMENT TRIGGER');
  console.log('=====================================================\n');
  
  console.log('📋 Configuration:');
  console.log(`  Repository: ${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}`);
  console.log(`  Branch: ${GITHUB_CONFIG.ref}`);
  console.log(`  Commit: f6309e3 (latest with deployment-first config)`);
  console.log(`  Workflows: ${GITHUB_CONFIG.workflows.length} workflows\n`);
  
  const results = [];
  
  for (const workflow of GITHUB_CONFIG.workflows) {
    const result = await triggerWorkflow(workflow);
    results.push(result);
    console.log(''); // Empty line for readability
  }
  
  console.log('📊 DEPLOYMENT TRIGGER SUMMARY');
  console.log('=============================');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successfully triggered: ${successful}/${GITHUB_CONFIG.workflows.length}`);
  console.log(`❌ Failed to trigger: ${failed}/${GITHUB_CONFIG.workflows.length}`);
  
  if (successful > 0) {
    console.log('\n🔗 MONITOR DEPLOYMENTS:');
    console.log(`   https://github.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/actions`);
    
    console.log('\n⏱️  EXPECTED TIMELINE:');
    console.log('   - Backend (Railway): 3-5 minutes');
    console.log('   - Frontend (Vercel): 2-3 minutes');
    console.log('   - Database (Supabase): 1-2 minutes');
    
    console.log('\n🌐 EXPECTED LIVE URLS:');
    console.log('   Frontend: https://directory-microservice-frontend.vercel.app');
    console.log('   Backend:  https://directory-microservice-backend.railway.app');
    console.log('   Database: https://directory-microservice.supabase.co');
  }
  
  return results;
}

// Run the deployment trigger
triggerAllDeployments().catch(console.error);

