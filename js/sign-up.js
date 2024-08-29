import {
  emailRegEx,
  nameRegEx,
  passwordRegEx,
  validate,
} from "./validation.js";

// ? ======> HTML ELEMENTS
const firstNameInput = document.getElementById("firstNameInput");
const lastNameInput = document.getElementById("lastNameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const form = document.querySelector("form");

const signUpBtn = document.getElementById("signUp");
const successModal = document.querySelector(".sign-success");

// ? ======> Global Variables
let users = JSON.parse(localStorage.getItem("users")) || [];

// ? ======> Functions
function signUp() {
  let checkExist = users.find((u) => u.email == emailInput.value);
  if (
    validate(firstNameInput, nameRegEx) &&
    validate(lastNameInput, nameRegEx) &&
    validate(emailInput, emailRegEx) &&
    validate(passwordInput, passwordRegEx)
  ) {
    if (checkExist) {
      signUpBtn.nextElementSibling.classList.replace("d-none", "d-block");
      signUpBtn.nextElementSibling.innerHTML = '<i class="fa-solid fa-triangle-exclamation pe-2"></i> Email Aleardy Exist';
      return;
    }

    signUpBtn.nextElementSibling.classList.replace("d-block", "d-none");

    let userInfo = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    };
    users.push(userInfo);
    localStorage.setItem("users", JSON.stringify(users));
    successModal.classList.replace("d-none","d-flex");
  } else {
    signUpBtn.nextElementSibling.innerHTML = '<i class="fa-solid fa-triangle-exclamation pe-2"></i>Please fill in all fields';
    signUpBtn.nextElementSibling.classList.replace("d-none", "d-block");
  }
}

// ? ======> Events

signUpBtn.addEventListener("click", signUp);
firstNameInput.addEventListener("input", function () {
  validate(firstNameInput, nameRegEx);
});
lastNameInput.addEventListener("input", function () {
  validate(lastNameInput, nameRegEx);
});
emailInput.addEventListener("input", function () {
  validate(emailInput, emailRegEx);
});
passwordInput.addEventListener("input", function () {
  validate(passwordInput, passwordRegEx);
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
});
