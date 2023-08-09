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

let key = prompt("What do you want to know about the user?");

alert(info[key]);

let fruit = prompt("Which fruit to buy?", "apple");

let bag = {
  [fruit]: 5, // the name of the property is taken from the variable fruit
};

alert(bag.melon);

let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50,
  },
};

let clone = Object.assign({}, user);

// user and clone share sizes
user.sizes.width = 60; // change a property from one place

console.log(user.sizes.width);
console.log(clone.sizes.width);
