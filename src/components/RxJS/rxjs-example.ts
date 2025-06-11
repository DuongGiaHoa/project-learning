import { Editor } from '../Editor/editor';
import { Timeline } from '../Timeline/timeline';
import './rxjs-example.scss';
export interface MarbleEvent {
  time: number;
  value: string;
}

export enum OperatorType {
  MAP = 'map',
  FILTER = 'filter',
  MERGE_MAP = 'mergeMap',
}
export class RxjsVisualizer {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init() {
    this.container.innerHTML = '<h2>RxJS Visualizer</h2>';

    const editor = new Editor((input, operator) => {
      this.runCustomVisualization(input, operator);
    });

    this.container.appendChild(editor.getElement());
  }

  private runCustomVisualization(input: string, operator: string) {
    this.container.querySelector('.visualizer-output')?.remove();
    const outputZone = this.createOutputZone();

    const events = this.parseMarbleInput(input);
    new Timeline(outputZone, events, 'Input');

    const resultEvents = this.applyOperatorToEvents(events, operator);
    new Timeline(outputZone, resultEvents, 'Output');
  }

  private createOutputZone(): HTMLElement {
    const outputZone = document.createElement('div');
    outputZone.className = 'visualizer-output';
    this.container.appendChild(outputZone);
    return outputZone;
  }

  private applyOperatorToEvents(events: MarbleEvent[], operator: string): MarbleEvent[] {
    let resultEvents: MarbleEvent[] = [];
  
    switch (operator) {
      case OperatorType.MAP:
        resultEvents = events.map(e => ({ ...e, value: e.value.toUpperCase() }));
        break;
  
      case OperatorType.FILTER:
        resultEvents = events.filter(e => e.value !== 'b');
        break;

      case OperatorType.MERGE_MAP:
        let currentTime = 0;
        events.forEach(e => {
          const innerEvents = [
            { time: currentTime, value: e.value },
            { time: currentTime + 1, value: e.value + '1' },
            { time: currentTime + 2, value: e.value + '2' }
          ];
     
          resultEvents.push(...innerEvents);
          currentTime = e.time + 1;
        });
        break;
    }
  
    return resultEvents;
  }
  

  private parseMarbleInput(input: string): MarbleEvent[] {
    const result: MarbleEvent[] = [];
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