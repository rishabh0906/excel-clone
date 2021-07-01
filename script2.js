 let menuBarPtags = document.querySelectorAll(".menu-bar p");

let fileOptions = menuBarPtags[0];

fileOptions.addEventListener("click", function (e) {
  if (e.currentTarget.classList.length == 0) {
    e.currentTarget.innerHTML = `File
    <span>
     <span>Clear</span>
     <span>Open</span>
     <span>Save</span>
    </span>`;
  } else {
    e.currentTarget.innerHTML = `File`;
  }
});