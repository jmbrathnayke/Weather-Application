import weatherRoutes from './routes/weather-new.js';

console.log('Weather routes imported successfully:', typeof weatherRoutes);
console.log('Weather routes object:', weatherRoutes);

if (weatherRoutes && typeof weatherRoutes.stack !== 'undefined') {
  console.log('Routes in weather module:');
  weatherRoutes.stack.forEach((route, index) => {
    console.log(`Route ${index + 1}:`, route.route?.path, route.route?.methods);
  });
} else {
  console.log('No routes found or routes not properly configured');
}
