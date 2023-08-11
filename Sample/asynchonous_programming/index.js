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

const getJSON = (url, errorMsg = "Something went wrong") => {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const printInforCountry = (data) => {
  console.log(`Native name: ${data.nativeName}`);
  console.log(`Capital: ${data.capital}`);
  console.log(`Population: ${data.population}`);
};

const getCountryData = function (country) {
  // Country 1
  getJSON(
    `https://countries-api-836d.onrender.com/countries/name/${country}`,
    "Country not found!"
  )
    .then((data) => {
      printInforCountry(data[0]);

      const neighbour = data[0].borders?.[0];
      if (!neighbour) throw new Error("No neighbour found!");
      // Country 2
      return getJSON(
        `https://countries-api-836d.onrender.com/countries/alpha/${neighbour}`,
        "Country not found!"
      );
    })
    .then((data) => {
      console.log(`----------Neighbour Contry-----------`);
      printInforCountry(data);
    })
    .catch((err) => {
      console.error(`Something went wrong 💥💥 ${err.message}. Try again!`);
    })
    .finally(() => console.log("End!"));
};

getCountryData("vietnam");
