import './rxjs-example.scss';
import { MarbleEditor } from '../MarbleEditor/marble-editor';
import { TimelineRenderer } from '../MarbleTimeline/marble-timeline';

export class RxjsVisualizer {
  private container: HTMLElement;
  private outputZone: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(): void {
    this.container.innerHTML = '<h2>RxJS</h2>';

    const editor = new MarbleEditor(this.runVisualization.bind(this));
    this.container.appendChild(editor.getElement());
  }

  private runVisualization(input: string, operator: string): void {
    this.container.querySelector('.visualizer-output')?.remove();

    this.outputZone = document.createElement('div');
    this.outputZone.className = 'visualizer-output';
    this.container.appendChild(this.outputZone);

    const events = this.parseMarbleInput(input);
    const inputTimeline = new TimelineRenderer(this.outputZone, events, 'Input');
    inputTimeline.render();

    let resultEvents: {time: number, value: string}[] = [];

    // Logic áp dụng toán tử RxJS
    switch (operator) {
      case 'map':
        resultEvents = events.map(e => ({ ...e, value: e.value.toUpperCase() }));
        break;

      case 'filter':
        resultEvents = events.filter(e => e.value !== 'b');
        break;

      case 'mergeMap':
      case 'switchMap':
        let currentTime = 0;
        events.forEach(e => {
          const innerEvents = [
            { time: currentTime, value: e.value },
            { time: currentTime + 1, value: e.value + '1' },
            { time: currentTime + 2, value: e.value + '2' }
          ];

          if (operator === 'switchMap') {
            resultEvents = resultEvents.filter(ev => ev.time < currentTime);
          }
          resultEvents.push(...innerEvents);
          currentTime = e.time + 1;
        });
        break;
    }

    const outputTimeline = new TimelineRenderer(this.outputZone, resultEvents, 'Output');
    outputTimeline.render();
  }

  private parseMarbleInput(input: string): {time: number, value: string}[] {
    const result: Array<{time: number, value: string}> = [];
    let time = 0;
    for (const char of input) {
      if (char === '-') {
        time++;
      } else if (char === '|') {
        break;
      } else {
        result.push({ time, value: char });
        time++;
      }
    }
    return result;
  }
}