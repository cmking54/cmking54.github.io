'use strict';
var changes = {};
function save_school_page() {
  console.log(document.cookie);
  console.log(changes);
  for (var change in changes) {
    makeCookie(change, changes[change]);
  }
  console.log(document.cookie);

}
function change_primary_color(choice) {
  var hex_color = "#" + choice;
  document.getElementsByTagName('body')[0].style.backgroundColor = hex_color;
  //checkChanged('title');
  changes['primary_color'] = hex_color;
}
function changeTitle(choice) {
  document.getElementsByTagName('h1')[0].innerText = choice.value;
  changes['title'] = choice.value;
}
function checkChanged(prop) {
  if (!changed.hasOwnProperty(prop)) changed[prop] = true;
}
function makeCookie(key, value, hours_till_expire=1) {
  var date = new Date();
  date.setTime(date.getTime() + (hours_till_expire*60*60*1000));
  var expires = "expires=" + date.toGMTString();
  console.log(key, value);
  document.cookie = key + "=" + value + ";" + expires + ";path=/;";
  // initial setup
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
