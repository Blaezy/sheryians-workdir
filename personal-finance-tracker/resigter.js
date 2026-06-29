const registerUsername = document.querySelector(".register-username");
const registerPassword = document.querySelector(".register-password");
const registerBtn = document.querySelector(".register-btn");

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const username = registerUsername.value.trim();
  const password = registerPassword.value;

  if (!username || !password) {
    alert("Please fill all fields");
    return;
  }

  if (existUser(username)) {
    alert("already user exist with this name, choose another");
    return;
  }

  let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

  const newUser = {
    username,
    fullname: username,
    password,
    currency: "$",
  };

  registeredUsers.push(newUser);
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

  registerUsername.value = "";
  registerPassword.value = "";
  window.location.replace("login.html");
});

function existUser(name) {
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
  return registeredUsers.some((user) => user.username === name);
}
