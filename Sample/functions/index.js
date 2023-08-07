// Functions
function logger() {
  console.log("My name is Nezumi");
}

// calling / running / invoking function
logger();
logger();

function demoFunction(num1, num2) {
  const juice = `Juice with ${num1} apples and ${num2} oranges.`;
  return juice;
}

const variables1 = demoFunction(5, 0);
console.log(variables1);

const variables2 = demoFunction(2, 4);
console.log(variables2);

const num = Number("23");

// Function Declarations vs. Expressions

// Function declaration
function declarationFunction(year) {
  return 2023 - year;
}
const age1 = declarationFunction(2001);

// Function expression
const expressionFunction = function (year) {
  return 2037 - year;
};
const age2 = expressionFunction(1991);

console.log(age1, age2);

// Arrow functions

const arrowFunction = (birthYeah) => 2023 - birthYeah;
const age3 = arrowFunction(1991);
console.log(age3);

const anotherArrowFunction = (birthYeah, fullName) => {
  const age = 2037 - birthYeah;
  const retirement = 65 - age;
  // return retirement;
  return `${fullName} retires in ${retirement} years`;
};

console.log(anotherArrowFunction(1991, "Nezumi"));
console.log(anotherArrowFunction(1980, "Khue"));

// Functions Calling Other Functions
function cutFruitPieces(fruit) {
  return fruit * 4;
}

function fruitProcessor(apples, oranges) {
  const applePieces = cutFruitPieces(apples);
  const orangePieces = cutFruitPieces(oranges);

  const juice = `Juice with ${applePieces} piece of apple and ${orangePieces} pieces of orange.`;
  return juice;
}
console.log(fruitProcessor(5, 8));
