const currentPage = window.location.pathname.split("/").pop();

const user = JSON.parse(localStorage.getItem("user"));

if (currentPage === "index.html") {
  if (!user) {
    window.location.replace("login.html");
  }
}

// some default document need to be top are here

const allTransactionsHTML = document.querySelector(".js-tbody");
const allTransactionsHTMLSecond = document.querySelector(".js-tbody-second");
const transactionForm = document.querySelector(".transaction-form");
const formHeader = document.querySelector(".js-form-header");

// here is the sidebar buttons

const dashboard = document.querySelector(".dashboard");
const allTransactionSidebar = document.querySelector(".sidebar-all-transaction");
const setting = document.querySelector(".setting");

const mainContent = document.querySelector(".main-content");
const allTransactionContent = document.querySelector(".all-transactions-content");
const settingContent = document.querySelector(".setting-content");

dashboard.addEventListener("click", () => {
  dashboard.classList.add("active");
  allTransactionSidebar.classList.remove("active");
  setting.classList.remove("active");

  mainContent.style.display = "block";
  allTransactionContent.style.display = "none";
  settingContent.style.display = "none";
});
allTransactionSidebar.addEventListener("click", () => {
  dashboard.classList.remove("active");
  allTransactionSidebar.classList.add("active");
  setting.classList.remove("active");

  mainContent.style.display = "none";
  allTransactionContent.style.display = "block";
  settingContent.style.display = "none";
});
setting.addEventListener("click", () => {
  dashboard.classList.remove("active");
  allTransactionSidebar.classList.remove("active");
  setting.classList.add("active");

  mainContent.style.display = "none";
  allTransactionContent.style.display = "none";
  settingContent.style.display = "block";
});

const addTransaction = document.querySelector(".add-transaction");
const modalOverlay = document.querySelector(".modal-overlay");
const dateInp = document.querySelector(".date");
const today = new Date().toISOString().split("T")[0];

addTransaction.addEventListener("click", () => {
  modalOverlay.style.display = "flex";
  dateInp.value = today;
});

const closeModalBtn = document.querySelector("#closeModalBtn");
closeModalBtn.addEventListener("click", () => {
  transactionForm.reset();
  formHeader.innerHTML = "Add Transaction";
  modalOverlay.style.display = "none";
});

// here are the navbar element

const navbarUsername = document.querySelector(".user-name");
navbarUsername.textContent = `${user.fullname}`;

const logoutBtn = document.querySelector(".logout-btn");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.replace("login.html");
});

// here is the transanctions data

let key = `transaction_${user.username}`;

let data = JSON.parse(localStorage.getItem(key)) || [];

renderAllTransactions(data);

// taking input all the transaction data

const transactionType = document.querySelector("#transaction-type");
const descriptionInp = document.querySelector(".description");
const amountInp = document.querySelector(".amount");
const categoryInp = document.querySelector("#category");
const saveBtn = document.querySelector(".js-form-save-btn");

let editIndex = -1;

saveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const type = transactionType.value;
  const description = descriptionInp.value.trim();
  const amount = Number(amountInp.value);
  const date = dateInp.value;
  const category = categoryInp.value;

  if (!description || !amount || amount <= 0 || !date || !category) {
    alert("Please fill all fields correctly");
    return;
  }

  let newData = {
    id: crypto.randomUUID(),
    type,
    description,
    amount,
    date,
    category,
  };

  if (editIndex != -1) {
    data[editIndex] = newData;
    localStorage.setItem(`${key}`, JSON.stringify(data));
    updateCards();
    renderCards();
    renderAllTransactions(data);
    formHeader.innerHTML = "Add Transaction";
    editIndex = -1;
  } else {
    data.push(newData);
    localStorage.setItem(`${key}`, JSON.stringify(data));
    updateCards();
    renderCards();
    renderAllTransactions(data);
  }

  transactionForm.reset();
  modalOverlay.style.display = "none";
});

// updating and rendering the overview cards

const currentBalanceElem = document.querySelector(".js-current-balance");
const totalIncomeElem = document.querySelector(".js-total-income");
const totalExpenseElem = document.querySelector(".js-total-expense");
const totalTransactionElem = document.querySelector(".js-total-transaction");

let currentBalance = 0;
let totalIncome = 0;
let totalExpense = 0;
let totalTransaction = 0;

let isNegative = false;
let absValue = 0;

function updateCards() {
  currentBalance = 0;
  totalIncome = 0;
  totalExpense = 0;
  data.forEach((element) => {
    if (element.type == "expense") {
      currentBalance -= element.amount;
      totalExpense += element.amount;
    }
    if (element.type === "income") {
      currentBalance += element.amount;
      totalIncome += element.amount;
    }
    totalTransaction = data.length;
  });
  isNegative = currentBalance < 0;
  absValue = Math.abs(currentBalance).toFixed(2);
}

function renderCards() {
  currentBalanceElem.innerHTML = `${isNegative ? "-" : ""}<span>${user.currency}</span>${absValue}`;
  totalIncomeElem.innerHTML = `<span>${user.currency}</span>${totalIncome.toFixed(2)}`;
  totalExpenseElem.innerHTML = `<span>${user.currency}</span>${totalExpense.toFixed(2)}`;
  totalTransactionElem.innerHTML = `${totalTransaction}`;
}
updateCards();
renderCards();

// renderning all transactions

function renderAllTransactions(renderData) {
  allTransactionsHTML.innerHTML = "";
  allTransactionsHTMLSecond.innerHTML = "";
  renderData.forEach((elem) => {
    let elemHTML = `
      <tr>
        <td>${elem.date}</td>
        <td><strong>${elem.description}</strong></td>
        <td><span class="tag">${elem.category}</span></td>
        <td class="${elem.type === "income" ? "text-green" : "text-red"}">${elem.type === "income" ? "+" : "-"}${user.currency}${elem.amount.toFixed(2)}</td>
        <td>
          <button class="action-btn btn-edit" onclick="editBtn('${elem.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="action-btn btn-delete" onclick="deleteBtn('${elem.id}')"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `;
    allTransactionsHTML.innerHTML += elemHTML;
    allTransactionsHTMLSecond.innerHTML += elemHTML;
  });
}

// edit and delete the transactions

function editBtn(id) {
  let transactionElem = data.find((elem) => elem.id === id);
  let transactionIndex = data.findIndex((elem) => elem.id === id);
  editIndex = transactionIndex;

  modalOverlay.style.display = "flex";
  if (editIndex != -1) {
    formHeader.innerHTML = "Edit Transaction";

    transactionType.value = transactionElem.type;
    descriptionInp.value = transactionElem.description;
    amountInp.value = transactionElem.amount;
    categoryInp.value = transactionElem.category;
    dateInp.value = transactionElem.date;
  }
}

function deleteBtn(id) {
  let transactionElem = data.find((elem) => elem.id === id);
  let transactionIndex = data.findIndex((elem) => elem.id === id);

  data.splice(transactionIndex, 1);
  localStorage.setItem(`${key}`, JSON.stringify(data));
  updateCards();
  renderCards();
  renderAllTransactions(data);
}

// search and filter

const searchFilterElem = document.querySelector(".js-search-filter");
const selectFilterElem = document.querySelector(".js-select-filter");
const secondSearchFilterElem = document.querySelector(".js-search-filter-second");
const secondSelectFilterElem = document.querySelector(".js-select-filter-second");

function getFilteredData(searchFilter, selectFilter) {
  const query = searchFilter.value.trim().toLowerCase();
  const type = selectFilter.value;

  return data.filter((elem) => {
    const matchesSearch = elem.description.toLowerCase().includes(query) || elem.category.toLowerCase().includes(query);

    const matchesType = type === "all" || elem.type === type;

    return matchesSearch && matchesType;
  });
}

function applyFilters() {
  const filtered = getFilteredData(searchFilterElem, selectFilterElem);
  updateCards();
  renderCards();
  renderAllTransactions(filtered);
  secondSearchFilterElem.value = searchFilterElem.value;
  secondSelectFilterElem.value = selectFilterElem.value;
}
function secondApplyFilters() {
  const filtered = getFilteredData(secondSearchFilterElem, secondSelectFilterElem);
  updateCards();
  renderCards();
  renderAllTransactions(filtered);
  searchFilterElem.value = secondSearchFilterElem.value;
  selectFilterElem.value = secondSelectFilterElem.value;
}

searchFilterElem.addEventListener("input", applyFilters);
selectFilterElem.addEventListener("change", applyFilters);
secondSearchFilterElem.addEventListener("input", secondApplyFilters);
secondSelectFilterElem.addEventListener("change", secondApplyFilters);

// here we go on settings

const settingFullname = document.querySelector(".js-setting-fullname");
const settingCurrency = document.querySelector("#settingCurrency");
settingFullname.value = user.fullname;
settingCurrency.value = user.currency;

const settingSaveBtn = document.querySelector(".setting-save-btn");

settingSaveBtn.addEventListener("click", (e) => {
  e.preventDefault();

  user.fullname = settingFullname.value.trim();
  user.currency = settingCurrency.value;
  localStorage.setItem("user", JSON.stringify(user));
  navbarUsername.textContent = `${user.fullname}`;
  updateCards();
  renderCards();
  renderAllTransactions(data);
  updateResiteredUser(user.username,user.fullname)
  alert("changes have been saved");
});

function updateResiteredUser(username, fullname) {
  const users = JSON.parse(localStorage.getItem("registeredUsers"));
  const userToUpdate = users.find((user) => user.username === username);
  userToUpdate.fullname = fullname;
  localStorage.setItem("registeredUsers", JSON.stringify(users));
}


