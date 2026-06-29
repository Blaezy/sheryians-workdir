let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

const loginUsernameInp = document.querySelector(".login-username");
const loginPasswordInp = document.querySelector(".login-password");
const loginBtn = document.querySelector(".login-btn");

let user;

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const loginUsername = loginUsernameInp.value.trim();
  const loginPassword = loginPasswordInp.value;
  user = login(loginUsername, loginPassword);

  if (currentPage === "login.html") {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.replace("index.html");
    } else {
      alert("not a valid user");
    }
  }
});

function login(name, password) {
  return registeredUsers.find((user) => user.username === name && user.password === password);
}
