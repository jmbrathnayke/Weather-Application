// Test getCacheInfo export
try {
  const module = await import('./src/services/weatherService.js');
  console.log('Available exports:', Object.keys(module));
  console.log('getCacheInfo type:', typeof module.getCacheInfo);
  
  if (module.getCacheInfo) {
    const result = module.getCacheInfo();
    console.log('getCacheInfo result:', result);
  }
} catch (error) {
  console.error('Import error:', error);
}
