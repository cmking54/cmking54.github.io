'use strict';
var changes = {};
function save_school_page() {
  saveToCookies(changes);
}
function change_primary_color(choice) {
  var hex_color = "#" + choice;
  document.getElementsByTagName('body')[0].style.backgroundColor = hex_color;
  changes['primary_color'] = hex_color;
}
function changeTitle(choice) {
  document.getElementsByTagName('h1')[0].innerText = choice.value;
  changes['title'] = choice.value;
}
