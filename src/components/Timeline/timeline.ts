import { MarbleEvent } from '../RxJS/rxjs-example';
import './timeline.scss';

export class Timeline {
  private container: HTMLElement;
  private events: MarbleEvent[];
  private label: string;

  constructor(container: HTMLElement, events: MarbleEvent[], label: string) {
    this.container = container;
    this.events = events;
    this.label = label;
    this.render();
  }

  private render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'marble-wrapper';

    const labelElem = this.createLabel();
    const timeline = this.createTimeline();

    wrapper.appendChild(labelElem);
    wrapper.appendChild(timeline);
    this.container.appendChild(wrapper);
  }

  private createLabel(): HTMLElement {
    const labelElem = document.createElement('div');
    labelElem.className = 'marble-label';
    labelElem.textContent = this.label;
    return labelElem;
  }

  private createTimeline(): HTMLElement {
    const timeline = document.createElement('div');
    timeline.className = 'marble-timeline';

    const arrow = document.createElement('div');
    arrow.className = 'marble-arrow';
    timeline.appendChild(arrow);

    this.events.forEach(event => {
      const marble = this.createMarble(event);
      timeline.appendChild(marble);
    });

    return timeline;
  }

  private createMarble(event: MarbleEvent): HTMLElement {
    const marble = document.createElement('div');
    marble.className = 'marble';
    marble.textContent = event.value;

    marble.style.animationDelay = `${event.time * 0.5}s`;

    return marble;
  }
}
