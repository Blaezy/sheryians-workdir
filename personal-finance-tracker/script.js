const currentPage = window.location.pathname.split("/").pop();

const user = JSON.parse(localStorage.getItem("user"));

if (currentPage === "index.html") {
  if (!user) {
    window.location.replace("login.html");
  }
}

// some variables need to be top to work

const allTransactionsHTML = document.querySelector(".js-tbody");
const allTransactionsHTMLSecond = document.querySelector(".js-tbody-second");
const transactionForm = document.querySelector(".transaction-form");
const formHeader = document.querySelector(".js-form-header");
let cashFlowChart;
let currentBalance = 0;
let totalIncome = 0;
let totalExpense = 0;
let totalTransaction = 0;

let isNegative = false;
let absValue = 0;

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
renderChart(data);

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
    updateCards(data);
    renderCards();
    renderAllTransactions(data);
    renderChart(data);
    formHeader.innerHTML = "Add Transaction";
    editIndex = -1;
  } else {
    data.push(newData);
    localStorage.setItem(`${key}`, JSON.stringify(data));
    updateCards(data);
    renderCards();
    renderAllTransactions(data);
    renderChart(data);
  }

  transactionForm.reset();
  modalOverlay.style.display = "none";
});

// updating and rendering the overview cards

const currentBalanceElem = document.querySelector(".js-current-balance");
const totalIncomeElem = document.querySelector(".js-total-income");
const totalExpenseElem = document.querySelector(".js-total-expense");
const totalTransactionElem = document.querySelector(".js-total-transaction");

function updateCards(updateData) {
  currentBalance = 0;
  totalIncome = 0;
  totalExpense = 0;
  updateData.forEach((element) => {
    if (element.type == "expense") {
      currentBalance -= element.amount;
      totalExpense += element.amount;
    }
    if (element.type === "income") {
      currentBalance += element.amount;
      totalIncome += element.amount;
    }
  });
  totalTransaction = updateData.length;
  isNegative = currentBalance < 0;
  absValue = Math.abs(currentBalance).toFixed(2);
}

function renderCards() {
  currentBalanceElem.innerHTML = `${isNegative ? "-" : ""}<span>${user.currency}</span>${absValue}`;
  totalIncomeElem.innerHTML = `<span>${user.currency}</span>${totalIncome.toFixed(2)}`;
  totalExpenseElem.innerHTML = `<span>${user.currency}</span>${totalExpense.toFixed(2)}`;
  totalTransactionElem.innerHTML = `${totalTransaction}`;
}
updateCards(data);
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
  updateCards(data);
  renderCards();
  renderAllTransactions(data);
  renderChart(data);
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
  updateCards(filtered);
  renderCards();
  renderAllTransactions(filtered);
  renderChart(data);
  secondSearchFilterElem.value = searchFilterElem.value;
  secondSelectFilterElem.value = selectFilterElem.value;
}
function secondApplyFilters() {
  const filtered = getFilteredData(secondSearchFilterElem, secondSelectFilterElem);
  updateCards(filtered);
  renderCards();
  renderAllTransactions(filtered);
  renderChart(data);
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
  updateCards(data);
  renderCards();
  renderAllTransactions(data);
  renderChart(data);
  updateResiteredUser(user.username, user.fullname);
  updateResiteredCurrency(user.username, user.currency);
  secondSearchFilterElem.value = "";
  secondSelectFilterElem.value = "all";
  searchFilterElem.value = "";
  selectFilterElem.value = "all";
  alert("changes have been saved");
});

function updateResiteredUser(username, fullname) {
  const users = JSON.parse(localStorage.getItem("registeredUsers"));
  const userToUpdate = users.find((user) => user.username === username);
  userToUpdate.fullname = fullname;
  localStorage.setItem("registeredUsers", JSON.stringify(users));
}
function updateResiteredCurrency(username, currency) {
  const users = JSON.parse(localStorage.getItem("registeredUsers"));
  const userToUpdate = users.find((user) => user.username === username);
  userToUpdate.currency = currency;
  localStorage.setItem("registeredUsers", JSON.stringify(users));
}

//  here is the chart preparation
function getCSSVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function renderChart(transactions) {
  const ctx = document.getElementById("cashFlowChart").getContext("2d");

  const textColor = getCSSVar("--text-dark");
  const mutedColor = getCSSVar("--text-muted");
  const gridColor = getCSSVar("--border-color");

  if (cashFlowChart) {
    cashFlowChart.data.datasets[0].data = [totalIncome];
    cashFlowChart.data.datasets[1].data = [totalExpense];
    cashFlowChart.options.plugins.legend.labels.color = textColor;
    cashFlowChart.options.scales.y.ticks.color = mutedColor;
    cashFlowChart.options.scales.y.grid.color = gridColor;
    cashFlowChart.options.scales.x.ticks.color = mutedColor;
    cashFlowChart.update();
    return;
  }

  cashFlowChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income vs Expenses"],
      datasets: [
        { label: "Income", data: [totalIncome], backgroundColor: "#1e6b3e", borderRadius: 4, barPercentage: 0.5 },
        { label: "Expenses", data: [totalExpense], backgroundColor: "#8b1e1e", borderRadius: 4, barPercentage: 0.5 },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          align: "center",
          labels: { boxWidth: 18, boxHeight: 12, color: textColor, font: { size: 13 } },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: mutedColor, callback: (v) => v.toLocaleString() },
          grid: { color: gridColor },
        },
        x: {
          grid: { display: false },
          ticks: { color: mutedColor },
        },
      },
    },
  });
}

renderChart(data);

//  here is the preferances

const toggleTrack = document.querySelector(".js-toggle-track");
const toggleThumb = document.querySelector(".js-toggle-thumb");
const body = document.body;

let isDarkMode = localStorage.getItem("theme") === "Dark";

setTheme(isDarkMode);

function setTheme(dark) {
  toggleThumb.classList.toggle("active", dark);
  body.classList.toggle("dark-mode", dark);
  localStorage.setItem("theme", dark ? "Dark" : "Light");
  renderChart(data);
}

toggleTrack.addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  setTheme(isDarkMode);
});

const deleteAllBtn = document.querySelector(".js-delete-all-btn");

deleteAllBtn.addEventListener("click", () => {
  const isConfirmed = confirm("Are you sure you want to delete all transactions? This cannot be undone.");

  if (!isConfirmed) return;

  data = [];
  localStorage.setItem(`${key}`, JSON.stringify(data));
  updateCards(data);
  renderCards();
  renderAllTransactions(data);
  renderChart(data);
});

const sampleBtn = document.querySelector(".js-sample-btn");

sampleBtn.addEventListener("click", () => {
  const isConfirmed = confirm("This will remove your current transactions and add 15 sample transactions for testing. Continue?");

  if (!isConfirmed) return;

  data = [
    { id: crypto.randomUUID(), type: "income", description: "Salary", amount: 52000, date: "2026-06-01", category: "Salary" },
    { id: crypto.randomUUID(), type: "expense", description: "Big Bazaar groceries", amount: 1850, date: "2026-06-02", category: "Food & Dining" },
    { id: crypto.randomUUID(), type: "expense", description: "Petrol fill-up", amount: 1100, date: "2026-06-04", category: "Petrol & Auto" },
    { id: crypto.randomUUID(), type: "expense", description: "Netflix subscription", amount: 199, date: "2026-06-05", category: "Entertainment" },
    { id: crypto.randomUUID(), type: "expense", description: "Electricity bill", amount: 1320, date: "2026-06-07", category: "Utilities" },
    { id: crypto.randomUUID(), type: "income", description: "Freelance logo design", amount: 6000, date: "2026-06-09", category: "Other" },
    { id: crypto.randomUUID(), type: "expense", description: "Myntra order", amount: 2750, date: "2026-06-11", category: "Shopping" },
    { id: crypto.randomUUID(), type: "expense", description: "Jio recharge", amount: 399, date: "2026-06-13", category: "Recharge & Bills" },
    { id: crypto.randomUUID(), type: "expense", description: "Movie tickets", amount: 540, date: "2026-06-15", category: "Entertainment" },
    { id: crypto.randomUUID(), type: "expense", description: "Zomato dinner", amount: 620, date: "2026-06-17", category: "Food & Dining" },
    { id: crypto.randomUUID(), type: "income", description: "Stock dividend", amount: 1500, date: "2026-06-19", category: "Other" },
    { id: crypto.randomUUID(), type: "expense", description: "Uber rides", amount: 480, date: "2026-06-21", category: "Petrol & Auto" },
    { id: crypto.randomUUID(), type: "expense", description: "Gym membership", amount: 1200, date: "2026-06-23", category: "Utilities" },
    { id: crypto.randomUUID(), type: "expense", description: "Amazon - headphones", amount: 3499, date: "2026-06-25", category: "Shopping" },
    { id: crypto.randomUUID(), type: "income", description: "Cashback reward", amount: 250, date: "2026-06-27", category: "Other" },
  ];
  localStorage.setItem(`${key}`, JSON.stringify(data));
  updateCards(data);
  renderCards();
  renderAllTransactions(data);
  renderChart(data);
});