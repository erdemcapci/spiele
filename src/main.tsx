import { createRoot } from 'react-dom/client';

import MainApp from './MainApp';
import './app-shell.css';
import './styles.css';

createRoot(document.getElementById('root')!).render(<MainApp />);
