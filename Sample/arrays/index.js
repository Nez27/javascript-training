// Introduction to Arrays

const teammates = ["Nezumi", "Khue", "Dat"];
console.log(teammates);

const year = new Array(2001, 1998, 2004, 2005);

console.log(teammates[0]);
console.log(teammates[2]);

console.log(teammates.length);
console.log(teammates[teammates.length - 1]);

teammates[2] = "Huy";
console.log(teammates);

const firstName = "Jonas";
const jonas = [firstName, "Schmedtmann", 2037 - 1991, "teacher", teammates];
console.log(jonas);
console.log(jonas.length);

// Basic Array Operations (Methods)
// Add elements
const newLength = teammates.push("Lien");
console.log(teammates);
console.log(newLength);

teammates.unshift("Dat");
console.log(teammates);

// Remove elements
teammates.pop(); // Last
const popped = teammates.pop();
console.log(popped);
console.log(teammates);

teammates.shift(); // First
console.log(teammates);

console.log(teammates.indexOf("Nezumi"));
console.log(teammates.indexOf("Khue"));

teammates.push(23);
console.log(teammates.includes("Nezumi"));
console.log(teammates.includes("Khue"));
console.log(teammates.includes(23));

if (teammates.includes("Nezumi")) {
  console.log("You have teammate who is name Nezumi");
}
