const inpName = document.querySelector(".js-inp-name");
const inpEmail = document.querySelector(".js-inp-email");
const inpUrl = document.querySelector(".js-inp-url");
const inpBtn = document.querySelector(".js-inp-btn");

const form = document.querySelector("form");
const allUser = document.querySelector(".all-user");

const users = [
  {
    name: "Rohan Sharma",
    email: "rohan@gmail.com",
    img: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "Priya Verma",
    email: "priya@gmail.com",
    img: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Arjun Singh",
    email: "arjun@gmail.com",
    img: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Neha Gupta",
    email: "neha@gmail.com",
    img: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Karan Mehta",
    email: "karan@gmail.com",
    img: "https://i.pravatar.cc/150?img=15",
  },
];

function renderUser() {
  allUser.innerHTML = "";
  users.forEach((user, index) => {
    let userHTML = `<div class="user-card">
      <div class="user-img">
        <img src=${user.img} alt="user" />
      </div>
      <h3>${user.name}</h3>
      <p>${user.email}</p>
      <div class="option">
        <button class="edit-btn" onClick="editUser(${index})">edit</button>
        <button class="delete-btn" onClick="deleteUser(${index})">delete</button>
      </div>
    </div>`;
    allUser.innerHTML += userHTML;
  });
}
renderUser();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let name = inpName.value;
  let email = inpEmail.value;
  let img = inpUrl.value;

  if (name.trim() === "" || email.trim() === "" || img.trim() === "") {
    return;
  } else {
    users.push({ name, email, img });
    renderUser();
    form.reset();
  }
});

function deleteUser(index) {
  users.splice(index, 1);
  renderUser();
}

const modal = document.querySelector(".js-modal");

const modalName = document.querySelector(".js-modal-name");
const modalEmail = document.querySelector(".js-modal-email");
const modalUrl = document.querySelector(".js-modal-url");
const modalBtn = document.querySelector(".js-modal-btn");

let editIndex = -1;

function editUser(index) {
  modalName.value = users[index].name;
  modalEmail.value = users[index].email;
  modalUrl.value = users[index].img;
  editIndex = index;
  modal.classList.add("active");
}

modal.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = modalName.value;
  let email = modalEmail.value;
  let img = modalUrl.value;

  users[editIndex] = { name, email, img };
  editIndex = -1;
  modal.classList.remove("active");
  renderUser();
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});