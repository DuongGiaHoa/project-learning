import './marble-timeline.scss';

export function renderTimeline(container: HTMLElement, events: {time: number, value: string}[], title: string): void {
  const wrapper = document.createElement('div');
  wrapper.className = 'marble-wrapper';

  const timeline = document.createElement('div');
  timeline.className = 'marble-timeline';

  const label = document.createElement('div');
  label.className = 'marble-label';
  label.textContent = title;

  const arrow = document.createElement('div');
  arrow.className = 'marble-arrow';

  timeline.appendChild(arrow);

  events.forEach(({ time, value }) => {
    const marble = document.createElement('div');
    marble.className = 'marble';
    marble.textContent = value;
    marble.style.animationDelay = `${time * 0.5}s`;
    timeline.appendChild(marble);
  });

  wrapper.append(label, timeline);
  container.appendChild(wrapper);
}
