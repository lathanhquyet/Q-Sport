import './styles/main.css';
import { handleRouting } from './app/router';

// Initialize SPA Router on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  handleRouting();
});

// Initial call if DOM already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  handleRouting();
}
