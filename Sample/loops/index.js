const info = ["Nezumi", 12, "student", ["Khue", "Huy", "Dat"], true];
let i = 0;
// While loops
while (i < info.length) {
  console.log(info[i]);
  i++;
}

// For loops
console.log("---For loops---");
for (let index = info.length - 1; index >= 0; index--) {
  console.log(i, info[index]);
}

// For...of loops
console.log("---For ... of loops---");
for (const value of info) {
  console.log(value);
}
