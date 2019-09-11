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

// function getCookie(name) {
//   var name_pattern = new RegExp(name + "=(.*)");
//   var decodedCookie = decodeURIComponent(document.cookie); // why needed?
//   //console.log("Decoded: " + decodedCookie);
//   var crumbs = decodedCookie.split(';');
//   console.log(crumbs);
//   for(var crumb in crumbs) {
//     console.log(crumb);
//     var result = crumb.match(name_pattern);
//     console.log(result);
//     if (result != null) {
//       return result[0];
//     }
//   } return "";
// }

function saveToCookies(changes) {
  for (var change in changes) {
    makeCookie(change, changes[change]);
  }
}
