const root = document.querySelector(":root");
// ? =========> HTML Elements
const modal = document.getElementById("modal");
const title = document.getElementById("title");
const statusInput = document.getElementById("status");
const categoryInput = document.getElementById("category");
const descriptionTextArea = document.getElementById("description");
const bgColorInput = document.getElementById("bgColor");
const fnColorInput = document.getElementById("fnColor");

const navbar = document.getElementById("navbar");
const searchInput = document.getElementById("searchInput");
const tasksContainer = document.getElementById("tasksContainer");

const tasks = document.querySelectorAll(".tasks");
const sections = document.querySelectorAll(".status-s");

const remainingCounter = document.getElementById("remainingCounter");

// ? =========> HTML Buttons
const newTaskBtn = document.getElementById("newTask");
const addTaskBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const mode = document.getElementById("mode");
const barsBtn = document.getElementById("barsBtn");
const gridBtn = document.getElementById("gridBtn");

const logOutBtn = document.querySelector(".log-out");

// ? =========> Global Variables
let tasksList = getFromLocalStorage();
let updateID = 0;
let currentUser = JSON.parse(localStorage.getItem("loggedUser")) || null;

// ? =========> RegEx

const titleRegEx = /^(?=.{5,50}$)[\w\s]+$/;
const descriptionRegEx = /^(?=.{25,200}$)[\w\s]+$/;

const statusContainers = {
  nextUp: document.getElementById("nextUp"),
  inProgress: document.getElementById("inProgress"),
  done: document.getElementById("done"),
};

(function () {
  displayAllTasks();
})();

// ? =========> Functions
function showModal() {
  window.scroll(0, 0);
  document.body.style.overflow = "hidden";
  modal.classList.replace("d-none", "d-flex");
}
function hideModal() {
  document.body.style.overflow = "auto";
  modal.classList.replace("d-flex", "d-none");
}

function displayAllTasks() {
  document.querySelectorAll(".myTask").forEach((task) => task.remove());

  if (currentUser.logged) {
    let userTasks = tasksList.filter(
      (task) => task.userId == currentUser.email
    );

    userTasks.forEach((task) => {
      displayTask(task);
    });
  } else {
    alert("display all fn ----- no users");
  }
}

function addTask() {
  currentUser = JSON.parse(localStorage.getItem("loggedUser"));

  if (
    validate(title, titleRegEx) &&
    validate(descriptionTextArea, descriptionRegEx)
  ) {
    // document
    //   .getElementById("modalInvalid")
    //   .classList.replace("d-block", "d-none");

    let task = {
      id: Date.now(),
      userId: currentUser.email,
      status: statusInput.value.trim(),
      category: categoryInput.value.trim(),
      title: title.value.trim(),
      description: descriptionTextArea.value.trim(),
      bgColor: bgColorInput.value,
      fnColor: fnColorInput.value,
    };

    tasksList.push(task);
    displayTask(task);
    setToLocalStorage();
    hideModal();
  }
  // else {
  //   document
  //     .getElementById("modalInvalid")
  //     .classList.replace("d-none", "d-block");
  // }
}

function displayTask(task) {
  const myTaskDiv = document.createElement("div");
  myTaskDiv.className = "myTask";
  myTaskDiv.style.backgroundColor = task.bgColor;
  myTaskDiv.style.color = task.fnColor;
  myTaskDiv.dataset.id = task.id;

  // H3
  const titleH3 = document.createElement("h3");
  titleH3.textContent = `${task.title}`;
  myTaskDiv.appendChild(titleH3);

  // Description paragraph
  const descriptionP = document.createElement("p");
  descriptionP.textContent = `${task.description}`;
  myTaskDiv.appendChild(descriptionP);

  // H4 category
  const categoryH4 = document.createElement("h4");
  categoryH4.className = `${task.category}`;
  categoryH4.textContent = `${task.category}`;
  myTaskDiv.appendChild(categoryH4);

  const ulElement = document.createElement("ul");

  // Pencil icon
  const pencil_Li = document.createElement("li");
  const pencilIcon = document.createElement("i");
  pencilIcon.className = "bi bi-pencil-square update";
  // pencilIcon.setAttribute("onclick", `getTaskInfo(${task.id})`);
  pencil_Li.appendChild(pencilIcon);
  ulElement.appendChild(pencil_Li);

  // Palette icon
  const Paletteli = document.createElement("li");
  const paletteIcon = document.createElement("i");
  paletteIcon.className = "bi bi-palette-fill changeColor";
  // paletteIcon.setAttribute("onclick", `changeColor(${task.id})`);
  Paletteli.appendChild(paletteIcon);
  ulElement.appendChild(Paletteli);

  // Trash icon
  const liTrash = document.createElement("li");
  const trashIcon = document.createElement("i");
  trashIcon.className = "bi bi-trash-fill delete";
  // trashIcon.onclick = function () {
  //   deleteTask(task.id);
  // };
  // console.log(task.id);

  liTrash.appendChild(trashIcon);
  ulElement.appendChild(liTrash);

  myTaskDiv.appendChild(ulElement);

  statusContainers[task.status].querySelector(".tasks").appendChild(myTaskDiv);

  tasksCounter(task.status);
  clearForm();
}

function setToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasksList));
}

function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function tasksCounter(status) {
  let count = document
    .getElementById(status)
    .querySelectorAll(".myTask").length;
  document.getElementById(status).querySelector("span").innerText = count;
}

function deleteTask(taskId) {
  const taskElement = document.querySelector(`.myTask[data-id='${taskId}']`);
  const status = taskElement.closest(".status-s").getAttribute("id");
  if (taskElement) {
    taskElement.remove();
  }
  tasksList = tasksList.filter((task) => task.id !== taskId);
  setToLocalStorage();
  tasksCounter(status);
}

function searchForTask() {
  const term = searchInput.value.toLowerCase().trim();

  document.querySelectorAll(".myTask").forEach((task) => task.remove());
  if (currentUser.logged) {
    let userTasks = tasksList.filter(
      (task) => task.userId == currentUser.email
    );
    const filteredTasks = userTasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(term) ||
        task.category.toLowerCase().includes(term)
      );
    });
    filteredTasks.forEach((task) => displayTask(task));
  }
}

function getTaskInfo(taskId) {
  const task = tasksList.find((_task) => _task.id === taskId);
  if (task) {
    title.value = task.title;
    statusInput.value = task.status;
    categoryInput.value = task.category;
    descriptionTextArea.value = task.description;
    updateID = taskId;
    showModal();
    addTaskBtn.classList.replace("d-block", "d-none");
    updateBtn.classList.replace("d-none", "d-block");
  }
}

function updateTask() {
  let uniqueID = updateID;
  let task = tasksList.findIndex((task) => task.id === uniqueID);
  tasksList[task].title = title.value.trim();
  tasksList[task].status = statusInput.value.trim();
  tasksList[task].category = categoryInput.value.trim();
  tasksList[task].description = descriptionTextArea.value.trim();
  setToLocalStorage();
  displayAllTasks();
  addTaskBtn.classList.replace("d-none", "d-block");
  updateBtn.classList.replace("d-block", "d-none");
  hideModal();
  clearForm();
}

// ? =========> change bg-color

const backgrounds = [
  "#000000",
  "#E72929",
  "#9376E0",
  "#FDF4F5",
  "#404040",
  "#5BBCFF",
  "#F0F3FF",
];
const fontColors = [
  "#FFFFFF",
  "#FFFDD7",
  "#F6FFA6",
  "#808080",
  "#C0DBEA",
  "#FFFAB7",
  "#211951",
];

function changeColor(e, taskId) {
  const colorIndex = Math.floor(Math.random() * backgrounds.length);
  let bgColorx = backgrounds[colorIndex];
  let fnColorx = fontColors[colorIndex];
  let index = tasksList.findIndex((task) => task.id === taskId);
  console.log(index);
  tasksList[index].bgColor = bgColorx;
  tasksList[index].fnColor = fnColorx;
  setToLocalStorage();
  e.target.closest(".myTask").style.backgroundColor = bgColorx;
  e.target.closest(".myTask").style.color = fnColorx;
}

// ? =========> change Mode
const darkModeVars = {
  "--main-black": "#0d1117",
  "--sec-black": "#161b22",
  "--finance-color": "#30a277",
  "--health-color": "#fb882e",
  "--productivity-color": "#fc3637",
  "--education-color": "#2e4acd",
  "--mid-gray": "#474a4e",
  "--gray-color": "#dadada",
  "--text-color": "#a5a6a7",
  "--border-default-color": "#2a2a2a",
};

const lightModeVars = {
  "--main-black": "#f5f5f5",
  "--sec-black": "#ffffff",
  "--finance-color": "#267355",
  "--health-color": "#c7631f",
  "--productivity-color": "#c12a2b",
  "--education-color": "#1e37a8",
  "--mid-gray": "#b0b0b0",
  "--gray-color": "#5c5c5c",
  "--text-color": "#1a1a1a",
  "--border-default-color": "#e0e0e0",
};

function darkMode() {
  //Returns an array of key/values -- - ||- -- destructing
  Object.entries(darkModeVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

function lightMode() {
  Object.entries(lightModeVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

function changeMode() {
  if (mode.classList.contains("bi-brightness-high-fill")) {
    lightMode();
    mode.classList.replace("bi-brightness-high-fill", "bi-moon-stars-fill");
  } else {
    darkMode();
    mode.classList.replace("bi-moon-stars-fill", "bi-brightness-high-fill");
  }
}

function clearForm() {
  title.value = "";
  descriptionTextArea.value = "";
}

function logOut() {
  localStorage.removeItem("loggedUser");
  window.location.href = "https://amirsakrgh.github.io/to_do_list/sign-in.html";
}

// ? =========> change View
function changeViewToBar() {
  barsBtn.classList.add("active");
  gridBtn.classList.remove("active");

  sections.forEach((section) => {
    section.classList.remove("col-lg-4", "col-md-6");
    section.style.overflow = "auto";
  });

  tasks.forEach((task) => {
    task.setAttribute("data-view", "bars");
  });
}

function changeViewToGrid() {
  gridBtn.classList.add("active");
  barsBtn.classList.remove("active");

  sections.forEach((section) => {
    section.classList.add("col-lg-4", "col-md-6");
    section.style.overflow = "";
  });

  tasks.forEach((task) => {
    task.removeAttribute("data-view");
  });
}

// ? =========> Validate
function validate(element, regex) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    element.parentElement.nextElementSibling.classList.replace(
      "d-block",
      "d-none"
    );
    return true;
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    element.parentElement.nextElementSibling.classList.replace(
      "d-none",
      "d-block"
    );
    return false;
  }
}

// ? =========> Events
newTaskBtn.addEventListener("click", showModal);
addTaskBtn.addEventListener("click", addTask);

modal.addEventListener("click", function (e) {
  if (e.target.id == "modal") {
    hideModal();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.key == "Escape") {
    hideModal();
  }
});

searchInput.addEventListener("input", searchForTask);

updateBtn.addEventListener("click", updateTask);

tasksContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("update")) {
    const taskId = e.target.closest(".myTask").dataset.id;
    getTaskInfo(Number(taskId));
  } else if (e.target.classList.contains("delete")) {
    const taskId = e.target.closest(".myTask").dataset.id;
    deleteTask(Number(taskId));
  } else if (e.target.classList.contains("changeColor")) {
    const taskId = e.target.closest(".myTask").dataset.id;
    changeColor(e, Number(taskId));
  }
});

navbar.addEventListener("click", function (e) {
  if (e.target.getAttribute("ID") == "gridBtn") {
    changeViewToGrid();
  } else if (e.target.getAttribute("ID") == "barsBtn") {
    changeViewToBar();
  } else if (e.target.getAttribute("ID") == "mode") {
    changeMode();
  }
});

title.addEventListener("input", function () {
  validate(title, titleRegEx);
});
descriptionTextArea.addEventListener("input", function () {
  validate(descriptionTextArea, descriptionRegEx);
  const maxLength = 200;
  const remaining = maxLength - descriptionTextArea.value.length;
  remainingCounter.textContent = remaining;
});

logOutBtn.addEventListener("click", logOut);

// document.addEventListener("DOMContentLoaded", function () {
// });
