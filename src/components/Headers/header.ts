import './header.scss';

export function renderHeader(): HTMLElement {
  const header = document.createElement('header');
  header.className = 'app-header';
  header.innerHTML = `
    <h5>Home</h5>
  `;
  return header;
}
