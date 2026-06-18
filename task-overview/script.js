const form = document.querySelector(".js-form");
const taskInput = document.querySelector(".js-task-input");
const categoryInput = document.querySelector(".js-category-input");
const statusInput = document.querySelector(".js-status-input");

const taskGrid = document.querySelector(".js-tasks-grid");

const totalTasks = document.querySelector(".js-total-tasks");
const pendingTasks = document.querySelector(".js-pending-tasks");
const completedTasks = document.querySelector(".js-completed-tasks");
const inprogressTasks = document.querySelector(".js-inprogress-tasks");

const savedTheme = document.querySelector(".js-saved-theme");
const savedTasks = document.querySelector(".js-saved-tasks");


let tasks = JSON.parse(localStorage.getItem("task")) || [];

let result = [];

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

function renderTask(tasks) {
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
                <button class="act-btn edit" onClick="editTask('${task.id}')" data-tooltip="Edit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button class="act-btn del" onClick="deleteTask('${task.id}')" data-tooltip="Delete">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
                <button class="act-btn done" onClick="completeTask('${task.id}')" data-tooltip="Complete">
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
renderTask(tasks);
localStorage.setItem("task", JSON.stringify(tasks));
savedTasks.innerHTML = `${JSON.parse(localStorage.getItem("task")).length} tasks`;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let id = crypto.randomUUID();
  let name = taskInput.value;
  let category = categoryInput.value;
  let status = statusInput.value;

  if (name.trim() === "" || category === "" || status === "") return;
  else tasks.push({ id, name, category, status });

  if (result) {
    result = searchFilter(tasks);
    result = categoryFilter(result);
    result = statusFilter(result);
    renderTask(result);
  } else renderTask(tasks);
  updateStats();
  localStorage.setItem("task", JSON.stringify(tasks));
  savedTasks.innerHTML = `${JSON.parse(localStorage.getItem("task")).length} tasks`;
  form.reset();
});

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

// edit, delete and complete Button

const modal = document.querySelector(".js-modal");
const closeModal = document.querySelector(".js-close-modal");

const modalTask = document.querySelector(".js-modal-task");
const modalCategory = document.querySelector(".js-modal-category");
const modalStatus = document.querySelector(".js-modal-status");

let editIndex = -1;
function editTask(id) {
  let taskObj = tasks.find((val) => val.id === id);
  let taskIndex = tasks.findIndex((val) => val.id === id);

  modalTask.value = taskObj.name;
  modalCategory.value = taskObj.category;
  modalStatus.value = taskObj.status;
  editIndex = taskIndex;

  modal.classList.add("active");
}

modal.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = tasks[editIndex].id;
  let name = modalTask.value;
  let category = modalCategory.value;
  let status = modalStatus.value;

  tasks[editIndex] = { id, name, category, status };
  editIndex = -1;
  modal.classList.remove("active");
  if (result) {
    result = searchFilter(tasks);
    result = categoryFilter(result);
    result = statusFilter(result);
    renderTask(result);
  } else renderTask(tasks);
  updateStats();
  localStorage.setItem("task", JSON.stringify(tasks));
  savedTasks.innerHTML = `${JSON.parse(localStorage.getItem("task")).length} tasks`;
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
});

function deleteTask(id) {
  let taskObj = tasks.find((val) => val.id === id);
  let taskIndex = tasks.findIndex((val) => val.id === id);

  tasks.splice(taskIndex, 1);
  if (result) {
    result = searchFilter(tasks);
    result = categoryFilter(result);
    result = statusFilter(result);
    renderTask(result);
  } else renderTask(tasks);
  updateStats();
  localStorage.setItem("task", JSON.stringify(tasks));
  savedTasks.innerHTML = `${JSON.parse(localStorage.getItem("task")).length} tasks`;
}

function completeTask(id) {
  let taskObj = tasks.find((val) => val.id === id);
  let taskIndex = tasks.findIndex((val) => val.id === id);

  if (tasks[taskIndex].status === "Completed") {
    return;
  } else {
    tasks[taskIndex].status = "Completed";
    if (result) {
      result = searchFilter(tasks);
      result = categoryFilter(result);
      result = statusFilter(result);
      renderTask(result);
    } else renderTask(tasks);
    updateStats();
    localStorage.setItem("task", JSON.stringify(tasks));
    savedTasks.innerHTML = `${JSON.parse(localStorage.getItem("task")).length} tasks`;
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
  if (result) {
    result = searchFilter(tasks);
    result = categoryFilter(result);
    result = statusFilter(result);
    renderTask(result);
  } else renderTask(tasks);
  updateStats();
  localStorage.setItem("task", JSON.stringify(tasks));
  savedTasks.innerHTML = `${JSON.parse(localStorage.getItem("task")).length} tasks`;
});

// filtering and searching

const navSearch = document.querySelector(".js-nav-search-tasks");
const filterSearch = document.querySelector(".js-search-tasks");
const filterCategory = document.querySelector(".js-filter-category");
const filterStatus = document.querySelector(".js-filter-status");

navSearch.addEventListener("keyup", () => {
  if (navSearch.value === "") renderTask(tasks);
  else {
    const result = tasks.filter((obj) =>
      Object.values(obj).some((value) => String(value).toLowerCase().includes(navSearch.value.trim())),
    );

    renderTask(result);
  }
});

function searchFilter(result) {
  if (filterSearch.value === "") return result;
  else {
    return tasks.filter((obj) =>
      Object.values(obj).some((value) => String(value).toLowerCase().includes(filterSearch.value.trim())),
    );
  }
}
function categoryFilter(result) {
  if (filterCategory.value === "Filter by Category") return result;
  else {
    return result.filter((elem) => elem.category === filterCategory.value);
  }
}
function statusFilter(result) {
  if (filterStatus.value === "Filter by Status") return result;
  else {
    return result.filter((elem) => elem.status === filterStatus.value);
  }
}

filterSearch.addEventListener("keyup", () => {
  result = searchFilter(tasks);
  result = categoryFilter(result);
  result = statusFilter(result);
  renderTask(result);
});

filterCategory.addEventListener("change", () => {
  result = searchFilter(tasks);
  result = categoryFilter(result);
  result = statusFilter(result);
  renderTask(result);
});
filterStatus.addEventListener("change", () => {
  result = searchFilter(tasks);
  result = categoryFilter(result);
  result = statusFilter(result);
  renderTask(result);
});

const clearFilter = document.querySelector(".js-clear-filter");

clearFilter.addEventListener("click", () => {
  navSearch.value = "";
  filterSearch.value = "";
  filterCategory.value = "Filter by Category";
  filterStatus.value = "Filter by Status";
  result = [];
  renderTask(tasks);
});

// Attributes vs Properties Demo

const attrInput = document.querySelector(".js-attr-input");
const showDiffBtn = document.querySelector(".js-show-diff-btn");
const diffConsole = document.querySelector(".js-diff-code-console");

showDiffBtn.addEventListener("click", () => {
  diffConsole.innerHTML = `<div class="code-block">
            <div class="console-label">Console Output</div>
            <div><span class="code-key">input.value</span></div>
            <div><span class="code-val">${attrInput.value}</span></div>
            <br />
            <div><span class="code-key">input.getAttribute("value")</span></div>
            <div><span class="code-val">Hello World</span></div>
          </div>
          <div class="info-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            input.value returns the current value property, while getAttribute("value") returns the initial HTML
            attribute value.
          </div>`;
});

// Event Propagation Demo

const childBtn = document.querySelector(".js-child-btn");
const propBubble = document.querySelector(".js-prop-bubble");
const propCapture = document.querySelector(".js-prop-capture");
const infoNote = document.querySelector(".js-info-note");
const propCodeConsole = document.querySelector(".js-prop-code-console");

let isDefaultPropBubble = true;

propBubble.addEventListener("click", () => {
  propBubble.classList.add("active");
  isDefaultPropBubble = true;
  propCapture.classList.remove("active");
});
propCapture.addEventListener("click", () => {
  propCapture.classList.add("active");
  isDefaultPropBubble = false;
  propBubble.classList.remove("active");
});

childBtn.addEventListener("click", () => {
  if (isDefaultPropBubble) {
    infoNote.innerHTML =
      "Event Bubbling starts from the element that was clicked (Child) and moves upward through its parent elements until it reaches the top.";
    propCodeConsole.innerHTML = `<div class="console-box">
    <div class="console-label">Console Output</div>
    <div class="c-order">
    <span style="color: var(--muted); font-size: 10px">Bubbling Order:</span>
    </div>
    <div class="c-order">
    <span class="c-child">Child</span>
    <span class="c-arr">→</span>
    <span class="c-parent">Parent</span>
    <span class="c-arr">→</span>
    <span class="c-gp">Grandparent</span>
    </div>
    </div>`;
  } else {
    infoNote.innerHTML =
      "Event Capturing starts from the outermost element (Grandparent) and travels downward through its children until it reaches the clicked element.";
    propCodeConsole.innerHTML = `<div class="console-box">
<div class="console-label">Console Output</div>
            <div class="c-order" style="margin-top: 4px">
              <span style="color: var(--muted); font-size: 10px">Capturing Order:</span>
            </div>
            <div class="c-order">
              <span class="c-gp">Grandparent</span>
              <span class="c-arr">→</span>
              <span class="c-parent">Parent</span>
              <span class="c-arr">→</span>
              <span class="c-child">Child</span>
            </div>
             </div>`;
  }
});

// Theme Toggle

const toggleTrack = document.querySelector(".js-toggle-track");
const toggleThumb = document.querySelector(".js-toggle-thumb");
const bottomToggleTrack = document.querySelector(".js-bottom-toggle-track");
const bottomToggleThumb = document.querySelector(".js-bottom-toggle-thumb");
const currentThemeText = document.querySelector(".js-current-theme");
const body = document.body;

let isDarkMode = localStorage.getItem("theme") === "Dark" ? true : false;

if (isDarkMode) {
  toggleThumb.classList.add("active");
  bottomToggleThumb.classList.add("active");
  body.classList.add("dark-theme");
  currentThemeText.innerHTML = "Dark";
  savedTheme.innerHTML = localStorage.getItem("theme");
}

function toggleTheme() {
  isDarkMode = !isDarkMode;

  toggleThumb.classList.toggle("active");
  bottomToggleThumb.classList.toggle("active");
  body.classList.toggle("dark-theme");

  if (isDarkMode) {
    currentThemeText.innerHTML = "Dark";
    localStorage.setItem("theme", "Dark");
  } else {
    currentThemeText.innerHTML = "Light";
    localStorage.setItem("theme", "Light");
  }
  savedTheme.innerHTML = localStorage.getItem("theme");
}

toggleTrack.addEventListener("click", toggleTheme);
bottomToggleTrack.addEventListener("click", toggleTheme);
