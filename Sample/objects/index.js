const info = {
  fullName: "Nezumi",
  job: "student",
  friends: ["Khue", "Huy", "Dat"],
  age: (year) => {
    return 2023 - year;
  },
};

console.log(info);

console.log(info.fullName);
console.log(info["job"]);

const nameKey = "Name";
console.log(info["full" + nameKey]);

const year = prompt("Input your year of birth?");

if (year < 2023) {
  alert(`Your age is: ${info.age(year)}`);
} else {
  console.log("Invalid age! Please try again!");
}

info.location = "VietNam";
info["facebook"] = "Nezumi2711";
console.log(info);
