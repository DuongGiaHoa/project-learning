export function renderMarbleEditor(onRun: (input: string, operator: string) => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'marble-editor';

  const input = document.createElement('input');
  input.placeholder = '--a--b--c--|';

  const operatorSelect = document.createElement('select');
  ['map', 'filter', 'switchMap', 'mergeMap'].forEach(op => {
    const option = document.createElement('option');
    option.value = op;
    option.textContent = op;
    operatorSelect.appendChild(option);
  });

  const runButton = document.createElement('button');
  runButton.textContent = 'Run';
  runButton.onclick = () => {
    onRun(input.value, operatorSelect.value);
  };

  container.append('Input:', input, ' Operator:', operatorSelect, runButton);
  return container;
}