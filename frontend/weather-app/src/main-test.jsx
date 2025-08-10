import { createRoot } from 'react-dom/client'
import './index.css'

// Simple test component without Auth0
function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🌤️ Weather App Test</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => alert('Button clicked!')}>Test Button</button>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Environment Variables Test:</h3>
        <p>AUTH0_DOMAIN: {import.meta.env.VITE_AUTH0_DOMAIN || 'Not set'}</p>
        <p>AUTH0_CLIENT_ID: {import.meta.env.VITE_AUTH0_CLIENT_ID ? 'Set (hidden)' : 'Not set'}</p>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<TestApp />)
