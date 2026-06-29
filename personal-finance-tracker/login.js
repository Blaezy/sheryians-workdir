let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

const loginUsernameInp = document.querySelector(".login-username");
const loginPasswordInp = document.querySelector(".login-password");
const loginBtn = document.querySelector(".login-btn");

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const loginUsername = loginUsernameInp.value.trim();
  const loginPassword = loginPasswordInp.value;
  const user = login(loginUsername, loginPassword);

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    window.location.replace("index.html");
  } else {
    alert("not a valid user");
  }
});

function login(name, password) {
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
  return registeredUsers.find((u) => u.username === name && u.password === password);
}