import { interval } from 'rxjs';
import { take, map } from 'rxjs/operators';

export function runRxJS() {
  const output = document.getElementById('output');
  if (!output) return;

  interval(1000)
    .pipe(
      take(5),
      map((n) => `Tick: ${n + 1}`)
    )
    .subscribe((msg) => {
      const p = document.createElement('p');
      p.textContent = msg;
      output.appendChild(p);
    });
}
