'use strict';
// import {saveImage}  from "./modules/local_storage.js"; // test me
var changes = {};

function save_profile_page(source) {
    saveToCookies(changes);
    if (source == 'admin') {
      window.location.href = "admin_page.html";
    }
}
function getProfileName(choice, source) {
  changes[source + '_profile_name'] = choice.value;
}
function getEmail(choice, source) {
  changes[source + '_email'] = choice.value;
}
function getPassword(choice, source) {
  var first_password = document.getElementById(source + '_pw').value;
  // choice.classList.add("mx-2");
  // choice.classList.add("my-2");
  choice.style.borderWidth = "3px";
  if (first_password != choice.value) {
    //set border to red
    choice.style.borderColor = "red";
    // choice.classList.add("border");
    // choice.classList.remove("border-success");
    // choice.classList.add("border-danger");
  } else {
    //set border to green
    choice.style.borderColor = "green";
    // choice.classList.add("border");
    // choice.classList.remove("border-danger");
    // choice.classList.add("border-success");
    changes[source + '_pw'] = choice.value; // DO NOT DO THIS; SENSITIVE
  }
  console.log(choice.classList);
}
