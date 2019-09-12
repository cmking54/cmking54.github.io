'use strict';
// import {saveImage}  from "./modules/local_storage.js"; // test me
var changes = {};
function save_school_page() {
  saveToCookies(changes);
}
function change_primary_color_html(choice) {
  var color_formatted = choice.value.replace(" ", "");
  if (isColor(color_formatted)) {
    document.body.style.backgroundColor = color_formatted;
    changes['primary_color'] = color_formatted;
  }
}
function change_primary_color(choice) {
  var hex_color = "#" + choice;
  document.body.style.backgroundColor = hex_color;
  changes['primary_color'] = hex_color;
}
function change_secondary_color_html(choice) {
  var color_formatted = choice.value.replace(" ", "");
  if (isColor(color_formatted)) {
    document.body.style.color = color_formatted;
    changes['secondary_color'] = color_formatted;
  }
}
function change_secondary_color(choice) {
  var hex_color = "#" + choice;
  document.body.style.color = hex_color;
  changes['secondary_color'] = hex_color;
}
function changeTitle(choice) {
  document.getElementsByTagName('h1')[0].innerText = choice.value;
  changes['title'] = choice.value;
}
function getLogo(choice) { // recieve file
  var logo = document.getElementById('logo'); // get logo spot
  var reader = new FileReader();
  reader.onload = function (e) {
  // get loaded data and render thumbnail.
    logo.src = e.target.result; // data uri
    logo.alt = choice.files[0].name;
  };
  // read the image file as a data URL.
  reader.readAsDataURL(choice.files[0]);
  saveImage(logo, 'logo');
}
const isColor = (strColor) => { // change to function notation?
  const s = new Option().style;
  s.color = strColor;
  return s.color !== '';
}
