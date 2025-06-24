class TodoApp {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
        this.initElements();
        this.bindEvents();
        this.updateUI();
    }

    initElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.remainingTasks = document.getElementById('remainingTasks');
        this.clearCompleted = document.getElementById('clearCompleted');
    }

    bindEvents() {
        // Add task button click
        this.addBtn.addEventListener('click', () => this.addTask());
        
        // Enter key press in input field
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        // Clear completed tasks
        this.clearCompleted.addEventListener('click', () => this.clearCompletedTasks());

        // Event delegation for task list
        this.todoList.addEventListener('click', (e) => this.handleTaskClick(e));
        this.todoList.addEventListener('change', (e) => this.handleTaskChange(e));
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        
        if (taskText === '') {
            this.showAlert('Please enter a task!');
            return;
        }

        if (taskText.length > 100) {
            this.showAlert('Task is too long! Maximum 100 characters.');
            return;
        }

        const newTask = {
            id: this.taskIdCounter++,
            text: taskText,
            completed: false,
            createdAt: new Date()
        };

        this.tasks.unshift(newTask); // Add to beginning for better UX
        this.taskInput.value = '';
        this.updateUI();
        this.taskInput.focus();
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.updateUI();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.updateUI();
        }
    }

    clearCompletedTasks() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.updateUI();
    }

    handleTaskClick(e) {
        if (e.target.classList.contains('delete-btn')) {
            const taskId = parseInt(e.target.dataset.taskId);
            this.deleteTask(taskId);
        }
    }

    handleTaskChange(e) {
        if (e.target.classList.contains('task-checkbox')) {
            const taskId = parseInt(e.target.dataset.taskId);
            this.toggleTask(taskId);
        }
    }

    updateUI() {
        this.renderTasks();
        this.updateStats();
        this.updateClearButton();
    }

    renderTasks() {
        if (this.tasks.length === 0) {
            this.todoList.innerHTML = `
                <li class="empty-state">
                    No tasks yet. Add one above to get started!
                </li>
            `;
            return;
        }

        this.todoList.innerHTML = this.tasks.map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <input type="checkbox" 
                       class="task-checkbox" 
                       data-task-id="${task.id}" 
                       ${task.completed ? 'checked' : ''}>
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <button class="delete-btn" data-task-id="${task.id}">Delete</button>
            </li>
        `).join('');
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const remaining = total - completed;

        this.totalTasks.textContent = total;
        this.completedTasks.textContent = completed;
        this.remainingTasks.textContent = remaining;
    }

    updateClearButton() {
        const hasCompleted = this.tasks.some(task => task.completed);
        this.clearCompleted.disabled = !hasCompleted;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showAlert(message) {
        // Simple alert - in a real app, you might want a custom toast notification
        this.taskInput.style.borderColor = '#dc3545';
        this.taskInput.placeholder = message;
        
        setTimeout(() => {
            this.taskInput.style.borderColor = '#e0e0e0';
            this.taskInput.placeholder = 'Enter a new task...';
        }, 2000);
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// Prevent form submission if this were inside a form
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});