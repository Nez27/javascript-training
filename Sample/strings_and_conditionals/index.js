// Strings and Template Literals
const fullName = "Nezumi";
const job = "Grab Bike";
const birthYear = 2001;
const year = 2023;

const nezumi =
  "I'm " + fullName + ", a " + (year - birthYear) + " year old " + job + "!";
console.log(nezumi);

const nezumiNew = `I'm ${fullName}, a ${year - birthYear} year old ${job}!`;
console.log(nezumiNew);

console.log(`Hello World!`);

console.log(
  "String with \n\
multiple \n\
lines"
);

console.log(`String
multiple
lines`);

// if / else Statements
const age = 15;

if (age >= 18) {
  console.log("Nezumi is over 18 years!");
} else {
  const yearsLeft = 18 - age;
  console.log(`Nezumi is to young. Waiting more ${yearsLeft} years.`);
}

const mark = 10;

let classification;
if (mark === 10) {
  classification = "Excellent";
} else {
  classification = "Good";
}
console.log(classification);
