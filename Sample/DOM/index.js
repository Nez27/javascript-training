const img = document.querySelector("img");

console.log(img.hasAttribute("src"));
console.log(img.getAttribute("src"));
img.removeAttribute("src");

img.setAttribute(
  "src",
  "https://cdn.discordapp.com/attachments/1090895809098289185/1140311522883670217/make_exp_1.jpg"
);
img.setAttribute("width", "711.2");
img.setAttribute("height", "400px");

// Select the first div
const div = document.querySelector("div");

// Assign the warning class to the first div
div.className = "warning";

// Select the second div by class name
const activeDiv = document.querySelector(".active");

activeDiv.classList.add("hidden"); // Add the hidden class
// activeDiv.classList.remove("hidden"); // Remove the hidden class
activeDiv.classList.toggle("hidden"); // Switch between hidden true and false
activeDiv.classList.replace("active", "warning"); // Replace active class with warning class

// Select div
const myDiv = document.querySelector(".myDiv");

console.log(myDiv);
// Apply style to div
myDiv.setAttribute("style", "text-align: center");
myDiv.style.height = "200px";
myDiv.style.width = "500px";
myDiv.style.border = "2px solid black";

myDiv.style.borderRadius = "50%";
myDiv.style.display = "flex";
myDiv.style.justifyContent = "center";
myDiv.style.alignItems = "center";
