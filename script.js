const themeToggle = document.getElementById('theme-toggle');
const form = document.getElementById('form');
const input = document.getElementById('input');
const todosUL = document.getElementById('todos');

// Check for saved theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.innerText = '☀️ Light Mode';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    themeToggle.innerText = '☀️ Light Mode';
  } else {
    localStorage.setItem('theme', 'light');
    themeToggle.innerText = '🌙 Dark Mode';
  }
});

const todos = JSON.parse(localStorage.getItem('todos'));

if (todos) {
  todos.forEach((todo) => {
    addTodo(todo);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  addTodo();
});

function addTodo(todo) {
  let todoText = input.value;

  if (todo) {
    todoText = todo.text;
  }

  if (todoText) {
    const todoEl = document.createElement('li');
    if (todo && todo.completed) {
      todoEl.classList.add('completed');
    }

    todoEl.innerText = todoText;

    todoEl.addEventListener('click', (e) => {
      // Prevent toggling when interacting with the edit input field
      if (e.target.tagName !== 'INPUT') {
        todoEl.classList.toggle('completed');
        updateLS();
      }
    });

    todoEl.addEventListener('dblclick', () => {
      // Prevent multiple inputs if double-clicked repeatedly
      if (todoEl.querySelector('input')) return;

      const currentText = todoEl.innerText;
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = currentText;
      editInput.classList.add('edit-input');

      todoEl.innerText = '';
      todoEl.appendChild(editInput);
      editInput.focus();

      editInput.addEventListener('blur', () => {
        todoEl.innerText = editInput.value.trim() || currentText;
        updateLS();
      });

      editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          editInput.blur();
        }
      });
    });

    todoEl.addEventListener('contextmenu', (e) => {
      e.preventDefault();

      todoEl.classList.add('fade-out');
      setTimeout(() => {
        todoEl.remove();
        updateLS();
      }, 300);
    });

    todosUL.appendChild(todoEl);

    input.value = '';

    updateLS();
  }
}

function updateLS() {
  const todosEl = document.querySelectorAll('li');

  const todos = [];

  todosEl.forEach((todoEl) => {
    todos.push({
      text: todoEl.innerText,
      completed: todoEl.classList.contains('completed'),
    });
  });

  localStorage.setItem('todos', JSON.stringify(todos));
}