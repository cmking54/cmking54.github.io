'use strict';
var changes = {};
function save_school_page() {
  console.log(document.cookie);
  for (var change in Object.entries(changes)) {
    makeCookie(change, 1/360);
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
function makeCookie(key_value, hours_till_expire) {
  var date = new Date();
  date.setTime(date.getTime() + (hours_till_expire*60*60*1000));
  var expires = "expires=" + date.toGMTString();
  document.cookie = key_value[0] + "=" + key_value[1] + ";" + expires + ";path=/;";
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
