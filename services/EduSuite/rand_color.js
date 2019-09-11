'use strict';
window.onload = onPageLoad;
function onPageLoad() {
  setColorScheme();
}

function setColorScheme() {
  var scheme = generateColorScheme();
  var style = document.createElement('style');
  style.innerHTML = `
    body {
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
  if (primary_color) { // "" is falsey; semantically is primary color is present
    schemes[0].push(primary_color);
    schemes[0].push("#5C88C7");
    schemes[0].push("#0465B2");
  }
  schemes = (schemes.length == 0) ?
              {0: ["#AEC7DC", "#5C88C7", "#0465B2"],
              1: ["#7C6BAF", "#B8B0D7", "#583091"],
              2: ["#FC801C", "#F5A870", "#FED9C6"]}
              : schemes;

  //var arr = Object.keys(schemes);
  //return schemes[0];
  return schemes[Math.floor(Math.random() * schemes.length)];
}
