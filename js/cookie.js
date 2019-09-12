function makeCookie(key, value, hours_till_expire=1) {
  var date = new Date();
  date.setTime(date.getTime() + (hours_till_expire*60*60*1000));
  var expires = "expires=" + date.toGMTString();
  document.cookie = key + "=" + value + ";" + expires + ";path=/;";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
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

function saveToCookies(changes) {
  for (var change in changes) {
    makeCookie(change, changes[change]);
  }
}
