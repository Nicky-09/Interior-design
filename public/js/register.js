const inputs = document.querySelectorAll(".input");

function addcl() {
  let parent = this.parentNode.parentNode;
  parent.classList.add("focus");
}

function remcl() {
  let parent = this.parentNode.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", addcl);
  input.addEventListener("blur", remcl);
});

async function myFunc(e) {
  e.preventDefault();
  var firstName = document.getElementById("fname").value;
  var lastName = document.getElementById("lname").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  // validation
  console.log(firstName, lastName, email, password);

  const payload = {
    firstName,
    lastName,
    email,
    password,
  };

  const response = await fetch("http://localhost:3002/register", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  console.log(result);
  if (result.error === false) {
    window.location.href = "/";
  }
}

var password = document.getElementById("password"),
  confirm_password = document.getElementById("confirm_password");

function validatePassword() {
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity("");
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

var userRegistered = [];

function storeUserRegistered() {
  localStorage.users = JSON.stringify(userRegistered);
}

function getRegisteredUser() {
  if (!localStorage.users) {
    localStorage.users = JSON.stringify([]);
  } else {
    userRegistered = JSON.parse(localStorage.users);
  }
}

function checkValidation() {
  var name = document.getElementById("name");
  var uname = document.getElementById("uname");
  var password = document.getElementById("password");
  var email = document.getElementById("email");
  if (isAlphabetic(name, "enter a valid name")) {
    if (
      isUnameValid(
        uname,
        "enter a valid username (min length:4 & max lentgh:8)"
      )
    ) {
      if (isEmail(email, "enter a valid email")) {
        var user = {
          name: name.value,
          uname: uname.value,
          password: password.value,
          email: email.value,
        };
        userRegistered.push(user);
        console.log(userRegistered);
        storeUserRegistered();
        return true;
      }
    }
  }
  return false;
}

function isAlphabetic(name, msg) {
  var expr = /^[A-Za-z ]{1,20}$/;
  var isValid = expr.test(name.value);
  console.log(name.value);
  console.log(isValid);
  if (isValid == false) {
    name.setCustomValidity(msg);
    return false;
  } else {
    name.setCustomValidity("");
    return true;
  }
}

function isUnameValid(uname, msg) {
  var expr = /^[A-Za-z0-9_]{4,10}$/;
  var isValid = expr.test(uname.value);
  if (isValid == false) {
    uname.setCustomValidity(msg);
    return false;
  } else {
    uname.setCustomValidity("");
    if (checkIfUnameExist()) {
      return true;
    } else {
      uname.setCustomValidity("username already exist");
      return false;
    }
  }
}

function isEmail(email, msg) {
  var expr = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  var isValid = expr.test(email.value);
  if (isValid == false) {
    email.setCustomValidity(msg);
    return false;
  } else {
    if (checkIfEmailExist()) {
      return true;
    } else {
      email.setCustomValidity("email already exist");
      return false;
    }
  }
}

function checkIfUnameExist() {
  for (i = 0; i < userRegistered.length; i++) {
    if (uname.value == userRegistered[i].uname) {
      return false;
    }
  }
  return true;
}
function checkIfEmailExist() {
  for (i = 0; i < userRegistered.length; i++) {
    if (email.value == userRegistered[i].email) {
      return false;
    }
  }
  return true;
}
