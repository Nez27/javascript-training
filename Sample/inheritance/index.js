// Inheritance

class Animal {
  hello() {
    return "I'm not define animal yet!";
  }
}

class Cat extends Animal {
  hello() {
    return super.hello() + " Now, I'm a cat.";
  }
}

class Dog extends Animal {
  hello() {
    return "I'm a dog.";
  }
}

const cat = new Cat();
console.log(cat.hello());

const dog = new Dog();
console.log(dog.hello());
