const { execSync } = require('child_process');

console.log('🔧 Testing build...');

try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful!');
} catch (error) {
  console.log('❌ Build failed. Check the errors above.');
  process.exit(1);
} 