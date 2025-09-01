let jsonData;
const ulElement = document.getElementById("extensions");
const filterRadios = document.querySelectorAll('input[name="filter"]');
let filter = "all";
const modeBtn = document.getElementById("mode-btn");
const body = document.querySelector("body");

function addToggleListeners() {
  const toggles = document.querySelectorAll('input[type="checkbox"]');
  toggles.forEach((toggle) => {
    toggle.addEventListener("change", (e) => {
      const extensionName = e.target.name.replace("-toggle", "");
      jsonData = jsonData.map((item) => {
        if (item.name === extensionName) {
          item.isActive = e.target.checked;
        }
        return item;
      });
      localStorage.setItem("extensions", JSON.stringify(jsonData));
    });
  });
}

function addRemoveListeners() {
  const removeButtons = document.querySelectorAll("button.remove");
  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const extensionName = e.target.id.replace("-remove", "");
      jsonData = jsonData.filter((item) => item.name !== extensionName);
      localStorage.setItem("extensions", JSON.stringify(jsonData));
      updateDom(jsonData, filter);
    });
  });
}

function updateDom(data, filter) {
  let html = "";
  data.forEach((item) => {
    if (filter === "active" && !item.isActive) return;
    if (filter === "inactive" && item.isActive) return;
    html += `
            <li class="extension panel">
                <div class="flex">
                    <img src="${item.logo}" alt="${item.name} logo" />
                    <div>
                        <h2>${item.name}</h2>
                        <p>${item.description}</p>
                    </div>
                </div>
                <div class="flex">
                    <button class="remove" id="${item.name.replace(
                      " ",
                      "-"
                    )}-remove">Remove <span class="sr-only">${
      item.name
    } extension</span></button>
                    <label class="toggle-switch" >
                        <input type="checkbox" name="${item.name.replace(
                          " ",
                          "-"
                        )}-toggle" id="${item.name.replace(" ", "-")}-toggle" ${
      item.isActive ? "checked" : ""
    } />
                        <span class="slider"></span>
                        <span class="sr-only">enable/disable ${
                          item.name
                        } extension</span>
                    </label>
                </div>
            </li>
        `;
  });

  ulElement.innerHTML = html;
  addToggleListeners();
  addRemoveListeners();
}

// toggle light/dark mode
modeBtn.addEventListener("click", () => {
  const mode = body.classList.value;
  if (mode.includes("light-mode")) {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
    localStorage.setItem("mode", "dark-mode");
  } else {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    localStorage.setItem("mode", "light-mode");
  }
});

// set initial mode based on localStorage
document.addEventListener("DOMContentLoaded", () => {
  const savedMode = localStorage.getItem("mode") || "light-mode";
  body.classList.remove("light-mode", "dark-mode");
  body.classList.add(savedMode);
});

// filter extensions based on radio button selection
filterRadios.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    filter = e.target.value;
    updateDom(jsonData, filter);
  });
});

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    const savedData = localStorage.getItem("extensions");
    jsonData = savedData ? JSON.parse(savedData) : data;
    updateDom(jsonData, filter);
  });
