// Basic Operators
// Math operators
const now = 2023;
const ageNezumi = now - 2001;
const ageSarah = now - 2006;
console.log(ageNezumi, ageSarah);

console.log(ageNezumi * 2, ageNezumi / 10, 2 ** 3);
// 2 ** 3 means 2 to the power of 3 = 2 * 2 * 2

const firstName = "Phan";
const lastName = "Nezumi";
console.log(firstName + " " + lastName);

// Assignment operators
let a = 10 + 5; // 15
a += 10; // a = a + 10 = 25
a *= 4; // a = a * 4 = 100
a++; // a = a + 1
a--;
a--;
console.log(a);

// Comparison operators
console.log(ageNezumi > ageSarah); // >, <, >=, <=
console.log(ageSarah >= 18);

console.log(now - 1991 > now - 2018);

////////////////////////////////////
// Operator Precedence

console.log(now - 2001 > now - 2006);

let t, u;
t = u = 25 - 10 - 5; // x = y = 10, x = 10
console.log(t, u);

const averageAge = (ageNezumi + ageSarah) / 2;
console.log(ageNezumi, ageSarah, averageAge);
