import './rxjs-example.scss';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { renderMarbleEditor } from '../MarbleEditor/marble-editor';
import { renderTimeline } from '../MarbleTimeline/marble-timeline';

export function renderRxjsVisualizer(container: HTMLElement) {
  container.innerHTML = '<h2>RxJS </h2>';

  const editor = renderMarbleEditor((input, operator) => {
    runVisualization(input, operator, container);
  });

  container.appendChild(editor);
}

function runVisualization(input: string, operator: string, container: HTMLElement) {
  const outputZone = document.createElement('div');
  outputZone.className = 'visualizer-output';
  container.querySelector('.visualizer-output')?.remove();
  container.appendChild(outputZone);

  const events = parseMarbleInput(input);
  renderTimeline(outputZone, events, 'Input');

  let resultEvents: {time: number, value: string}[] = [];

  if (operator === 'map') {
    resultEvents = events.map(e => ({ ...e, value: e.value.toUpperCase() }));
  } else if (operator === 'filter') {
    resultEvents = events.filter(e => e.value !== 'b');
  } else if (operator === 'mergeMap' || operator === 'switchMap') {
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
  }

  renderTimeline(outputZone, resultEvents, 'Output');
}

function parseMarbleInput(input: string): {time: number, value: string}[] {
  const result: {time: number, value: string}[] = [];
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