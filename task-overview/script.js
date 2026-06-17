const form = document.querySelector(".js-form");
const taskInput = document.querySelector(".js-task-input");
const categoryInput = document.querySelector(".js-category-input");
const statusInput = document.querySelector(".js-status-input");

const taskGrid = document.querySelector(".js-tasks-grid");

const totalTasks = document.querySelector(".js-total-tasks");
const pendingTasks = document.querySelector(".js-pending-tasks");
const completedTasks = document.querySelector(".js-completed-tasks");
const inprogressTasks = document.querySelector(".js-inprogress-tasks");

let tasks = [
  { name: "Build Portfolio Website", category: "Development", status: "In Progress" },
  { name: "Design New Logo", category: "Design", status: "Pending" },
  { name: "Study JavaScript Advanced", category: "Study", status: "Completed" },
  { name: "Buy Groceries", category: "Personal", status: "Pending" },
  { name: "Fix Navbar Bug", category: "Development", status: "In Progress" },
  { name: "Write Project Documentation", category: "Writing", status: "Completed" },
];

const taskIcons = {
  Development: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>`,
  Design: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="2" />
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>`,
  Study: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                  </svg>`,
  Personal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>`,
  Writing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>`,
};

function renderTask() {
  taskGrid.innerHTML = "";
  tasks.forEach((task, index) => {
    let taskHTML = `<div class="task-card">
              <div class="task-card-top">
                <div class="task-icon-wrap ${task.category}">
                  ${taskIcons[task.category]}
                </div>
                <span class="task-name">${task.name}</span>
              </div>
              <div class="task-badge-row">
                <span class="badge ${task.category}">${task.category}</span>
                <span class="status-dot ${task.status.toLowerCase().replace(/\s/g, "")}">${task.status}</span>
              </div>
              <div class="task-actions">
                <button class="act-btn edit" onClick="editTask(${index})" data-tooltip="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button class="act-btn del" onClick="deleteTask(${index})" data-tooltip="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
                <button class="act-btn done" onClick="completeTask(${index})" data-tooltip="Complete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </button>
              </div>
            </div>`;
    taskGrid.innerHTML += taskHTML;
  });
}
renderTask();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = taskInput.value;
  let category = categoryInput.value;
  let status = statusInput.value;

  if (name.trim() === "" || category === "" || status === "") return;
  else tasks.push({ name, category, status });

  console.log(tasks);
  renderTask();
  updateStats();
  form.reset();
});

// edit, delete and complete Button 

function updateStats() {
  totalTasks.innerHTML = tasks.length;

  let pendingLength = tasks.filter((elem) => elem.status === "Pending");
  pendingTasks.innerHTML = pendingLength.length;

  let completedLenght = tasks.filter((elem) => elem.status === "Completed");
  completedTasks.innerHTML = completedLenght.length;

  let inprogressLenght = tasks.filter((elem) => elem.status === "In Progress");
  inprogressTasks.innerHTML = inprogressLenght.length;
}
updateStats();

const modal = document.querySelector(".js-modal");
const closeModal = document.querySelector(".js-close-modal");

const modalTask = document.querySelector(".js-modal-task");
const modalCategory = document.querySelector(".js-modal-category");
const modalStatus = document.querySelector(".js-modal-status");

let editIndex = -1;
function editTask(index) {
  modalTask.value = tasks[index].name;
  modalCategory.value = tasks[index].category;
  modalStatus.value = tasks[index].status;
  editIndex = index;

  modal.classList.add("active");
}

modal.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = modalTask.value;
  let category = modalCategory.value;
  let status = modalStatus.value;

  tasks[editIndex] = { name, category, status };
  editIndex = -1;
  modal.classList.remove("active");
  renderTask();
  updateStats();
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
});

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTask();
  updateStats();
}

function completeTask(index) {
  if (tasks[index].status === "Completed") {
    return;
  } else {
    tasks[index].status = "Completed";
    renderTask();
    updateStats();
  }
}

// deleting all task 
const deleteModal = document.querySelector(".delete-modal-overlay");
const clearAllTaskBtn = document.querySelector(".js-clear-all-btn");

const keepIt = document.querySelector(".js-keep-it");
const deleteAnyway = document.querySelector(".js-delete-anyway");

clearAllTaskBtn.addEventListener("click", () => {
  deleteModal.classList.add("active");
});

keepIt.addEventListener("click", () => {
  deleteModal.classList.remove("active");
});

deleteAnyway.addEventListener("click", () => {
  tasks = [];
  deleteModal.classList.remove("active");
  renderTask();
  updateStats();
});
