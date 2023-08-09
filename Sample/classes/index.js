class Person {
  name;
  age(year) {
    return 2023 - year;
  }

  constructor(name) {
    this.name = name;
  }

  printMessage() {
    console.log(`Hello, I'm ${this.name}`);
  }

  static printAge() {
    console.log("I'm 22 years old!");
  }
}

const nezumiUser = new Person();

nezumiUser.name = "Example name";

console.log(nezumiUser["name"]);
console.log(nezumiUser.name);
console.log(nezumiUser.age(2001));

const anotherUser = new Person("Nezumi");
anotherUser.printMessage();

Person.printAge();
