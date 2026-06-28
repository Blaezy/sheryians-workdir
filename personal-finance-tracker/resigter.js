const currentPage = window.location.pathname.split("/").pop();

let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

const registerUsername = document.querySelector(".register-username");
const registerPassword = document.querySelector(".register-password");
const registerBtn = document.querySelector(".register-btn");


registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!existUser(registerUsername.value.trim())) {
    let newUser = {
      username: `${registerUsername.value.trim()}`,
      fullname: `${registerUsername.value.trim()}`,
      password: `${registerPassword.value}`,
      currency: "$",
    };
    registeredUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    registerUsername.value = "";
    registerPassword.value = "";
    window.location.replace("login.html");
  } else {
    alert("already user exist with this name, choose another");
  }
});

function existUser(name) {
  return registeredUsers.some((user) => user.username === name);
}
