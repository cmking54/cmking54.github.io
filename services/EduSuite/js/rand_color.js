'use strict';
window.onload = onPageLoad;
function onPageLoad() {
  setColorScheme();
}

function setColorScheme() {
  var scheme = generateColorScheme();
  // console.log(scheme);
  var style = document.createElement('style');
  style.innerHTML = `
    .color_back {
      background-color: ` + scheme[2] + `;
    }
    .color_primary {
      background-color: ` + scheme[0] + `;
    }
    .color_secondary {
      background-color: ` + scheme[1] + `;
    }`;
    document.body.appendChild(style);
}
function generateColorScheme() {
  var schemes = [[]];
  var primary_color = getCookie('primary_color');
  var secondary_color = getCookie('secondary_color');
  if (primary_color) { // "" is falsey; semantically is primary color is present
    schemes[0].push(primary_color);
  } else {
    schemes[0].push("#AEC7DC");
  }
  if (secondary_color) {
    schemes[0].push(secondary_color);
  } else {
    schemes[0].push("#5C88C7");
  }
  if (primary_color || secondary_color) {
    schemes[0].push("#CFCFC4");
    return schemes[0];
  }
  schemes = {0: ["#AEC7DC", "#5C88C7", "#0465B2"],
              1: ["#7C6BAF", "#B8B0D7", "#583091"],
              2: ["#FC801C", "#F5A870", "#FED9C6"]};
  var arr = Object.keys(schemes);
  //return schemes[0];
  return schemes[Math.floor(Math.random() * arr.length)];
}
