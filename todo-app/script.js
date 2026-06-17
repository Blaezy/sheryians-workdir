const input = document.querySelector(".js-input");
const submitBtn = document.querySelector(".js-submit-btn");
const form = document.querySelector(".js-form");
const allTask = document.querySelector(".all-task");

const tasks = [];

function renderTasks() {
  allTask.innerHTML = "";
  tasks.forEach((elem, index) => {
    allTask.innerHTML += `
    <div class="task-card">
      <p class="task-name js-task-${index}">${elem}</p>
      <input class="edit-input task-edit edit-task-${index}" type="text" value="${elem}">
      <div class="update-div">
        <button class="edit-btn js-edit-btn-${index}" onclick="editTask(${index})">Edit</button>
        <button class="delete-btn js-delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    </div>
`;
  });
}
renderTasks();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (input.value.trim() != "") {
    tasks.push(input.value.trim());
  }

  renderTasks();
  form.reset();
});

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

let editingIndex = null;
function editTask(index) {
  const taskText = document.querySelector(`.js-task-${index}`);
  const editTask = document.querySelector(`.edit-task-${index}`);
  const editBtn = document.querySelector(`.js-edit-btn-${index}`);

  if (editingIndex !== index) {
    taskText.style.display = "none";
    editTask.classList.remove("task-edit");

    editBtn.textContent = "Update";
    editingIndex = index;
  }
  else{
    tasks[index] = editTask.value
    taskText.style.display = "block";
    editTask.classList.add("task-edit")

    editBtn.textContent = "Edit";
    editingIndex = null;
    renderTasks();
  }
}
