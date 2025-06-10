import './sidebar.scss';

export function renderSidebar(): HTMLElement {
  const sidebar = document.createElement('aside');
  sidebar.className = 'app-sidebar';
  sidebar.innerHTML = `
    <nav>
      <ul>
        <li><a href="#/">Home</a></li>
        <li><a href="#/rxjs">RxJS</a></li>
        <li><a href="#/todo">ToDo</a></li>
      </ul>
    </nav>
  `;
  return sidebar;
}
