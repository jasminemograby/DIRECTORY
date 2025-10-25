// Simple test to verify the system works
console.log('🧪 Running simple verification tests...');

// Test 1: Check if we can import modules
try {
  const express = await import('express');
  console.log('✅ Express import successful');
} catch (error) {
  console.log('❌ Express import failed:', error.message);
}

// Test 2: Check if we can read mock data
try {
  const fs = await import('fs/promises');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  const mockData = await fs.readFile(
    path.join(__dirname, '../database/mocks/mock-companies.json'), 
    'utf8'
  );
  const companies = JSON.parse(mockData);
  console.log('✅ Mock data read successful:', companies.companies.length, 'companies');
} catch (error) {
  console.log('❌ Mock data read failed:', error.message);
}

// Test 3: Check environment variables
console.log('✅ Environment check:');
console.log('  - NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('  - USE_MOCK:', process.env.USE_MOCK || 'not set');
console.log('  - PORT:', process.env.PORT || 'not set');

console.log('🎉 Simple verification tests completed!');
