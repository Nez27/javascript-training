// Inline event handler attributes

// Function to modify the text content of the paragraph
// const changeText = () => {
//   const p = document.querySelector("p");

//   p.textContent = "I changed because of an event handler property.";
// };

// Add event handler as a property of the button element
// const p = document.querySelector("p");
// const button = document.querySelector("button");

// const changeText = () => {
//   p.textContent = "Will I change?";
// };

// const alertText = () => {
//   alert("Will I alert?");
// };

// // Events can be overwritten
// button.onclick = changeText;
// button.onclick = alertText;

// Event listeners
// Function to modify the text content of the paragraph
const p = document.querySelector("p");
const button = document.querySelector("button");

const changeText = () => {
  p.textContent = "Will I change?";
};

const alertText = () => {
  alert("Will I alert?");
};

// Multiple listeners can be added to the same event and element
// button.addEventListener("click", changeText);
// button.addEventListener("click", alertText);

// button.addEventListener("dblclick", changeText);
// button.addEventListener("mouseenter", changeText);
// button.addEventListener("mouseleave", changeText);
// button.addEventListener("mousemove", changeText);

// Test the key and code properties
// document.addEventListener("keydown", (event) => {
//   console.log("key: " + event.key);
//   console.log("code: " + event.code);
// });

// Pass an event through to a listener
/*
document.addEventListener("keydown", (event) => {
  var element = document.querySelector("p");

  // Set variables for keydown codes
  var a = "KeyA";
  var s = "KeyS";
  var d = "KeyD";
  var w = "KeyW";

  // Set a direction for each code
  switch (event.code) {
    case a:
      element.textContent = "Left";
      break;
    case s:
      element.textContent = "Down";
      break;
    case d:
      element.textContent = "Right";
      break;
    case w:
      element.textContent = "Up";
      break;
  }
});
*/

// const section = document.querySelector("section");

// // Print the selected target
// section.addEventListener("click", (event) => {
//   console.log(event.target);
// });

const person = {
  firstName: "Phan",
  lastName: "Huu Loi",
  age: 22,
};

localStorage.setItem("test", 1);
localStorage.setItem("person", JSON.stringify(person));

for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
  alert(`${key}: ${localStorage.getItem(key)}`);
}
