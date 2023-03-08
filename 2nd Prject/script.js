'use strict';

// Selecting DOM Elements:
const addBtn = document.querySelectorAll('.btn');
const inputs = document.querySelectorAll('input');
const elementsList = document.querySelectorAll('ul');
const completed = document.querySelector('.completed');
const elTools = document.querySelectorAll('.el__tools');
const inProgress = document.querySelector('.in__progress');
const notStarted = document.querySelector('.not__started');
const completedEl = document.querySelector('.completed-el');
const noStartedEl = document.querySelector('.not__started-el');
const inProgressEl = document.querySelector('.in__progress-el');
const completedEls = document.querySelector('.completed-elements');
const noStartedEls = document.querySelector('.not__started-elements');
const tasksContainer = document.querySelectorAll('.tasks__container');
const inProgressEls = document.querySelector('.in__progress-elements');

// Generating and Rendering Local Storage Tasks:
const Render = function (task, disabled = true) {
  const markup = `
  <li data-id = "${task.id}" class="${task.state}-el to__do-el">
   <form action="" id="form">
     <input
         value="${task.title}"
         placeholder="What Did You Planned?"
         type="text"
         class= "${task.state}-input"
         ${disabled ? 'disabled' : ''}
        />
     <div class="el__tools">
        <i
         class="fa fa-pencil edit__btn el__tool"
         id = "os"
         aria-hidden="true"
       ></i>
       <i
         class="fa fa-trash remove__btn el__tool"
         aria-hidden="true"
       ></i>
      </div>
    </form> 
  </li>
  `;

  tasksContainer.forEach(container => {
    container.classList.contains(`${task.state}-elements`) &&
      container.insertAdjacentHTML('afterbegin', markup);
  });
};

// Generating and Rendering Tasks:
const generateMarkupAndRender = function (target, disabled = false) {
  const markup = `
  <li class="${target.dataset.section}-el to__do-el">
   <form action="" id="form">
     <input
         value=""
         placeholder="What Did You Planned?"
         type="text"
         class= "${target.dataset.section}-input"
         ${disabled ? 'disabled' : ''}
         data-id = "${Date.now()}"
        />
     <div class="el__tools">
        <i
         class="fa fa-pencil edit__btn el__tool"
         aria-hidden="true"
       ></i>
       <i
         class="fa fa-trash remove__btn el__tool"
         aria-hidden="true"
       ></i>
      </div>
    </form> 
  </li>
  `;

  tasksContainer.forEach(container => {
    container.classList.contains(`${target.dataset.section}-elements`) &&
      container.insertAdjacentHTML('afterbegin', markup);
  });
};

// Empty Array To Store Tasks:
let arrOfTasks = [];

// Check if Theres Tasks In Local Storage
if (localStorage.getItem('tasks')) {
  arrOfTasks = JSON.parse(localStorage.getItem('tasks'));
}

// Trigger Get Data From Local Storage Function
getDataFromLocalStorage();

// Event Listener:
addBtn.forEach(btn =>
  btn.addEventListener('click', function (e) {
    const target = e.target.closest('.btn');

    // Generating element markup and rendering it:
    generateMarkupAndRender(target);

    // Walking throw DOM tree to achive inserted input 'CLASS':
    const insertedInput = document.querySelector(
      `.${target.parentElement.firstElementChild.firstElementChild.firstElementChild.classList[0]}`
    );

    // Focus On it:
    insertedInput.focus();

    // Impleminting edit button:
    // Chain to achive inserted element 'EDIT BUTTON':
    insertedInput.nextElementSibling.firstElementChild.addEventListener(
      'click',
      e => {
        if (e.target.classList.contains('edit__btn')) {
          insertedInput.removeAttribute('disabled');
          insertedInput.focus();
        }
      }
    );

    // Impleminting remove button:
    // Chain to achive inserted element 'REMOVE BUTTON':
    insertedInput.nextElementSibling.firstElementChild.nextElementSibling.addEventListener(
      'click',
      e => {
        if (e.target.classList.contains('remove__btn')) {
          insertedInput.parentElement.remove();
          deleteTaskWith(insertedInput.dataset.id);
        }
      }
    );

    // Impleminting inserted input form:
    insertedInput.parentElement.addEventListener('submit', e => {
      e.preventDefault();
      insertedInput.value !== ''
        ? [
            insertedInput.setAttribute('disabled', ''),
            addElementToArray(insertedInput, target),
          ]
        : alert('Please Fill Out Your Task . . .');
    });
  })
);

function addElementToArray(taskTEXT, target) {
  // Task Data
  const task = {
    element: taskTEXT,
    id: taskTEXT.dataset.id,
    title: taskTEXT.value,
    state: target.dataset.section,
  };

  // Push Task To Array Of Tasks
  arrOfTasks.push(task);

  // Add Tasks To Local Storage
  addDataToLocalStorageFrom(arrOfTasks);
}

// Sending Data to Local Storage:
const addDataToLocalStorageFrom = arrayOfTasks =>
  window.localStorage.setItem('tasks', JSON.stringify(arrayOfTasks));

// Selecting DOM Elements:
const removeBtn = document.querySelectorAll('.remove__btn');
const editBtn = document.querySelectorAll('.edit__btn');
const forms = document.querySelectorAll('form');

// Getting Data from Local Storage:
function getDataFromLocalStorage() {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks && tasks.forEach(task => Render(task));
}

// Impleminting edit button:
// Chain to achive recalling element 'EDIT BUTTON':
editBtn.forEach(btn =>
  btn.addEventListener('click', e => {
    const clickedElInput = e.target.parentElement.previousElementSibling;
    clickedElInput.removeAttribute('disabled');
    clickedElInput.focus();
    // editTaskWith(
    //   clickedElInput,
    //   e.target.parentElement.parentElement.parentElement.dataset.id
    // );
  })
);

// Impleminting remove button:
// Chain to achive inserted element 'REMOVE BUTTON':
removeBtn.forEach(btn =>
  btn.addEventListener('click', e => {
    const clickedElInput = e.target.parentElement.previousElementSibling;
    if (e.target.classList.contains('remove__btn')) {
      // Remove Task From Local Storage
      deleteTaskWith(
        e.target.parentElement.parentElement.parentElement.dataset.id
      );
      clickedElInput.parentElement.remove();
    }
  })
);

// Impleminting inserted input form:
forms.forEach(form =>
  form.addEventListener('submit', e => {
    e.preventDefault();
    const clickedElInput = e.target.firstElementChild;
    clickedElInput.value !== ''
      ? [
          clickedElInput.setAttribute('disabled', ''),
          addElementToArray(clickedElInput, e.target),
          editTaskWith(
            clickedElInput,
            e.target.parentElement.parentElement.parentElement.dataset.id
          ),
        ]
      : alert('Please Fill Out Your Task . . .');
  })
);

const editTaskWith = (task, taskId) => {
  const elementIndex = arrOfTasks.findIndex(task => task.id === taskId);
  arrOfTasks[elementIndex].title = task.value;
  arrOfTasks[elementIndex].id = task.id;
  arrOfTasks[elementIndex].state =
    task.parentElement.parentElement.parentElement.parentElement.classList[0];
  addDataToLocalStorageFrom(arrOfTasks);
};

const deleteTaskWith = taskId => {
  arrOfTasks = arrOfTasks.filter(task => task.id != taskId);
  addDataToLocalStorageFrom(arrOfTasks);
};
// localStorage.clear();
