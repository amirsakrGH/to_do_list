import { emailRegEx, passwordRegEx, validate } from "./validation.js";

// ? ======> HTML ELEMENTS
const form = document.querySelector("form");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");

const signInBtn = document.getElementById("signIn");
const signinFailed = document.getElementById("signin-failed");
const tryAgainBtn = document.getElementById("btn-try");

// ? ======> Global Variables
let users = JSON.parse(localStorage.getItem("users")) || [];

// ? ======> Functions
function signIn() {
  let checkExist = users.find(
    (u) => u.email == emailInput.value && u.password == passwordInput.value
  );
  if (
    validate(emailInput, emailRegEx) &&
    validate(passwordInput, passwordRegEx)
  ) {
    if (checkExist) {
      let status = {
        logged: true,
        email: emailInput.value,
      };
      localStorage.setItem("loggedUser", JSON.stringify(status));
      signinFailed.classList.replace("d-flex", "d-none");
      window.location.href = "https://amirsakrgh.github.io/to_do_list/index.html";
      return;
    } else {
      signinFailed.classList.replace("d-none", "d-flex");
    }
  }
}

// ? ======> Events

signInBtn.addEventListener("click", signIn);

emailInput.addEventListener("input", function () {
  validate(emailInput, emailRegEx);
});
passwordInput.addEventListener("input", function () {
  validate(passwordInput, passwordRegEx);
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
});

tryAgainBtn.addEventListener("click", function () {
  signinFailed.classList.replace("d-flex", "d-none");
  passwordInput.value = "";
});
