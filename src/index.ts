import './styles.scss';
import Navigo from 'navigo';

import { renderHeader } from './components/Headers/header';
import { renderSidebar } from './components/Sidebar/sidebar';
import { RxjsVisualizer } from './components/RxJS/rxjs-example';
import { Todo } from './components/ToDo/todo';

const app = document.body;
app.innerHTML = ''; // clear all

// Create layout
const header = renderHeader();
const sidebar = renderSidebar();
const main = document.createElement('main');
main.className = 'app-main';

const content = document.createElement('div');
content.className = 'app-content';
content.id = 'output';

main.appendChild(sidebar);
main.appendChild(content);
app.appendChild(header);
app.appendChild(main);

// Simple router based on hash
function router() {
  const hash = window.location.hash || '#/';
  content.innerHTML = ''; // clear content

  switch (hash) {
    case '#/rxjs':
      const rxjsVisualizer = new RxjsVisualizer(content);
      break;

    case '#/todo':
        const todo = new Todo(content);
        break;
        
    case '#/about':
      content.innerHTML = '<h2>About</h2><p>This is a sample SPA with TypeScript and RxJS.</p>';
      break;
    case '#/':
    default:
      content.innerHTML = '<h2>Welcome</h2><p>Select a page from the sidebar.</p>';
      break;
  }
}

// Initial render + route changes
window.addEventListener('load', router);
window.addEventListener('hashchange', router);