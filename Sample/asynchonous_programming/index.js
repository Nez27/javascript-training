// Callbacks

const task1 = (callAgain) => {
  setTimeout(() => {
    callAgain("Task 1");
  }, 2000);
};

// Promise

var promise = new Promise(
  // Executor
  function (resolve, reject) {
    // Logic
    // Successfull: resolve()
    // Failure: reject()

    task1((result) => {
      resolve(result);
    });
  }
);

promise
  .then(function (number) {
    console.log("Then 1");
    return number;
  })
  .then(function (data) {
    return new Promise(function (resolve) {
      console.log(`Then 2: ${data}`);
      setTimeout(function () {
        resolve(1000);
      }, 5000);
    });
  })
  .then(function (data) {
    console.log(`Then 3: ${data}`);
  })
  .catch(function () {
    console.log("Failure!");
  })
  .finally(function () {
    console.log("Done!");
  });

// Async, await

const getNewToDo = async () => {
  let response = await fetch("https://jsonplaceholder.typicode.com/posts");
  let data = await response.json();
  return data;
};

getNewToDo().then((data) => {
  console.log(">>> Data: ", data);
});
