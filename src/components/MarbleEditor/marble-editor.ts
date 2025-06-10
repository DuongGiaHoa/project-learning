export class MarbleEditor {
  private onRun: (input: string, operator: string) => void;
  private container: HTMLElement;
  private inputElement: HTMLInputElement;
  private operatorSelectElement: HTMLSelectElement;
  private runButtonElement: HTMLButtonElement;

  constructor(onRun: (input: string, operator: string) => void) {
    this.onRun = onRun; // Lưu callback onRun
    this.container = document.createElement('div');
    this.container.className = 'marble-editor';

    this.inputElement = document.createElement('input');
    this.inputElement.placeholder = '--a--b--c--|';

    this.operatorSelectElement = document.createElement('select');
    ['map', 'filter', 'switchMap', 'mergeMap'].forEach(op => {
      const option = document.createElement('option');
      option.value = op;
      option.textContent = op;
      this.operatorSelectElement.appendChild(option);
    });

    this.runButtonElement = document.createElement('button');
    this.runButtonElement.textContent = 'Run';

    this.runButtonElement.onclick = () => {
      this.onRun(this.inputElement.value, this.operatorSelectElement.value);
    };

    this.container.append('Input:', this.inputElement, ' Operator:', this.operatorSelectElement, this.runButtonElement);
  }

  public getElement(): HTMLElement {
    return this.container;
  }
}
