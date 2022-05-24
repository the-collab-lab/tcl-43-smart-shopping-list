import { createRoot } from 'react-dom/client';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
