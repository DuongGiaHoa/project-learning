import { OperatorType } from '../RxJS/rxjs-example';
import './editor.scss';

export class Editor {
  private onRun: (input: string, operator: OperatorType) => void;
  private container: HTMLElement;
  private inputElement: HTMLInputElement;
  private operatorSelectElement: HTMLSelectElement;
  private runButtonElement: HTMLButtonElement;

  constructor(onRun: (input: string, operator: OperatorType) => void) {
    this.onRun = onRun;
    this.container = this.createContainer();
    this.inputElement = this.createInputField();
    this.operatorSelectElement = this.createOperatorSelect();
    this.runButtonElement = this.createRunButton();

    this.runButtonElement.onclick = this.handleRunClick;

    this.container.append('Input:', this.inputElement, ' Operator:', this.operatorSelectElement, this.runButtonElement);
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  private createContainer(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'editor-container';
    return div;
  }

  private createInputField(): HTMLInputElement {
    const input = document.createElement('input');
    input.placeholder = '--a--b--c--|';
    input.className = 'editor-input';
    return input;
  }

  private createOperatorSelect(): HTMLSelectElement {
    const select = document.createElement('select');
    select.className = 'operator-select';

    Object.values(OperatorType).forEach(op => {
      const option = document.createElement('option');
      option.value = op;
      option.textContent = op;
      select.appendChild(option);
    });

    return select;
  }

  private createRunButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = 'Run';
    button.className = 'run-button';
    return button;
  }

  private handleRunClick = () => {
    const input = this.inputElement.value;
    const operator = this.operatorSelectElement.value as OperatorType;
    this.onRun(input, operator);
  };
}
