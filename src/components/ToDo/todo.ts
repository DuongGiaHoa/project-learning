import {
  Observable,
  BehaviorSubject,
  fromEvent,
  combineLatest,
  merge,
} from 'rxjs';
import { map, filter } from 'rxjs/operators';
import './todo.scss';

interface ITask {
  id: string;
  text: string;
  completed: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

export class Todo {
  private tasksList$: BehaviorSubject<ITask[]>;
  private filter$: BehaviorSubject<FilterType>;

  private appContainer: HTMLElement;
  private taskInput!: HTMLInputElement;
  private addTaskBtn!: HTMLButtonElement;
  private tasksList!: HTMLUListElement;
  private filterAllBtn!: HTMLButtonElement;
  private filterActiveBtn!: HTMLButtonElement;
  private filterCompletedBtn!: HTMLButtonElement;

  constructor(rootElement: HTMLElement) {
    this.appContainer = rootElement;
    this.appContainer.innerHTML = '';

    const initTasks = JSON.parse(localStorage.getItem('tasksList') || '[]');
    this.tasksList$ = new BehaviorSubject<ITask[]>(initTasks);
    this.filter$ = new BehaviorSubject<FilterType>('all');

    this.subscribeToLocalStorageUpdates();
    this.renderInitialDom();
    this.setupRxjsListeners();
  }

  private renderInitialDom(): void {
    this.appContainer.className = 'task-container';

    const h1 = document.createElement('h1');
    h1.textContent = 'Task List';
    h1.className = 'task-container__title';
    this.appContainer.appendChild(h1);

    const formContainer = document.createElement('div');
    formContainer.className = 'task-form';
    this.appContainer.appendChild(formContainer);

    this.taskInput = document.createElement('input');
    this.taskInput.type = 'text';
    this.taskInput.className = 'task-form__input';
    this.taskInput.placeholder = 'Add new task...';
    formContainer.appendChild(this.taskInput);

    this.addTaskBtn = document.createElement('button');
    this.addTaskBtn.className = 'task-form__button';
    this.addTaskBtn.textContent = 'Add';
    formContainer.appendChild(this.addTaskBtn);

    this.tasksList = document.createElement('ul');
    this.tasksList.className = 'task-list';
    this.appContainer.appendChild(this.tasksList);

    const filterGroup = document.createElement('div');
    filterGroup.className = 'filter-group';
    this.appContainer.appendChild(filterGroup);

    this.filterAllBtn = document.createElement('button');
    this.filterAllBtn.className = 'filter-button filter-button--active';
    this.filterAllBtn.textContent = 'All';
    filterGroup.appendChild(this.filterAllBtn);

    this.filterActiveBtn = document.createElement('button');
    this.filterActiveBtn.className = 'filter-button';
    this.filterActiveBtn.textContent = 'Task';
    filterGroup.appendChild(this.filterActiveBtn);

    this.filterCompletedBtn = document.createElement('button');
    this.filterCompletedBtn.className = 'filter-button';
    this.filterCompletedBtn.textContent = 'Done';
    filterGroup.appendChild(this.filterCompletedBtn);
  }

  private subscribeToLocalStorageUpdates(): void {
    this.tasksList$.subscribe((tasks) => {
      localStorage.setItem('tasksList', JSON.stringify(tasks));
    });
  }

  private setupRxjsListeners(): void {
    this.subscribeToAddTaskAction();
    this.subscribeToFilterAction();
    this.subscribeToFilteredTasksRendering();
  }

  private createAddTaskActionStream(): Observable<string> {
    const addTaskClick$ = fromEvent<MouseEvent>(this.addTaskBtn, 'click');
    const taskInputEnter$ = fromEvent<KeyboardEvent>(
      this.taskInput,
      'keyup'
    ).pipe(filter((e) => e.key === 'Enter'));

    return merge(addTaskClick$, taskInputEnter$).pipe(
      map(() => this.taskInput.value.trim()),
      filter((text) => text.length > 0)
    );
  }

  private subscribeToAddTaskAction(): void {
    this.createAddTaskActionStream().subscribe((text) => {
      this.addNewTask(text);
      this.clearTaskInput();
    });
  }

  private addNewTask(text: string): void {
    const newTask: ITask = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    const currentTasks = this.tasksList$.getValue();
    this.tasksList$.next([...currentTasks, newTask]);
  }

  private clearTaskInput(): void {
    this.taskInput.value = '';
  }

  private createFilterActionStream(): Observable<FilterType> {
    const filterAllClick$ = fromEvent<MouseEvent>(
      this.filterAllBtn,
      'click'
    ).pipe(map(() => 'all' as FilterType));
    const filterActiveClick$ = fromEvent<MouseEvent>(
      this.filterActiveBtn,
      'click'
    ).pipe(map(() => 'active' as FilterType));
    const filterCompletedClick$ = fromEvent<MouseEvent>(
      this.filterCompletedBtn,
      'click'
    ).pipe(map(() => 'completed' as FilterType));

    return merge(filterAllClick$, filterActiveClick$, filterCompletedClick$);
  }

  private subscribeToFilterAction(): void {
    this.createFilterActionStream().subscribe((filterType) => {
      this.filter$.next(filterType);
      this.updateFilterButtonsUI(filterType);
    });
  }

  private updateFilterButtonsUI(filterType: FilterType): void {
    [this.filterAllBtn, this.filterActiveBtn, this.filterCompletedBtn].forEach(
      (btn) => {
        btn.classList.remove('filter-button--active');
      }
    );
    switch (filterType) {
      case 'all':
        this.filterAllBtn.classList.add('filter-button--active');
        break;
      case 'active':
        this.filterActiveBtn.classList.add('filter-button--active');
        break;
      case 'completed':
        this.filterCompletedBtn.classList.add('filter-button--active');
        break;
    }
  }

  private createFilteredTasksStream(): Observable<ITask[]> {
    return combineLatest([this.tasksList$, this.filter$]).pipe(
      map(([tasks, filterType]) => {
        switch (filterType) {
          case 'active':
            return tasks.filter((task) => !task.completed);
          case 'completed':
            return tasks.filter((task) => task.completed);
          case 'all':
          default:
            return tasks;
        }
      })
    );
  }

  private subscribeToFilteredTasksRendering(): void {
    this.createFilteredTasksStream().subscribe((filteredTasks) => {
      this.clearTaskListUI();
      filteredTasks.forEach((task) => {
        this.appendTaskItemToUI(task);
      });
    });
  }

  private clearTaskListUI(): void {
    this.tasksList.innerHTML = '';
  }

  private appendTaskItemToUI(item: ITask): void {
    const listItem = this.createTaskItemElement(item);
    this.tasksList.appendChild(listItem);
    this.setupTaskItemInteractions(listItem, item); // Gắn sự kiện cho mục mới
  }

  private createTaskItemElement(item: ITask): HTMLLIElement {
    const listItem = document.createElement('li');
    listItem.className = `task-item ${
      item.completed ? 'task-item--completed' : ''
    }`;
    listItem.dataset.id = item.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.completed;
    checkbox.className = 'task-item__checkbox';

    const taskItem = document.createElement('span');
    taskItem.textContent = item.text;
    taskItem.className = 'task-item__text';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Xóa';
    deleteBtn.className = 'task-item__delete-button';

    listItem.append(checkbox, taskItem, deleteBtn);
    return listItem;
  }

  private setupTaskItemInteractions(
    listItem: HTMLLIElement,
    item: ITask
  ): void {
    const checkbox = listItem.querySelector(
      '.task-item__checkbox'
    ) as HTMLInputElement;
    const deleteBtn = listItem.querySelector(
      '.task-item__delete-button'
    ) as HTMLButtonElement;

    this.createTaskCompletionToggleStream(checkbox, item.id).subscribe(() => {
      this.toggleTaskCompletion(item.id);
    });

    this.createTaskDeletionStream(deleteBtn, item.id).subscribe(() => {
      this.deleteTask(item.id);
    });
  }

  private createTaskCompletionToggleStream(
    checkbox: HTMLInputElement,
    id: string
  ): Observable<string> {
    return fromEvent<Event>(checkbox, 'change').pipe(map(() => id));
  }

  private toggleTaskCompletion(id: string): void {
    const currentTasks = this.tasksList$.getValue();
    const updatedTasks = currentTasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this.tasksList$.next(updatedTasks);
  }

  private createTaskDeletionStream(
    deleteBtn: HTMLButtonElement,
    id: string
  ): Observable<string> {
    return fromEvent<MouseEvent>(deleteBtn, 'click').pipe(map(() => id));
  }

  private deleteTask(id: string): void {
    const currentTasks = this.tasksList$.getValue();
    const updatedTasks = currentTasks.filter((t) => t.id !== id);
    this.tasksList$.next(updatedTasks);
  }
}
