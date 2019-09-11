function makeCookie(key, value, hours_till_expire=1) {
  var date = new Date();
  date.setTime(date.getTime() + (hours_till_expire*60*60*1000));
  var expires = "expires=" + date.toGMTString();
  document.cookie = key + "=" + value + ";" + expires + ";path=/;";
}

function getCookie(name) {
  var name_pattern = RegExp.new(name + "=(.*)");
  var decodedCookie = decodeURIComponent(document.cookie); // why needed?
  //console.log("Decoded: " + decodedCookie);
  var crumbs = decodedCookie.split(';');
  for(var crumb in crumbs) {
    var result = crumb.match(name_pattern);
    if (result != null) {
      return result[0];
    }
  } return "";
}
function saveToCookies(changes) {
  for (var change in changes) {
    makeCookie(change, changes[change]);
  }
}
