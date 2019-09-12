function saveImage(img_src, img_name) {
  var storageFiles = JSON.parse(localStorage.getItem("storageFiles")) || {};

  img_src.addEventListener("load", function () {
        var imgCanvas = document.createElement("canvas"),
            imgContext = imgCanvas.getContext("2d");

        // Make sure canvas is as big as the picture
        imgCanvas.width = img_src.width;
        imgCanvas.height = img_src.height;

        // Draw image into canvas element
        imgContext.drawImage(img_src, 0, 0, img_src.width, img_src.height);

        // Save image as a data URL
        storageFiles[img_name] = imgCanvas.toDataURL("image/png");


        // Save as JSON in localStorage
        try {
            localStorage.setItem("storageFiles", JSON.stringify(storageFiles));
        }
        catch (e) {
            console.log("Storage failed: " + e);
        }
    }, false);
  }
function getImage(name) {
  var storageFiles = JSON.parse(localStorage.getItem("storageFiles")) || {};
  return storageFiles[name];
}


//ES 6: export { saveImage, getImage };
